---
name: review-observability
description: Use after planning or implementation when a task may affect logs, error handling, traceability, diagnostics, async workflows, integrations, or operational supportability. Review the change for missing visibility, weak error context, poor correlation, invisible failure modes, and production-debuggability gaps. Required for L3 tasks and other changes with meaningful operational risk.
---

# Review Observability

## Purpose

Perform a focused observability and supportability review of a proposed or implemented change.

This skill should identify:
- missing operational visibility
- poor debug paths
- weak error context
- missing request or workflow correlation
- invisible failure modes
- weak latency or throughput visibility
- inability to reason about production behavior
- supportability gaps that would slow diagnosis or incident response

This skill should help determine whether the change is operable in production, needs better instrumentation or error context, or must be blocked before completion.

## Use This Skill When

Use this skill:
- after planning when operational risk must be evaluated before implementation
- after implementation when observability review is required before task closure
- for L3 tasks where observability review is mandatory
- for any task affecting critical flows, async work, integrations, retries, or difficult-to-debug failure paths

Use it for changes involving:
- route handlers on important business flows
- background jobs or async workflows
- external integrations
- retry or timeout behavior
- cache-sensitive behavior
- query-heavy or latency-sensitive paths
- mutation flows that are operationally important
- error-handling changes
- logging changes
- user-visible failure states that need supportability

## Do Not Use This Skill For

Do not use this skill for:
- implementation planning by itself
- writing or editing code
- generic architecture review without operational focus
- security review
- performance review
- vague advice such as “add more logs” without explaining what visibility is missing and why it matters

## Core Rules

- **Review operational visibility:** Focus on whether the system can be understood, debugged, and supported in production.
- **Evidence-based findings:** Tie findings to the actual plan, changed files, or affected flows.
- **Severity discipline:** Classify each finding with the defined severity levels.
- **Actionable output:** Findings must identify what is hard to observe and why that matters.
- **No false approval:** Do not approve changes that leave critical failure modes opaque.
- **No noisy advice:** Avoid recommending instrumentation that adds noise without improving diagnosability.

## Inputs

Use these inputs when available:
- implementation plan
- `QUALITY_GATE_PLAN.md`
- changed files
- route handlers
- background or async logic
- integration code
- logging code
- error-handling code
- `VERIFICATION_EVIDENCE.md`
- related tests
- existing logging or telemetry conventions
- any traces, logs, metrics, or runtime notes relevant to the task

## Observability Review Objectives

The review should answer these questions clearly:

- Can important failures be diagnosed from available logs, errors, or signals?
- Do critical paths emit enough context to support investigation?
- Can related events be correlated across a request or workflow?
- Are async and retrying paths visible enough to debug?
- Are slow or failure-prone paths inspectable in practice?
- Are support and incident responders likely to understand what happened?
- What observability findings remain, and how severe are they?

## Review Process

### 1. Define the Review Scope

Identify:
- what is being reviewed
- whether this was a plan review or implementation review
- which files, routes, jobs, workflows, or integrations are in scope
- which operationally important paths are relevant

Keep the scope tied to the task, not the whole repository.

### 2. Review Logging Quality

Check for:
- missing logs on critical paths
- unstructured or inconsistent logs
- logs that lack useful context
- logs that expose sensitive data
- no distinction between expected and exceptional conditions
- logs that are too sparse to diagnose a failure
- logs that are too generic to distinguish similar failure causes

Focus on whether logs are useful for diagnosis, not whether there are simply “more logs.”

### 3. Review Error Diagnosis Quality

Check for:
- errors without actionable context
- swallowed errors
- generic catch blocks that reduce diagnosability
- missing metadata needed for support investigation
- failures that would be difficult to trace in production
- errors that collapse distinct root causes into one message
- error handling that hides where a failure originated

Focus on whether operators can understand what failed and where.

### 4. Review Request and Workflow Traceability

Check for:
- no request or correlation identifier strategy where one is needed
- inability to connect related events across a workflow
- async or background steps with poor visibility
- difficult-to-follow state transitions
- integration calls that cannot be tied back to the initiating operation
- retries that are invisible or indistinguishable

Focus on whether the end-to-end flow can be reconstructed during investigation.

### 5. Review Performance Visibility

Check for:
- no visibility into slow operations
- expensive flows with no measured checkpoints or usable inspection points
- no clear way to inspect latency or throughput issues
- no way to distinguish cache hit/miss behavior when that matters
- operations likely to degrade without any practical debugging signal

This section is not a full performance review; it focuses on the ability to observe performance problems.

### 6. Review Operational Supportability

Check for:
- no useful health or readiness signal where appropriate
- no meaningful event naming or categorization conventions
- hidden failure paths
- release behavior that would be hard to monitor
- insufficient artifacts for incident debugging
- user-visible failures with no actionable backend or frontend diagnosis path
- mutation or workflow state changes that are hard to inspect in production

