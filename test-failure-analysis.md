# Cucumber Test Failure Analysis

**Generated:** 2025-10-21

**Analysis Period:** Last 124 failed CI runs on main branch

## Summary

- **Total failed runs analyzed:** 124
- **Total Cucumber step failures found:** 41
- **Unique failing steps:** 10
- **Most common failing step:** Then Activity with object "Note" is sent to all followers (11 occurrences)

## Top 10 Most Frequently Failing Steps

| Rank | Step | Failure Count | % of Total |
|------|------|---------------|------------|
| 1 | Then Activity with object "Note" is sent to all followers | 11 | 26.8% |
| 2 | Then the unread notifications count is 4 | 10 | 24.4% |
| 3 | Given we are following "Alice" | 6 | 14.6% |
| 4 | And Activity "Accept" is sent to "Alice" | 4 | 9.8% |
| 5 | Then the note is in my followers feeds | 4 | 9.8% |
| 6 | And Activity "A1" is sent to "Alice" | 2 | 4.9% |
| 7 | And the unread notifications count is 4 | 1 | 2.4% |
| 8 | And the note "AliceNote" is in our feed | 1 | 2.4% |
| 9 | Then A "Create(Article)" Activity is sent to all followers | 1 | 2.4% |
| 10 | And a "Update(Us)" activity is sent to "Alice" | 1 | 2.4% |

## Detailed Failure Analysis

Below is a detailed breakdown of each failing step, including all scenarios where it failed.

### 1. Then Activity with object "Note" is sent to all followers

**Total failures:** 11

**Failed in 3 different scenario(s):**

