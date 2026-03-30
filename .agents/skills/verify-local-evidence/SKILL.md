---
name: verify-local-evidence
description: Use after implementation and before final task closure to produce explicit verification evidence for the change. Summarize what was checked, what was not checked, the results, known limitations, and residual risk. Required for L2 and L3 tasks. Do not use for implementation, planning, or post-implementation review decisions themselves.
---

# Verify Local Evidence

## Purpose

Produce an auditable summary of verification and validation evidence for a task.

This skill exists to:
- prevent unsupported completion claims
- make omissions and limitations explicit
- expose residual risk before task closure
- provide a concrete basis for readiness statements

This skill should:
- summarize the checks that were actually performed
- state clearly which checks were not performed
- record the results and notable caveats
- make remaining uncertainty visible

This skill must not:
- invent checks that were not run
- hide missing validation
- substitute confidence language for evidence

## Use This Skill When

Use this skill:
- after implementation
- before marking a task complete
- whenever verification was partial, constrained, or incomplete
- whenever residual risk should be made explicit
- always for L2 and L3 tasks

Use it for:
- changes with meaningful behavioral impact
- tasks that require a final evidence artifact
- tasks where build, test, lint, typecheck, smoke checks, or manual verification were performed or considered

## Do Not Use This Skill For

Do not use this skill for:
- implementation planning
- code editing
- specialized post-implementation review itself
- deciding architecture or risk classification
- claiming checks passed when they were not actually executed

## Core Rules

- **Evidence only:** Record only checks, observations, and results that actually exist.
- **No hidden omissions:** Explicitly list checks that were not executed.
- **No false confidence:** Do not use optimistic language in place of verification evidence.
- **Honest scope:** State what was checked and what remained outside the verified surface.
- **Residual risk visibility:** Make remaining uncertainty explicit.
- **Readiness discipline:** Use the readiness statement that matches the actual verification state.

## Inputs

Use these inputs when available:
- changed files
- implementation plan
- risk classification
- `QUALITY_GATE_PLAN.md`
- `REVIEW_REPORT.md`
- test output
- lint output
- typecheck output
- build output
- manual verification notes
- command output
- logs, traces, or runtime observations relevant to the task
- any notes about checks that could not be executed

## Output Target

Produce or update:

`VERIFICATION_EVIDENCE.md`

## Verification Objectives

The output should answer these questions clearly:

- What was actually checked?
- What was not checked?
- What passed?
- What failed?
- What remains uncertain?
- What limitations affected confidence?
- Is the task ready, ready with caveats, or not ready?

## Verification Process

### 1. Gather Actual Evidence

Collect the real verification inputs that exist for the task.

These may include:
- command outputs
- test results
- build results
- lint or typecheck results
- manual validation notes
- API or UI smoke checks
- reasoning-based checks where runtime execution was not possible

Do not infer execution from intention.
Only include what actually happened.

### 2. Classify Checks Performed

List each executed check with:
- command or action
- scope
- result
- notable warnings, caveats, or constraints

Examples:
- typecheck for affected package
- targeted tests for changed module
- build for application or package
- local route smoke validation
- static review of migration or cache invalidation logic when runtime testing was not possible

### 3. Classify Checks Not Performed

List omitted checks explicitly.

For each omitted check, state:
- what was not run
- why it was not run
- what uncertainty remains because of that omission

Examples:
- no integration test was run because no harness exists
- no end-to-end validation was run because the environment was unavailable
- no live cache verification was run because Redis was not available locally

### 4. Summarize Results

State the overall validation state:
- what passed
- what failed
- what remains partially verified
- whether there are warnings, limitations, or caveats that affect readiness

### 5. State Known Limitations and Residual Risk

Make remaining limitations explicit.

Examples:
- runtime behavior was not exercised
- a critical path was reviewed statically only
- no concurrency verification was possible
- observability coverage remains uncertain
- rollback was not exercised in practice

