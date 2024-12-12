import mysql from 'mysql2/promise'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';

const SERIES_RUNS = parseInt(process.env.SERIES_RUNS || '5');
const PARALLEL_RUNS = parseInt(process.env.PARALLEL_RUNS || '5');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    namedPlaceholders: true,
    multipleStatements: true
});

const warmupPool = async () => {
    for (let i = 0; i < 100; i++) {
        await pool.query('SELECT 1');
    }
};

const timeQuery = async (query: string, args: any[]) => {//: { [key: string]: string }) => {
    const conn = await pool.getConnection();
    await conn.query('SET profiling = 1');
    const start = performance.now();
    await conn.query(query, args);
    const end = performance.now();
    const [profiles] = await conn.query('SHOW PROFILE FOR QUERY 1');
    await conn.query('SET profiling = 0');
    conn.release();
    return {
        appTime: end - start,
        dbTime: (profiles as any).reduce((total: number, profile: any) => total + parseFloat(profile.Duration), 0),
    };
};

const runQuery = async (query: string, args: any[]) => {// { [key: string]: string }) => {
    const runTimes: {appTime: number, dbTime: number}[] = Array(SERIES_RUNS).fill({appTime: Infinity, dbTime: Infinity});
    for (let run = 0; run < SERIES_RUNS; run++) {
        runTimes[run] = await timeQuery(query, args);
    }

    const parallelRuns = Array(PARALLEL_RUNS).fill(Promise.resolve({appTime: Infinity, dbTime: Infinity}));
    for (let run = 0; run < PARALLEL_RUNS; run++) {
        parallelRuns[run] = timeQuery(query, args);
    }

    const parallelRunTimes = await Promise.all(parallelRuns);

    return {
        runTimes,
        parallelRunTimes,
    };
}

const loadQueries = async () => {
    const queriesDir = path.join(__dirname, '../queries');
    const files = await fs.readdir(queriesDir);
    const sqlFiles = files.filter(file => file.endsWith('.sql'));
    
    const queries: { [key: string]: string } = {};
    for (const file of sqlFiles) {
        const filePath = path.join(queriesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const key = path.basename(file, '.sql');
        queries[key] = content;
    }
    return queries;
};

const params = new Map(Object.entries({
    /*
    'read-feed': {
        user_id: '189856',
    },
    */
    'read-feed': [189856]
}));

const queries = await loadQueries();

const queryResults: Record<string, {runTimes: {appTime: number, dbTime: number}[], parallelRunTimes: {appTime: number, dbTime: number}[]}> = {};

await warmupPool();

for (const queryName in queries) {
    if (process.env.QUERY && process.env.QUERY !== queryName) {
        continue;
    }
    const query = queries[queryName];
    const results = await runQuery(query, params.get(queryName) || []);
    queryResults[queryName] = results;
}

console.log(JSON.stringify(queryResults, null, 2));

await pool.end();