- **create-note.feature** → _Created note is formatted # features/create-note.feature:11_ (8 times)
  - [Run #4133](https://github.com/TryGhost/ActivityPub/actions/runs/18681048983) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T10:45:01.6599833Z        AssertionError [ERR_ASSERTION]: Activity with object "Note" was not sent to "carol.test"`
  - [Run #4106](https://github.com/TryGhost/ActivityPub/actions/runs/18679694485) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T09:58:58.5782077Z        AssertionError [ERR_ASSERTION]: Activity with object "Note" was not sent to "bob.test"`
  - [Run #3808](https://github.com/TryGhost/ActivityPub/actions/runs/18260330848) - 05/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-05T15:01:51.7851435Z        AssertionError [ERR_ASSERTION]: Activity with object "Note" was not sent to "carol.test"`
  - _...and 5 more occurrence(s)_
- **create-note.feature** → _Created note has user provided HTML escaped # features/create-note.feature:21_ (2 times)
  - [Run #3599](https://github.com/TryGhost/ActivityPub/actions/runs/17677407793) - 12/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-12T14:37:20.8696083Z        AssertionError [ERR_ASSERTION]: Activity with object "Note" was not sent to "carol.test"`
  - [Run #3555](https://github.com/TryGhost/ActivityPub/actions/runs/17613258095) - 10/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-10T12:21:08.7299787Z        AssertionError [ERR_ASSERTION]: Activity with object "Note" was not sent to "carol.test"`
- **create-note.feature** → _Created note is sent to followers # features/create-note.feature:34_ (1 time)
  - [Run #3551](https://github.com/TryGhost/ActivityPub/actions/runs/17612283032) - 10/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-10T11:36:42.2891189Z        AssertionError [ERR_ASSERTION]: Activity with object "Note" was not sent to "Bob"`

### 2. Then the unread notifications count is 4

**Total failures:** 10

**Failed in 1 different scenario(s):**

- **notifications.feature** → _Requests for unread notifications count # features/notifications.feature:10_ (10 times)
  - [Run #4145](https://github.com/TryGhost/ActivityPub/actions/runs/18681538776) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T11:10:42.9791690Z        Error: Max retries reached (5) when waiting for notifications count 4. Notification count found 6`
  - [Run #3933](https://github.com/TryGhost/ActivityPub/actions/runs/18489467565) - 14/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-14T08:07:49.4415985Z        Error: Max retries reached (5) when waiting for notifications count 4. Notification count found 6`
  - [Run #3900](https://github.com/TryGhost/ActivityPub/actions/runs/18462604792) - 13/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-13T10:35:24.4629175Z        Error: Max retries reached (5) when waiting for notifications count 4. Notification count found 6`
  - _...and 7 more occurrence(s)_

### 3. Given we are following "Alice"

**Total failures:** 6

**Failed in 5 different scenario(s):**

- **create-reply.feature** → _Creating a reply with an invalid image URL # features/create-reply.feature:64_ (1 time)
  - [Run #4168](https://github.com/TryGhost/ActivityPub/actions/runs/18683829130) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T12:41:18.8018997Z        Error: Max retries reached when waiting on following https://fake-external-activitypub.test/user/Alice to be added`
- **repost-activity.feature** → _Trying to undo a repost on a post/note that has not been reposted # features/repost-activity.feature:36_ (1 time)
  - [Run #4122](https://github.com/TryGhost/ActivityPub/actions/runs/18680322969) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T10:22:12.1679921Z        Error: Something went wrong`
- **feed.feature** → _Feed includes notes # features/feed.feature:6_ (2 times)
  - [Run #4090](https://github.com/TryGhost/ActivityPub/actions/runs/18679511850) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T09:47:10.1837615Z        Error: Max retries reached when waiting on following https://fake-external-activitypub.test/user/Alice to be added`
  - [Run #3664](https://github.com/TryGhost/ActivityPub/actions/runs/17917635659) - 22/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-22T14:08:11.7643493Z        Error: Max retries reached when waiting on following https://fake-external-activitypub.test/user/Alice to be added`
- **follow-account.feature** → _We can unfollow an account # features/follow-account.feature:12_ (1 time)
  - [Run #3787](https://github.com/TryGhost/ActivityPub/actions/runs/18195110606) - 02/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-02T14:05:40.9724101Z        Error: Max retries reached when waiting on following https://fake-external-activitypub.test/user/Alice to be added`
- **notifications.feature** → _Requests for unread notifications count # features/notifications.feature:10_ (1 time)
  - [Run #3381](https://github.com/TryGhost/ActivityPub/actions/runs/17266039783) - 27/08/2025
    - Error: `Build, Test and Push	UNKNOWN STEP	2025-08-27T12:11:39.8366858Z        Error: Max retries reached when waiting on following https://fake-external-activitypub.test/user/Alice to be added`

### 4. And Activity "Accept" is sent to "Alice"

**Total failures:** 4

**Failed in 2 different scenario(s):**

- **accept-follows.feature** → _We can be followed # features/accept-follows.feature:3_ (3 times)
  - [Run #4156](https://github.com/TryGhost/ActivityPub/actions/runs/18682504100) - 21/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-21T11:44:25.3305752Z        Error: Max retries reached (5) when waiting for request POST /inbox/Alice`
  - [Run #3570](https://github.com/TryGhost/ActivityPub/actions/runs/17619115551) - 10/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-10T15:56:34.9274782Z        AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:`
  - [Run #3569](https://github.com/TryGhost/ActivityPub/actions/runs/17618655479) - 10/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-10T15:47:00.2713050Z        AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:`
- **accept-follows.feature** → _We can be unfollowed # features/accept-follows.feature:24_ (1 time)
  - [Run #3350](https://github.com/TryGhost/ActivityPub/actions/runs/17243377978) - 26/08/2025
    - Error: `Build, Test and Push	UNKNOWN STEP	2025-08-27T10:57:12.4994650Z        AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:`

### 5. Then the note is in my followers feeds

**Total failures:** 4

**Failed in 1 different scenario(s):**

- **create-note.feature** → _Delivering notes and mentions to internal accounts # features/create-note.feature:78_ (4 times)
  - [Run #4044](https://github.com/TryGhost/ActivityPub/actions/runs/18560154238) - 16/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-16T11:55:53.2664008Z        AssertionError [ERR_ASSERTION]: Note is not in all feeds`
  - [Run #3886](https://github.com/TryGhost/ActivityPub/actions/runs/18462091812) - 13/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-13T10:11:21.3090520Z        AssertionError [ERR_ASSERTION]: Note is not in all feeds`
  - [Run #3817](https://github.com/TryGhost/ActivityPub/actions/runs/18265407981) - 05/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-05T22:58:46.2572786Z        AssertionError [ERR_ASSERTION]: Note is not in all feeds`
  - _...and 1 more occurrence(s)_

### 6. And Activity "A1" is sent to "Alice"

**Total failures:** 2

**Failed in 1 different scenario(s):**

- **accept-follows.feature** → _An actor attempts to follow us multiple times # features/accept-follows.feature:12_ (2 times)
  - [Run #4014](https://github.com/TryGhost/ActivityPub/actions/runs/18553105348) - 16/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-16T07:11:42.0829094Z        Error: Max retries reached (5) when waiting for request POST /inbox/Alice`
  - [Run #3583](https://github.com/TryGhost/ActivityPub/actions/runs/17632875034) - 11/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-11T03:21:16.7352468Z        AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:`

### 7. And the unread notifications count is 4

**Total failures:** 1

**Failed in 1 different scenario(s):**

- **notifications.feature** → _Reset unread notifications count # features/notifications.feature:19_ (1 time)
  - [Run #3948](https://github.com/TryGhost/ActivityPub/actions/runs/18493118660) - 14/10/2025
    - Error: `test / Test	UNKNOWN STEP	2025-10-14T10:28:08.7136126Z        Error: Max retries reached (5) when waiting for notifications count 4. Notification count found 6`

### 8. And the note "AliceNote" is in our feed

**Total failures:** 1

**Failed in 1 different scenario(s):**

- **delete-post.feature** → _Attempting to delete another user's post # features/delete-post.feature:22_ (1 time)
  - [Run #3762](https://github.com/TryGhost/ActivityPub/actions/runs/18114753599) - 30/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-30T00:56:49.3502668Z        Error: Max retries reached when waiting on item https://fake-external-activitypub.test/note/4ff75338-0733-433b-807c-7f23944af7e6 in the fee`

### 9. Then A "Create(Article)" Activity is sent to all followers

**Total failures:** 1

**Failed in 1 different scenario(s):**

- **create-article-from-post.feature** → _We receive a webhook for the post.published event and the post has no content # features/create-article-from-post.feature:10_ (1 time)
  - [Run #3759](https://github.com/TryGhost/ActivityPub/actions/runs/18109012782) - 29/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-29T20:32:03.5337284Z        AssertionError [ERR_ASSERTION]: Activity "Create(Article)" was not sent to "Alice"`

### 10. And a "Update(Us)" activity is sent to "Alice"

**Total failures:** 1

**Failed in 1 different scenario(s):**

- **account-update.feature** → _Update account information # features/account-update.feature:5_ (1 time)
  - [Run #3726](https://github.com/TryGhost/ActivityPub/actions/runs/18102350674) - 29/09/2025
    - Error: `test / Test	UNKNOWN STEP	2025-09-29T15:42:39.9921757Z        AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:`

## Recommendations

Based on this analysis, consider:

1. **Focus on the top failing steps** - The most frequent failures likely indicate systemic issues
2. **Look for timing issues** - If failures are inconsistent, add explicit waits or retries
3. **Isolate and debug locally** - Run failing scenarios with increased logging
4. **Check for race conditions** - Steps that sometimes pass may have timing dependencies
5. **Review test setup/teardown** - Ensure tests are properly isolated