### 6. Declare Readiness

End with one of:
- `Readiness Statement: Ready`
- `Readiness Statement: Ready with Caveats`
- `Readiness Statement: Not Ready`

Use:
- `Ready` only when the validation performed is sufficient for the task’s risk and no meaningful unresolved verification gap remains
- `Ready with Caveats` when the task appears acceptable but meaningful limitations or omitted checks remain
- `Not Ready` when failures, major omissions, or unresolved uncertainty materially block safe completion

## Output Requirements

Produce the result using all sections below.

### 1. Task Summary

State:
- the task that was verified
- the affected area or domain
- the intent of this verification pass

### 2. Risk Level

State the current task risk level if known.

If unknown, say so explicitly.

### 3. Checks Executed

For each executed check, include:
- command or action
- scope
- result
- notable warnings or caveats

### 4. Checks Not Executed

List omitted checks explicitly and explain why each was not run.

### 5. Results

Summarize:
- what passed
- what failed
- what remains uncertain

### 6. Known Limitations

State limitations that reduce confidence in the verification outcome.

### 7. Residual Risks

State the remaining risks after the performed checks.

These should be concrete and tied to the task, such as:
- unverified API behavior
- unverified cache invalidation
- unverified migration safety
- unverified auth edge cases
- unverified UI regression paths

### 8. Readiness Statement

End with one of:
- `Readiness Statement: Ready`
- `Readiness Statement: Ready with Caveats`
- `Readiness Statement: Not Ready`

## Standard Checks to Consider

Select only what is relevant and state explicitly what was run.

Typical checks include:
- typecheck
- lint
- unit tests
- integration tests
- targeted test files
- build
- local smoke validation
- API route validation
- UI smoke validation
- migration dry-run reasoning
- query review reasoning
- cache invalidation reasoning
- auth or permission-path reasoning
- observability or logging-path review

Do not list a check unless it was actually performed or explicitly considered and omitted.

## Verification Quality Standard

### Checks Executed

Good entries are:
- specific
- scoped
- evidence-based
- honest about caveats

Prefer:
- “Typecheck passed for the affected package.”
- “Targeted tests for `user-service` passed.”
- “Build succeeded for the web app, with one unrelated warning.”
- “Cache invalidation path was reviewed statically only; no runtime Redis validation was available.”

### Checks Not Executed

Omissions must be explicit.

Prefer:
- “No integration test was executed; no local test harness exists for this route.”
- “No end-to-end UI validation was run; browser environment was unavailable.”
- “No migration dry-run was executed; schema impact remains partially unverified.”

### Results and Readiness

The results should reflect actual evidence, not optimism.

Avoid:
- “Looks good.”
- “Should be fine.”
- “Probably ready.”

## L2/L3 Enforcement

For any L2 or L3 task:
- `VERIFICATION_EVIDENCE.md` is mandatory before the task may be treated as complete
- omitted checks must be stated explicitly
- residual risks must be stated explicitly
- readiness must match the actual evidence quality

## Prohibited Behavior

Do not:
- imply that checks were run when they were not
- hide omitted validation
- collapse evidence into vague summary language
- mark a task ready when meaningful uncertainty remains
- use optimistic wording in place of concrete results
- omit residual risk for L2 or L3 work

## Output Style

Be:
- evidence-based
- explicit
- concise
- audit-friendly

Prefer:
- concrete commands or actions
- concrete scopes
- concrete results
- direct caveats
- direct readiness language

Avoid:
- generic reassurance
- narrative text without operational value
- unsupported confidence claims

## Handoff

This skill produces the verification artifact needed for task closure.

For L2 and L3 work, the task must not be treated as complete until:
- required reviews are finished
- `REVIEW_REPORT.md` exists when required
- `VERIFICATION_EVIDENCE.md` exists
- the readiness statement reflects the actual verification evidence
- no unresolved blocker remains