Focus on whether the change can be supported safely after release.

### 7. Summarize Findings and Decision

For each finding:
- state the issue clearly
- explain where it appears
- explain why it weakens observability or supportability
- assign a severity
- recommend a concrete correction when possible

Then provide:
- residual risks
- overall decision

## Output Requirements

Produce the result using all sections below.

### Observability Review

#### Scope
State:
- what was reviewed
- whether this was plan review or implementation review
- which files, routes, jobs, workflows, or integrations were in scope

#### Operational Visibility Summary
Summarize the main observability, diagnosability, and supportability concerns relevant to the task.

#### Findings
List each finding with:
- title
- severity: `blocker`, `major`, or `minor`
- affected file(s) or flow(s)
- issue description
- operational impact

If no findings are identified, say so explicitly and state what was reviewed.

#### Recommended Changes
List the corrective actions or instrumentation improvements needed for each non-minor issue.

#### Residual Risks
State what risk remains even if the current findings are addressed, or what uncertainty remains because visibility could not be verified fully.

#### Decision
End with one of:
- `Decision: approved`
- `Decision: approved_with_minor_issues`
- `Decision: changes_required`
- `Decision: blocked`

## Severity Rules

Use exactly one severity for each finding:
- `blocker`
- `major`
- `minor`

Use:
- `blocker` for changes that would make critical failures opaque, unsafe to operate, or materially impair production diagnosis
- `major` for materially weak observability on important paths
- `minor` for useful but non-critical supportability improvements

## Decision Rules

Use:
- `approved` when no material observability or supportability issues remain
- `approved_with_minor_issues` when only minor instrumentation or supportability items remain
- `changes_required` when material gaps must be addressed before completion
- `blocked` when the change would leave a critical path too opaque or too difficult to operate safely

If any unresolved `blocker` finding exists, do not use `approved` or `approved_with_minor_issues`.

## Stack-Specific Review Expectations

### Fastify or equivalent backend request layer

Flag:
- critical routes with no structured diagnostic context
- failures that cannot be correlated to request, actor, or entity when such correlation is needed
- expensive or important routes with no usable timing or inspection visibility
- error handling that obscures the real failure cause

### PostgreSQL / Redis / persistence and cache layers

Flag:
- cache-sensitive behavior with no operational visibility
- query-heavy flows with no practical diagnosis path
- stale-data or invalidation-sensitive behavior with no inspectable signals
- data-path failures that would be hard to distinguish during investigation

### Frontend or client-side flows

Flag:
- user-facing failure states that provide no actionable diagnostics
- hard-to-debug remote state transitions
- invisible mutation or revalidation behaviors in critical flows
- client behavior that makes support investigation harder because state transitions are opaque

### Async work / jobs / integrations

Flag:
- background steps that cannot be correlated to the initiating request or entity
- retry paths that are invisible or hard to distinguish
- external integration failures that would be difficult to diagnose from emitted signals
- hidden state transitions during async execution

## Observability Review Quality Standard

Be:
- concrete
- operational
- diagnosability-focused
- supportability-aware
- explicit about severity and decision

Prefer statements like:
- “Mutation path lacks enough log context to diagnose entity state and actor identity.”
- “Async retry path becomes invisible once background execution starts.”
- “Slow-query risk exists, but no timing visibility is introduced on the path.”
- “Error handling collapses distinct failure causes into a single generic message.”
- “Cache-sensitive behavior changed, but no signal exists to inspect hit/miss or stale-read behavior.”

Avoid statements like:
- “Add more logs.”
- “Improve observability.”
- “This would be hard to debug.”
- “Supportability could be better.”

## Prohibited Behavior

Do not:
- give generic observability advice disconnected from the change
- recommend noisy logging without a clear diagnostic purpose
- approve a change that leaves critical failure paths opaque
- ignore supportability simply because the code is functionally correct
- downgrade severity just to make the review pass
- omit residual risk when operational visibility remains uncertain

## Output Style

Be:
- direct
- structured
- operationally grounded
- evidence-oriented

Prefer:
- exact files or flows
- explicit missing signals
- explicit diagnosis gaps
- explicit severity and decision
- concrete recommended changes

Avoid:
- long narrative prose
- motivational language
- vague “best practice” commentary without operational value

## Handoff

If this skill is used on an L3 task, its conclusions must be reflected in `REVIEW_REPORT.md`.

If the decision is:
- `approved` or `approved_with_minor_issues`, the task may proceed to the remaining required reviews or verification steps
- `changes_required` or `blocked`, the task must not be treated as complete until the issues are addressed or explicitly resolved
