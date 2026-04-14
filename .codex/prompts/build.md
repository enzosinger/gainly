---
description: Implement the next task incrementally — build, test, verify, commit
---

Invoke the agent-skills:incremental-implementation skill alongside agent-skills:test-driven-development.

Pick the next pending task from the plan. For each task:

1. Read the task's acceptance criteria
2. Load relevant context (existing code, patterns, types)
3. Write a failing test for the expected behavior (RED)
4. Implement the minimum code to pass the test (GREEN)
5. Run the full test suite to check for regressions
6. Run the build to verify compilation
7. Ask user if he wants a commit of the related changes, if user approves, commit with a descriptive message, if not, just proceed with next step
8. Mark the task complete, inform user of completion and stop working.

If any step fails, follow the agent-skills:debugging-and-error-recovery skill.
