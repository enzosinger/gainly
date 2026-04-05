---
name: rpi-implement
description: Use only after research, planning, and required approvals are complete. Execute an approved implementation plan in small, reviewable, testable increments while preserving scope, respecting risk level, and preparing the task for downstream review and verification. Do not use for planning, research, or final task closure.
---

# RPI Implement

## Purpose

Perform the implementation phase of the RPI workflow.

Turn an approved plan into code in a controlled, auditable way.

This skill should:
- execute the approved implementation scope
- keep changes small, cohesive, and reviewable
- preserve traceability to the plan and risk level
- validate incrementally where practical
- surface deviations, risk escalation, and scope drift early
- leave the task ready for downstream review and verification

This skill must not:
- behave like open-ended code generation
- treat the plan as optional
- declare the task complete on its own

## Use This Skill When

Use this skill only after all required preconditions are satisfied.

Use it when:
- research is complete
- planning is complete
- `plan-gap-check` is complete
- the risk level is known or explicitly accepted
- required approvals have been obtained
- implementation is ready to begin

For L2 and L3 tasks, use this skill only after:
- `QUALITY_GATE_PLAN.md` exists
- the gate is ready
- the user has approved implementation

## Do Not Use This Skill For

Do not use this skill for:
- repository research
- implementation planning
- gap checking
- post-implementation review
- final verification
- declaring merge, release, or task completion

## Core Rules

- **Plan-bound execution:** Only implement what is covered by the approved plan.
- **No silent scope growth:** Do not expand the task without surfacing and resolving the change.
- **Risk-aware rigor:** Match implementation discipline to the assigned risk level.
- **Model discipline:** Execute this implementation phase through a spawned worker agent using model `gpt-5.4-mini` by default unless the user explicitly approves a different model.
- **Context-budget discipline:** Keep active context under an estimated 40% of available budget whenever practical, especially when preparing implementation handoffs or spawning worker agents.
- **Small, reviewable changes:** Prefer small cohesive edits over broad rewrites.
- **Incremental validation:** Validate meaningful chunks when practical.
- **Traceable deviations:** If implementation differs from the plan, record and explain the deviation.
- **Escalate when reality changes:** Pause when new evidence changes the impact surface or risk profile.
- **No false completion:** Writing code does not mean the task is complete.
- **Primary-agent review ownership:** Delegating implementation does not transfer post-implementation review, artifact ownership, or completion authority away from the primary agent.
- **Worker scope limit:** The spawned worker agent implements only; it does not own review, verification evidence, or completion decisions.

## Inputs

Use these inputs when available:
- approved implementation plan
- risk classification
- `plan-gap-check` result
- `QUALITY_GATE_PLAN.md` for L2 and L3 tasks
- affected files list
- relevant repository docs
- relevant domain docs
- related tests
- acceptance criteria
- rollback or fallback notes, if applicable
- prior implementation notes for the same task, if they already exist

## Preconditions

Before editing code, confirm all of the following:

- the task objective is clear
- the implementation plan exists and is approved for execution
- the current risk level is known
- the target files are identified
- the acceptance criteria are known
- the required approval state is satisfied
- the implementation worker model is `gpt-5.4-mini`, unless the user has explicitly approved a different model
- the implementation handoff is compact and limited to the minimum context needed for execution

For L2 and L3 tasks, also confirm:
- `QUALITY_GATE_PLAN.md` exists
- the gate is not blocked
- user approval to implement has been obtained

If any required precondition is unclear, stop and resolve it before editing code.

## Implementation Objectives

During implementation, ensure that:

- the changes stay aligned with the approved plan
- each edit remains understandable and reviewable
- validation is not deferred blindly to the end
- important deviations are surfaced immediately
- downstream review and verification can be performed cleanly

## Implementation Process

### 1. Reconfirm Scope and Preconditions

Before changing code:
- restate the approved scope
- restate the current risk level
- confirm the relevant files
- confirm the acceptance criteria
- confirm approval and gate status when required
- confirm that the implementation worker is using `gpt-5.4-mini` unless the user explicitly chose another model

If the real implementation surface is already broader than planned, stop and update the plan first.

### 2. Prepare the Edit Sequence

Create a compact implementation sequence from the approved plan.

The sequence should identify:
- file order
- dependency order
- validation checkpoints
- likely review hotspots

Keep the sequence small and execution-oriented.

### 3. Implement in Controlled Chunks

Edit files in the smallest feasible set of cohesive changes.

Prefer:
- exact-file edits
- isolated responsibility changes
- limited adjacency impact
- targeted test updates near the affected behavior

Avoid:
- large undifferentiated rewrites
- unrelated file edits in the same pass
- mixing behavior changes with broad cleanup
- hidden architectural changes

### 4. Validate Incrementally

Where practical, validate after meaningful chunks rather than only at the end.

