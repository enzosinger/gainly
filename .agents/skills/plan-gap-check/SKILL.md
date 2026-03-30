---
name: plan-gap-check
description: Use after rpi-plan and before implementation for any non-L0 or potentially underestimated task. Critically review the plan for missing context, hidden dependencies, testing gaps, architecture drift, risk misclassification, and missing quality-gate requirements. Do not use for code edits or final task closure.
---

# Plan Gap Check

## Purpose

Perform a pre-implementation critical review of an implementation plan.

This skill exists to prevent implementation from starting when the plan is:
- incomplete
- under-scoped
- based on hidden assumptions
- missing important dependencies or adjacent impacts
- weak on validation, risk, or governance requirements

This skill should:
- assess whether the plan is complete enough to execute safely
- identify missing repository context and hidden dependencies
- detect weak testing or verification strategy
- detect architecture, performance, security, and observability omissions
- verify whether the current risk classification is still correct
- determine whether the task is ready for implementation or must return to planning

This skill must not:
- edit application code
- perform implementation
- treat vague planning as sufficient for execution

## Use This Skill When

Use this skill after `rpi-plan` and before `rpi-implement`.

Use it for:
- any task that is not clearly L0
- any multi-file change
- any architectural change
- any task affecting API behavior, schema, persistence, queries, cache, state flow, auth, permissions, or observability
- any task where the risk level may be underestimated
- any task governed by the RPI workflow
- any task where implementation should not begin until planning quality is explicitly checked

For L1, L2, and L3 tasks, this skill should normally be used before implementation.

## Do Not Use This Skill For

Do not use this skill for:
- repository research
- implementation planning from scratch
- code editing or code generation
- post-implementation review
- final verification after implementation
- trivial single-file work that is clearly L0 and already well understood

## Core Rules

- **Pre-implementation only:** This skill reviews the plan before code is written.
- **Evidence-based review:** Evaluate the plan against research findings and repository evidence, not intuition alone.
- **Gap-oriented review:** Focus on what is missing, weak, or risky.
- **Risk-aware review:** Reassess whether the current risk level is still justified.
- **Governance-aware review:** For L2 and L3, confirm the plan is mature enough to support `QUALITY_GATE_PLAN.md`.
- **No false approval:** Do not allow implementation to proceed if critical gaps remain.
- **Actionable output:** Findings must identify what must change before implementation can begin.

## Inputs

Use these inputs when available:
- implementation plan
- research findings
- current risk classification
- affected files list
- relevant repository docs
- relevant domain docs
- related code snippets
- related tests
- any existing quality-gate draft
- acceptance criteria
- rollback or fallback notes, if available

## Review Objectives

The review should answer these questions clearly:

- Does the plan have enough repository context to be safe?
- Are the exact affected files and boundaries identified?
- Are hidden dependencies, integrations, or codegen implications missed?
- Is the testing and validation strategy credible for the task?
- Does the approach preserve architecture integrity?
- Are performance, security, and observability concerns addressed appropriately?
- Is the current risk classification still correct?
- For L2 or L3, is the plan mature enough to support `QUALITY_GATE_PLAN.md`?
- Should implementation proceed, revise the plan, escalate risk, or stop?

## Review Process

### 1. Check Context Completeness

Check whether the plan depends on files, modules, contracts, schemas, or behaviors that were not sufficiently reviewed.

Confirm whether:
- the exact files to change are identified
- relevant repository docs and domain docs were consulted where needed
- the plan is grounded in evidence rather than assumptions
- obvious adjacent impact areas were considered

Flag gaps when:
- important file boundaries are unclear
- the plan references behavior without code or documentation support
- obvious adjacent impact is omitted
- the file impact is still too vague for safe execution

### 2. Check Dependency and Integration Awareness

Check whether the plan correctly accounts for dependencies and integration points.

