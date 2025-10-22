We are seeing that our cucumber tests are failing regulary on the CI

Its normally a handleful of the same steps in different scenarios that are failing
but there does not seem to be a consistent pattern

We are putting them down to flakiness, potentially timing issue related

We need to investigate this further and work out exactly what is going on, and
how we can fix this

Running the cucumber tests locally seems to be mostly fine. There are odd
failures, but it is also unlikely that a dev would run the full suite of cucumber
tests locally

If we isolate the tests with failing steps, they almost always pass
when run locally

I think we should do the following:

Use the GitHub CLI to identify the last 200 failures on the CI when merging
into the main branch. We should then find which of these failures where caused
by failing steps in the cucumber tests. We should then come up with a list of
steps that are failing, and the test they appeared in, so we can start to see if
there are any consistent patterns etc.

Its probably easiest to create a script that facilitates this. We should store
the results in a file, so we can easily reference them later