Examples:
- typecheck after interface, contract, or schema changes (typecheck command: npx tsc --noEmit)
- targeted tests after behavior changes
- route or API smoke validation after backend changes
- UI state-flow checks after frontend data changes

Do not claim validation that was not actually performed.

If validation cannot be run, record that explicitly for downstream verification.

### 5. Record Deviations and Escalations

If implementation differs from the plan:
- state the deviation explicitly
- explain why it happened
- determine whether the plan must be updated
- determine whether re-approval is needed

Pause implementation and update the plan if:
- more files are affected than expected
- contract impact appears unexpectedly
- schema, query, cache, auth, or observability implications appear unexpectedly
- rollback becomes unclear
- the current risk level is no longer accurate

For L2 and L3 tasks, do not continue through significant deviation without correcting the plan and satisfying governance requirements.

### 6. Prepare for Downstream Review

Before leaving implementation:
- ensure the changed files are coherent and reviewable
- ensure relevant tests or validation updates are included when needed
- ensure deviations are documented
- ensure the task is ready for downstream review and verification artifacts
- do not begin review or verification artifacts until the worker agent has explicitly stated that implementation is complete

Implementation should hand off cleanly into:
- focused review and validation for L1
- required specialized reviews for L2 and L3
- `REVIEW_REPORT.md` where required
- `VERIFICATION_EVIDENCE.md` where required

The implementation worker should leave a clean handoff for the primary agent, which remains responsible for downstream review, verification artifacts, and the final completion decision.

## Risk-Level Execution Standard

### L0

Expected behavior:
- small local change
- minimal process overhead
- lightweight validation
- narrow edit surface

### L1

Expected behavior:
- implement in small chunks
- keep reviewability high
- validate behavior incrementally
- preserve strong traceability to the plan

### L2

Expected behavior:
- preserve traceability to `QUALITY_GATE_PLAN.md`
- keep edits small and auditable
- prepare explicitly for performance and security review
- avoid silent deviation from the approved plan
- keep downstream verification straightforward

### L3

Expected behavior:
- preserve strict execution discipline
- avoid speculative or convenience changes
- maintain high reviewability and rollback clarity
- implement with security, observability, and operational support in mind
- treat any governance deviation as a serious issue

## Output Requirements

This skill should produce:
- code changes aligned to the approved plan
- updated affected files
- targeted tests where needed
- implementation notes when material deviations occurred

This skill should not:
- declare the task complete
- imply merge or release readiness
- claim that downstream gates are already satisfied unless they actually are

## Implementation Quality Standard

### Scope Discipline

Only implement the approved scope.

Do not:
- silently expand the feature
- redesign architecture mid-implementation without updating the plan
- introduce unrelated cleanup
- modify extra files without reason

If implementation reality changes materially, stop and update the plan before continuing.

### Reviewability

Each implementation chunk should make it easy for later reviewers to answer:
- what changed
- why it changed
- how it maps to the plan
- what risks it introduces
- how it was validated

### Validation Discipline

Validation must be honest and proportional.

Do not:
- defer all thinking about validation to later phases
- imply a check was run when it was not
- treat “should be fine” as verification

## L2/L3 Enforcement

For L2 and L3 tasks, enforce all of the following:

- `QUALITY_GATE_PLAN.md` must already exist before implementation
- implementation must remain within the approved gate scope
- major deviations require plan correction
- implementation must remain review-friendly
- downstream reviews must be possible without reconstructing intent from scratch
- the task must proceed to `REVIEW_REPORT.md`
- the task must proceed to `VERIFICATION_EVIDENCE.md`

## Prohibited Behavior

Do not:
- start coding before required approvals
- treat the plan as optional
- use a different implementation model by default when `gpt-5.4-mini` has not been explicitly overridden by the user
- skip validation thinking because review happens later
- bury important changes inside unrelated cleanup
- imply that L2 or L3 work is done immediately after code is written
- claim merge or release readiness before reviews and verification evidence exist
- continue implementation after the current risk level becomes invalid
- use implementation as an excuse to perform speculative refactors

## Output Style

Be:
- disciplined
- concise
- implementation-oriented
- explicit about deviations and risks

Prefer behavior like:
- “Implement the approved contract change first, then update validation, then update tests.”
- “Pause because the file impact is broader than planned and the risk level needs escalation.”
- “Update the plan because cache invalidation is part of the actual change surface.”

Avoid behavior like:
- “While I’m here, I’ll also refactor this unrelated module.”
- “The implementation grew a bit, but it should still be fine.”
- “I finished the code, so the task is done.”

## Handoff

After implementation:
- L1 should hand off to focused review and validation
- L2 should hand off to the required specialized reviews, then verification evidence
- L3 should hand off to the required specialized reviews, then verification evidence and final risk summary

Implementation is complete only as a phase.

The overall task is complete only after the required downstream gates have passed, including:
- specialized reviews
- `REVIEW_REPORT.md` where required
- `VERIFICATION_EVIDENCE.md`
- no unresolved blocker for the task’s risk level