Confirm whether:
- new or changed dependencies are required
- compatibility and integration points were considered
- contracts, API clients, schemas, or generated code are affected
- DB, Redis, environment config, background workflows, or other infra concerns are included when relevant

Flag gaps when:
- compatibility is assumed without verification
- one side of an integration changes but the other side is not addressed
- code generation, schema, migration, or deployment implications are missed
- environment or operational dependencies are ignored

### 3. Check Testing and Validation Completeness

Check whether the plan includes a credible way to verify the change.

Confirm whether:
- relevant test updates or additions are identified
- changed behavior has an explicit validation path
- critical paths have enough verification coverage
- the validation strategy matches the task’s risk level
- regression-sensitive areas are acknowledged

Flag gaps when:
- no tests or verification path are defined for behavior changes
- validation is too shallow for the change surface
- regression-prone areas are ignored
- critical behavior has no credible verification strategy

### 4. Check Architecture Integrity

Check whether the planned approach respects repository boundaries and current conventions.

Confirm whether:
- business logic stays in the correct layer
- frontend and backend responsibilities remain clear
- module boundaries remain coherent
- the plan avoids unnecessary coupling
- the plan avoids premature abstractions or silent redesign

Flag gaps when:
- the approach crosses module boundaries in a fragile way
- route or UI layers absorb business logic improperly
- service or data-access responsibilities become blurred
- the plan increases technical drift without justification

### 5. Check Performance and Scalability Readiness

Check whether the plan accounts for cost and scale implications where relevant.

Confirm whether the plan addresses:
- query cost
- payload size
- pagination or bounded access
- caching and invalidation
- rendering cost
- high-volume paths
- expensive request-path logic
- retry, batching, or idempotency-sensitive flows

Flag gaps when:
- list or query behavior changes without performance consideration
- cache usage is proposed without invalidation logic
- expensive operations are added with no mitigation or validation path
- scalability assumptions are left implicit

### 6. Check Security Readiness

Check whether the plan accounts for trust boundaries and access controls where relevant.

Confirm whether the plan addresses:
- input validation
- authorization and resource ownership
- sensitive data exposure
- secrets, file access, or external-input concerns
- backend enforcement rather than UI-only assumptions

Flag gaps when:
- validation is not mentioned where needed
- auth or ownership boundaries are unclear
- sensitive operations are not treated explicitly
- the plan relies on frontend-only protection
- file or secret-related risk is ignored

### 7. Check Observability Readiness

Check whether the plan describes how the change will remain diagnosable and supportable.

Confirm whether the plan addresses:
- logging or diagnostic context
- error context
- request or workflow traceability
- visibility into important failure modes
- supportability for critical or async flows

Flag gaps when:
- critical behavior is added with no observability strategy
- failures would be difficult to debug
- async or expensive paths remain operationally opaque
- the plan leaves production diagnosis unrealistic

### 8. Reassess Risk Classification

Check whether the assigned risk level is still justified.

Escalate risk if new evidence shows:
- broader impact than expected
- hidden API or schema impact
- cache or concurrency concerns
- auth, permission, or file-access implications
- migration or public contract implications
- meaningful performance or observability impact
- weak rollback or verification confidence

If uncertainty remains, prefer the higher risk level.

### 9. Check L2/L3 Quality-Gate Readiness

For tasks that are or may become L2 or L3, check whether the plan is mature enough to support `QUALITY_GATE_PLAN.md`.

Confirm whether the plan contains enough information to describe:
- task summary
- risk level and rationale
- affected domains
- expected files to modify
- performance and scalability impact
- security impact
- observability impact
- API, database, and cache impact
- testing strategy
- rollback or fallback strategy
- mandatory reviewers
- open questions

If this level of detail is missing, implementation must not proceed.

## Output Requirements

Produce the result using all sections below.

### Plan Gap Check

#### Scope
State:
- what plan was reviewed
- what task it supports
- which domains, files, or flows were in scope for this review

