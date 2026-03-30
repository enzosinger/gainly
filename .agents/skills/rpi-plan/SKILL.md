---
name: rpi-plan
description: Use after rpi-research and before implementation for any non-L0 or potentially non-local task. Produce an evidence-based implementation plan with exact file impact, approach, validation strategy, acceptance criteria, review expectations, and risk signals. Do not use for code edits or post-implementation review.
---

# RPI Plan

## Purpose

Perform the planning phase of the RPI workflow.

Transform research findings into a concrete, reviewable, risk-aware implementation plan.

This skill should:
- stay grounded in repository evidence
- define the likely implementation surface
- explain the intended approach without writing code
- make validation and review possible
- prepare the task for `plan-gap-check`
- provide enough structure for downstream quality gating when the task is L2 or L3

This skill must not:
- edit application code
- produce implementation diffs
- substitute vague ideas for an explicit plan

## Use This Skill When

Use this skill after `rpi-research` and before `plan-gap-check`.

Use it for:
- any task that is not clearly L0
- any multi-file task
- any architectural change
- any task affecting API behavior, contracts, schema, persistence, queries, cache, state flow, auth, permissions, or observability
- any task already classified above L0
- any task governed by the RPI workflow
- any task where implementation should not begin until the change surface and validation strategy are explicit

## Do Not Use This Skill For

Do not use this skill for:
- repository research or evidence collection
- code editing or code generation
- post-implementation review
- final verification after implementation
- trivial single-file work that is clearly L0 and already well understood

## Core Rules

- **No code changes:** Do not edit application code during this skill.
- **Planning only:** This phase is for solution design, not execution.
- **Evidence-based:** Use research findings and repository evidence, not guesses.
- **Controlled context:** Keep context focused on the task and affected areas.
- **Risk-aware:** Reflect the current risk level when known, or surface risk signals when it is not yet explicit.
- **Boundary-aware:** Respect the repository’s existing architecture and ownership boundaries.
- **Reviewable output:** Produce a plan that can be checked by `plan-gap-check` and, where needed, support `QUALITY_GATE_PLAN.md`.
- **No speculative scope growth:** Do not widen the task beyond the user objective unless the repository evidence makes that necessary.

## Inputs

Use these inputs when available:
- research findings from `rpi-research`
- relevant repository docs
- relevant domain docs
- affected files inventory
- related code snippets
- related tests
- current task objective
- current risk level, if already known
- prior planning artifacts for the same task, if they already exist

If the risk level is not yet explicit, the plan must still surface the visible risk signals that matter for downstream classification and gating.

## Planning Objectives

Before implementation begins, the plan must answer these questions concretely:

- What will change?
- Where will it change?
- Why are those files involved?
- What constraints must the change respect?
- How will correctness be validated?
- What technical risks are already visible?
- Which downstream reviews are likely required?
- Is the plan ready for gap checking and implementation governance?

## Planning Process

### 1. Restate the Task Clearly

Define the task in a compact, operational way:
- user objective
- affected domain
- intended outcome

Keep this specific to the repository and task.

### 2. Define the File Impact

List the exact files expected to be created or modified.

Prefer:
- exact repository paths
- exact responsibilities per file

Over:
- broad folder references
- speculative file groups

For each file, indicate:
- `create`, `modify`, or `unchanged`
- why it is involved
- what responsibility the change will have

If an exact file is still unknown, say so explicitly and explain why.

### 3. Define the Intended Approach

Explain the technical approach without writing code.

Include:
- the main execution path
- the relevant layers or components involved
- how responsibilities will be distributed
- important architectural constraints that must be preserved
- whether the change is additive, modifying, or replacing current behavior

Do not drift into speculative redesign unless redesign is explicitly part of the task.

### 4. Surface Planning-Time Risk Signals

Identify the main technical risks already visible from planning.

Consider, where relevant:
- architectural impact
- contract or schema impact
- query or data-access impact
- persistence impact
- cache or Redis impact
- state-flow impact
- security-sensitive behavior
- observability needs
- rollback or revert difficulty
- coupling across multiple subsystems

This section should support downstream risk classification and gate decisions.

### 5. Define the Validation Strategy

State how the change will be validated.

