#!/usr/bin/env node

/**
 * Analyze Cucumber test failures from GitHub Actions CI runs
 *
 * This script:
 * 1. Fetches the last 200+ failed CICD workflow runs on the main branch
 * 2. Parses logs to extract Cucumber test failures
 * 3. Identifies patterns in failing steps
 * 4. Generates a detailed markdown report
 *
 * Usage: node analyze-test-failures.mjs [options]
 * Options:
 *   --limit <n>    Number of failed runs to analyze (default: 200)
 *   --output <f>   Output file path (default: test-failure-analysis.md)
 *   --cache        Use cached workflow run data if available
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration
const CONFIG = {
	limit: parseInt(process.argv.find((arg, i) => process.argv[i - 1] === '--limit') || '200'),
	output: process.argv.find((arg, i) => process.argv[i - 1] === '--output') || 'test-failure-analysis.md',
	useCache: process.argv.includes('--cache'),
	cacheFile: '.test-failure-cache.json',
	workflowName: 'CICD',
};

// Color codes for console output
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Execute a shell command and return the output
 */
function exec(command) {
	try {
		return execSync(command, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
	} catch (error) {
		throw new Error(`Command failed: ${command}\n${error.message}`);
	}
}

/**
 * Fetch workflow runs using GitHub CLI
 */
function fetchWorkflowRuns() {
	log('Fetching workflow runs from GitHub...', 'cyan');

	// Get workflow runs for CICD on main branch, limited to failures
	// We fetch more than needed to ensure we get enough failed runs
	const limit = CONFIG.limit * 3; // Fetch 3x to account for successful runs
	const command = `gh run list --workflow="${CONFIG.workflowName}" --branch=main --limit=${limit} --json databaseId,number,status,conclusion,displayTitle,createdAt,url`;

	const output = exec(command);
	const allRuns = JSON.parse(output);

	// Filter for failed runs only
	const failedRuns = allRuns
		.filter(run => run.conclusion === 'failure')
		.slice(0, CONFIG.limit);

	log(`Found ${failedRuns.length} failed runs (out of ${allRuns.length} total runs)`, 'green');

	return failedRuns;
}

/**
 * Fetch logs for a specific workflow run
 */
function fetchRunLogs(runId) {
	try {
		const command = `gh run view ${runId} --log`;
		return exec(command);
	} catch (error) {
		log(`Warning: Failed to fetch logs for run ${runId}: ${error.message}`, 'yellow');
		return '';
	}
}

/**
 * Parse Cucumber failures from workflow logs
 *
 * Cucumber failures typically appear in the format:
 * ✖ Step text
 * or with error messages
 */
function parseCucumberFailures(logs, runInfo) {
	const failures = [];
	const lines = logs.split('\n');

	let currentFeature = null;
	let currentScenario = null;
	let inCucumberOutput = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Detect when we're in cucumber test output
		if (trimmedLine.includes('cucumber') || trimmedLine.includes('Cucumber')) {
			inCucumberOutput = true;
		}

		// Look for feature file indicators
		const featureMatch = trimmedLine.match(/features[/\\]([\w-]+\.feature)/);
		if (featureMatch) {
			currentFeature = featureMatch[1];
		}

		// Look for scenario names
		const scenarioMatch = trimmedLine.match(/Scenario:\s*(.+)/);
		if (scenarioMatch) {
			currentScenario = scenarioMatch[1].trim();
		}

		// Look for failed steps - Cucumber uses ✖ or × for failures
		if (inCucumberOutput && (trimmedLine.includes('✖') || trimmedLine.includes('×') ||
		    trimmedLine.match(/^\d+\)\s/))) {

			// Extract the step text
			let stepText = trimmedLine
				.replace(/^.*?[✖×]\s*/, '')
				.replace(/^\d+\)\s*/, '')
				.replace(/\s*#.*$/, '') // Remove step definition location
				.trim();

			// Look ahead for the actual step if this is just a number
			if (!stepText || /^\d+$/.test(stepText)) {
				for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
					const nextLine = lines[j].trim();
					if (nextLine.match(/^(Given|When|Then|And|But)\s/)) {
						stepText = nextLine;
						break;
					}
				}
			}

			// Look for error context in following lines
			let errorContext = '';
			for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
				const nextLine = lines[j].trim();
				if (nextLine.includes('Error:') || nextLine.includes('AssertionError')) {
					errorContext = nextLine.substring(0, 200); // Limit error message length
					break;
				}
			}

			if (stepText && stepText.match(/^(Given|When|Then|And|But)\s/)) {
				failures.push({
					feature: currentFeature || 'unknown',
					scenario: currentScenario || 'unknown',
					step: stepText,
					errorContext,
					runId: runInfo.number,
					runUrl: runInfo.url,
					createdAt: runInfo.createdAt,
				});
			}
		}

		// Reset scenario context on new feature or blank lines in some cases
		if (trimmedLine.startsWith('Feature:')) {
			currentScenario = null;
		}
	}

	return failures;
}