#### Current Risk Level
State the current assigned risk level.

If the risk level is missing or uncertain, say so explicitly.

#### Assessment Summary
Provide a concise summary of whether the plan is generally ready, incomplete, underestimated, or blocked by major unknowns.

#### Gaps Identified
List each gap with:
- title
- affected area
- why it matters
- what is missing or weak

If no material gaps are identified, say so explicitly.

#### Required Plan Changes
List the specific changes needed before implementation may begin.

These should be concrete and actionable.

#### Risk Escalation Decision
State whether:
- the current risk level remains appropriate
- the risk level should be escalated
- the risk level is still uncertain and needs clarification

#### Gate Readiness
End with one of:
- `Gate Readiness: ready`
- `Gate Readiness: ready_with_revisions`
- `Gate Readiness: blocked`

#### Decision
End with one of:
- `Decision: proceed`
- `Decision: revise_plan`
- `Decision: escalate_risk`
- `Decision: blocked`

## Gate Readiness Rules

Use:
- `ready` when the plan is sufficiently complete for the current risk level
- `ready_with_revisions` when the plan is viable but needs specific corrections before implementation
- `blocked` when the plan is too incomplete, too risky, or too immature to support safe execution

## Decision Rules

Use:
- `proceed` only when the plan is evidence-based, file impact is clear, validation is credible, risk level is appropriate, and no major gap remains
- `revise_plan` when the plan is viable but incomplete and specific additions are required before implementation
- `escalate_risk` when the current risk level is too low for the real impact discovered
- `blocked` when key dependencies, boundaries, or system impacts remain unknown, or when required controls are missing

If the review identifies both incomplete planning and underestimated risk, prefer the decision that most safely prevents premature implementation.

## L2/L3 Enforcement

For L2 and L3 tasks, enforce all of the following:

- implementation must not begin until the plan is mature enough to create `QUALITY_GATE_PLAN.md`
- if the plan lacks enough detail for the quality gate, return `Decision: revise_plan` or `Decision: blocked`
- the user must approve the plan after the quality gate is ready
- chat-only planning is not sufficient
- the plan must be explicit enough for later review and verification artifacts to remain traceable

## Plan Gap Check Quality Standard

Be:
- concrete
- scoped
- critical
- actionable
- governance-aware

Prefer statements like:
- “Plan changes endpoint behavior but does not mention pagination or payload constraints.”
- “State-flow changes are proposed, but invalidation strategy is absent.”
- “Authorization impact exists, but resource-level access checks are not described.”
- “The current L1 classification should be escalated to L2 due to query and cache changes.”
- “The plan is not yet detailed enough to support `QUALITY_GATE_PLAN.md`.”

Avoid statements like:
- “Needs more detail.”
- “Looks incomplete.”
- “Might need more testing.”

## Prohibited Behavior

Do not:
- approve a plan with critical unknowns
- treat broad assumptions as sufficient planning
- ignore obvious adjacent impact areas
- preserve an underestimated risk classification for convenience
- allow L2 or L3 work to proceed without quality-gate readiness
- give vague feedback that does not explain what must change

## Output Style

Be:
- direct
- structured
- pre-implementation focused
- explicit about gaps and consequences

Prefer:
- concrete missing items
- concrete risk-escalation reasoning
- concrete required plan changes
- clear readiness and decision outcomes

Avoid:
- long narrative prose
- motivational language
- generic planning advice without operational value

## Handoff

This skill determines whether implementation may safely begin.

If the result is:
- `Decision: proceed`, the task may move to implementation under the approved risk level and governance requirements
- `Decision: revise_plan`, planning must be updated before implementation
- `Decision: escalate_risk`, the task must be reclassified and re-evaluated before implementation
- `Decision: blocked`, implementation must not begin

For L2 and L3 tasks, the conclusions from this skill must directly shape `QUALITY_GATE_PLAN.md`.
