# Restore sessions for the selected workout week

**What to build:** A lifter can switch a routine between weeks and reach the selected week's session. Stale failures from a previous selection cannot disrupt the current week.

**Blocked by:** None

**Status:** implemented; awaiting maintainer review. Live Convex acceptance remains unverified.

- [x] Previous/next and Back/Forward navigation restore the selected routine/week
- [x] Unchanged routine/week/version renders do not duplicate restoration
- [x] A routine update synchronizes the current week again
- [x] A delayed failure from an abandoned selection neither shows an error nor resets current request state
- [x] A current request failure is visible, and leaving then returning allows a fresh attempt
- [x] Focused page regression checks fail on the baseline and pass after the fix
- [x] Full tests and build results are recorded without claiming real-service E2E

Published task: https://github.com/enzosinger/gainly/issues/3