/**
 * Aggregate failures by step to identify patterns
 */
function aggregateFailures(allFailures) {
	const stepMap = new Map();

	for (const failure of allFailures) {
		const stepKey = failure.step;

		if (!stepMap.has(stepKey)) {
			stepMap.set(stepKey, {
				step: stepKey,
				count: 0,
				occurrences: [],
			});
		}

		const stepData = stepMap.get(stepKey);
		stepData.count++;
		stepData.occurrences.push({
			feature: failure.feature,
			scenario: failure.scenario,
			runId: failure.runId,
			runUrl: failure.runUrl,
			createdAt: failure.createdAt,
			errorContext: failure.errorContext,
		});
	}

	// Convert to array and sort by count (most frequent first)
	return Array.from(stepMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Generate markdown report
 */
function generateReport(failureStats, allFailures, totalRuns) {
	const now = new Date().toISOString().split('T')[0];

	let report = `# Cucumber Test Failure Analysis\n\n`;
	report += `**Generated:** ${now}\n\n`;
	report += `**Analysis Period:** Last ${totalRuns} failed CI runs on main branch\n\n`;

	// Summary statistics
	report += `## Summary\n\n`;
	report += `- **Total failed runs analyzed:** ${totalRuns}\n`;
	report += `- **Total Cucumber step failures found:** ${allFailures.length}\n`;
	report += `- **Unique failing steps:** ${failureStats.length}\n`;
	report += `- **Most common failing step:** ${failureStats[0]?.step || 'N/A'} (${failureStats[0]?.count || 0} occurrences)\n`;
	report += `\n`;

	// Check if we found any failures
	if (failureStats.length === 0) {
		report += `## No Cucumber Failures Found\n\n`;
		report += `No Cucumber test failures were detected in the analyzed workflow runs. This could mean:\n`;
		report += `- Tests are passing consistently\n`;
		report += `- Failures are occurring in other test types (unit/integration)\n`;
		report += `- The log parsing may need adjustment\n\n`;
		return report;
	}

	// Top 10 most frequently failing steps
	report += `## Top 10 Most Frequently Failing Steps\n\n`;
	report += `| Rank | Step | Failure Count | % of Total |\n`;
	report += `|------|------|---------------|------------|\n`;

	const top10 = failureStats.slice(0, 10);
	for (let i = 0; i < top10.length; i++) {
		const stat = top10[i];
		const percentage = ((stat.count / allFailures.length) * 100).toFixed(1);
		const stepPreview = stat.step.length > 80 ? stat.step.substring(0, 77) + '...' : stat.step;
		report += `| ${i + 1} | ${stepPreview} | ${stat.count} | ${percentage}% |\n`;
	}
	report += `\n`;

	// Detailed breakdown of each failing step
	report += `## Detailed Failure Analysis\n\n`;
	report += `Below is a detailed breakdown of each failing step, including all scenarios where it failed.\n\n`;

	for (let i = 0; i < failureStats.length; i++) {
		const stat = failureStats[i];
		report += `### ${i + 1}. ${stat.step}\n\n`;
		report += `**Total failures:** ${stat.count}\n\n`;

		// Group by feature/scenario
		const scenarioMap = new Map();
		for (const occurrence of stat.occurrences) {
			const key = `${occurrence.feature}::${occurrence.scenario}`;
			if (!scenarioMap.has(key)) {
				scenarioMap.set(key, {
					feature: occurrence.feature,
					scenario: occurrence.scenario,
					runs: [],
				});
			}
			scenarioMap.get(key).runs.push(occurrence);
		}

		report += `**Failed in ${scenarioMap.size} different scenario(s):**\n\n`;

		for (const [key, data] of scenarioMap) {
			report += `- **${data.feature}** → _${data.scenario}_ (${data.runs.length} time${data.runs.length > 1 ? 's' : ''})\n`;

			// Show a few example runs
			const exampleRuns = data.runs.slice(0, 3);
			for (const run of exampleRuns) {
				const date = new Date(run.createdAt).toLocaleDateString();
				report += `  - [Run #${run.runId}](${run.runUrl}) - ${date}`;
				if (run.errorContext) {
					report += `\n    - Error: \`${run.errorContext}\``;
				}
				report += `\n`;
			}

			if (data.runs.length > 3) {
				report += `  - _...and ${data.runs.length - 3} more occurrence(s)_\n`;
			}
		}

		report += `\n`;
	}

	// Raw data section
	report += `## Recommendations\n\n`;
	report += `Based on this analysis, consider:\n\n`;
	report += `1. **Focus on the top failing steps** - The most frequent failures likely indicate systemic issues\n`;
	report += `2. **Look for timing issues** - If failures are inconsistent, add explicit waits or retries\n`;
	report += `3. **Isolate and debug locally** - Run failing scenarios with increased logging\n`;
	report += `4. **Check for race conditions** - Steps that sometimes pass may have timing dependencies\n`;
	report += `5. **Review test setup/teardown** - Ensure tests are properly isolated\n\n`;

	return report;
}

/**
 * Main execution
 */
async function main() {
	log('='.repeat(60), 'bright');
	log('  Cucumber Test Failure Analyzer', 'bright');
	log('='.repeat(60), 'bright');
	log('');

	let workflowRuns;
	let cachedData = null;

	// Try to load cached data if requested
	if (CONFIG.useCache && existsSync(CONFIG.cacheFile)) {
		log('Loading cached workflow data...', 'cyan');
		try {
			cachedData = JSON.parse(readFileSync(CONFIG.cacheFile, 'utf8'));
			workflowRuns = cachedData.workflowRuns;
			log(`Loaded ${workflowRuns.length} runs from cache`, 'green');
		} catch (error) {
			log(`Failed to load cache: ${error.message}`, 'yellow');
			cachedData = null;
		}
	}

	// Fetch fresh data if not using cache
	if (!cachedData) {
		workflowRuns = fetchWorkflowRuns();

		// Save to cache
		const cacheData = {
			timestamp: new Date().toISOString(),
			workflowRuns,
		};
		writeFileSync(CONFIG.cacheFile, JSON.stringify(cacheData, null, 2));
		log(`Cached workflow data to ${CONFIG.cacheFile}`, 'green');
	}

	if (workflowRuns.length === 0) {
		log('No failed workflow runs found!', 'yellow');
		return;
	}

	// Analyze each failed run
	log('');
	log('Analyzing workflow run logs...', 'cyan');
	const allFailures = [];
	let processedRuns = 0;

	for (const run of workflowRuns) {
		processedRuns++;
		log(`[${processedRuns}/${workflowRuns.length}] Processing run #${run.number}...`, 'blue');

		const logs = fetchRunLogs(run.databaseId);
		const failures = parseCucumberFailures(logs, run);

		if (failures.length > 0) {
			log(`  Found ${failures.length} Cucumber failure(s)`, 'yellow');
			allFailures.push(...failures);
		}
	}

	log('');
	log(`Total failures found: ${allFailures.length}`, 'green');

	// Aggregate and analyze failures
	log('');
	log('Aggregating failure data...', 'cyan');
	const failureStats = aggregateFailures(allFailures);

	// Generate report
	log('Generating markdown report...', 'cyan');
	const report = generateReport(failureStats, allFailures, workflowRuns.length);

	// Write report to file
	writeFileSync(CONFIG.output, report);

	log('');
	log('='.repeat(60), 'bright');
	log(`✓ Analysis complete! Report saved to: ${CONFIG.output}`, 'green');
	log('='.repeat(60), 'bright');
	log('');

	// Print summary
	log('Quick Summary:', 'bright');
	log(`  • Analyzed ${workflowRuns.length} failed runs`, 'cyan');
	log(`  • Found ${allFailures.length} Cucumber step failures`, 'cyan');
	log(`  • Identified ${failureStats.length} unique failing steps`, 'cyan');
	if (failureStats.length > 0) {
		log(`  • Most common: "${failureStats[0].step.substring(0, 60)}..." (${failureStats[0].count} times)`, 'cyan');
	}
	log('');
}

// Run the script
main().catch(error => {
	console.error('Error:', error.message);
	process.exit(1);
});