Include when relevant:
- targeted test updates
- typecheck, lint, and build checks (typecheck command: npx tsc --noEmit)
- behavioral verification
- route, API, or UI smoke checks
- regression-sensitive areas
- manual verification steps if needed
- any validation that is not currently possible and why

Validation should be proportional to the likely risk and change surface.

### 6. Define Acceptance Criteria

State objective, testable acceptance criteria.

Acceptance criteria should be:
- concrete
- verifiable
- tied to the user objective
- as implementation-independent as practical

Avoid vague statements such as:
- “works correctly”
- “looks good”
- “is improved”

### 7. Define Review Expectations

State which downstream reviews are likely required.

At minimum, identify whether the task likely needs:
- performance review
- security review
- observability review
- domain-specific review, if relevant

For likely L2 or L3 work, be explicit about why those reviews are expected.

### 8. State Open Questions and Assumptions

List unresolved questions or assumptions that still matter.

If a critical assumption exists, state it explicitly.
Do not hide assumptions inside the implementation approach.

If the task is not yet safe to implement because of unresolved questions, say so clearly.

### 9. Declare Planning Readiness

End the plan with one of:
- `Plan Status: Ready for Gap Check`
- `Plan Status: Needs More Research`

If more research is required, state exactly what is missing.

## Output Requirements

Produce the result using all sections below.

### 1. Task Summary

Provide a short, concrete summary of:
- the user objective
- the affected domain
- the intended outcome

### 2. Proposed File Impact

List the exact files expected to be created or modified.

For each file, include:
- status: `create`, `modify`, or `unchanged`
- why it is involved
- expected responsibility of the change

### 3. Implementation Approach

Explain the intended technical approach.

Include:
- the main execution path
- major layers or components involved
- responsibility distribution
- constraints from the existing architecture

Do not write code.

### 4. Risk Signals

List the major technical risks already visible from planning.

### 5. Validation Strategy

Define how the change will be validated.

### 6. Acceptance Criteria

List concrete, testable acceptance criteria.

### 7. Review Expectations

State which downstream reviews are likely required and why.

### 8. Open Questions and Assumptions

List unresolved questions and material assumptions.

### 9. Planning Readiness

End with one of:
- `Plan Status: Ready for Gap Check`
- `Plan Status: Needs More Research`

## L2/L3 Planning Standard

For tasks that are, or may become, **L2** or **L3**, the plan must be detailed enough to support later creation of `QUALITY_GATE_PLAN.md`.

That means the plan must be explicit about:
- affected domains
- expected files
- performance implications
- scalability implications
- security implications
- observability implications
- API, database, and cache implications
- testing strategy
- rollback or fallback thinking
- likely mandatory reviewers

If the plan cannot reach that level of specificity yet, say so clearly and require more research before implementation begins.

## Planning Quality Standard

### File Impact Quality

Prefer:
- exact impacted files with rationale
- compact but precise file impact statements

Avoid:
- broad file trees with low operational value
- generic folder-level impact when exact files are knowable

### Architectural Discipline

The plan must respect repository boundaries and current conventions.

Do not:
- place business logic in the wrong layer
- blur frontend and backend responsibilities
- introduce unnecessary abstractions
- propose broad refactors unless the task requires them
- hide cross-layer coupling

### Scope Discipline

The plan should be complete, but not bloated.

Do not:
- inflate scope
- add unrelated cleanup
- insert speculative future work into the implementation scope
- turn the plan into a redesign document when the task is bounded

## Prohibited Behavior

Do not:
- edit application code
- present guesses as evidence
- skip validation planning
- omit acceptance criteria
- ignore risk signals already visible in planning
- produce a plan that cannot be reviewed
- produce an L2 or L3 plan too shallow to support quality gating
- mark the plan ready when critical unknowns still block safe implementation

## Output Style

Be:
- explicit
- structured
- implementation-oriented
- repository-specific

Prefer:
- exact file paths
- exact impact statements
- concise technical approach
- concrete acceptance criteria
- explicit risks and assumptions

Avoid:
- generic planning language
- overly abstract architecture prose
- long narrative text with little operational value

## Handoff

The result of this skill must be:
- reviewed by `plan-gap-check`
- and, when appropriate, used as the basis for `QUALITY_GATE_PLAN.md`

Implementation must not begin until the plan is sufficiently explicit for the task’s risk level and governance requirements.
