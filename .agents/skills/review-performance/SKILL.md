---
name: review-performance
description: Use after planning or implementation when a task may affect request cost, query efficiency, caching behavior, rendering performance, payload size, high-volume paths, or scalability. Review the change for expensive request-path logic, unbounded queries, over-fetching, cache flaws, avoidable rerenders, and scaling risks. Required for L2 and L3 tasks with performance-relevant scope.
---

# Review Performance

## Purpose

Perform a focused performance and scalability review of a proposed or implemented change.

This skill should identify:
- inefficient data access
- over-fetching or oversized payloads
- unnecessary rendering or duplicate fetching
- poor cache design
- expensive request-path logic
- missing pagination, batching, or bounding
- hidden scaling risks
- operational cost increases that are not acknowledged

This skill should help determine whether the change is acceptable as-is, needs optimization, or must be blocked before completion.

## Use This Skill When

Use this skill:
- after planning when performance or scalability risk must be evaluated before implementation
- after implementation when performance review is required before task closure
- for any task affecting API behavior, queries, lists, reports, rendering, caching, or high-volume paths
- for L2 tasks when performance review is required
- for L3 tasks where performance review is mandatory

Use it for changes involving:
- route handlers or request-path logic
- database queries or persistence behavior
- caching or Redis usage
- frontend data fetching
- React Query invalidation or server-state handling
- large list or report views
- payload construction
- retry, batching, timeout, or idempotency-sensitive flows

## Do Not Use This Skill For

Do not use this skill for:
- implementation planning by itself
- writing or editing code
- generic architecture review without performance focus
- security review
- observability review
- vague “this might not scale” commentary unsupported by the actual change

## Core Rules

- **Review actual cost drivers:** Focus on real performance and scalability implications of the change.
- **Evidence-based findings:** Tie findings to the actual plan, changed files, or affected flows.
- **Severity discipline:** Classify each finding with the defined severity levels.
- **Actionable output:** Findings must be specific enough to guide correction.
- **No false approval:** Do not approve changes that leave material performance or scaling risks unresolved.
- **No generic advice:** Avoid abstract recommendations that are not connected to the change.

## Inputs

Use these inputs when available:
- implementation plan
- `QUALITY_GATE_PLAN.md`
- changed files
- relevant domain docs
- query code
- route handlers
- frontend data-fetching code
- state-management code
- cache usage
- related tests
- `VERIFICATION_EVIDENCE.md`
- logs, traces, metrics, or measurements when available
- any notes about expected volume, cardinality, hot paths, or retry behavior

## Performance Review Objectives

The review should answer these questions clearly:

- Does the request path do avoidable or excessive work?
- Are queries bounded, selective, and likely to behave well under volume?
- Does cache usage improve performance without weakening correctness?
- Does the frontend fetch, store, and render data efficiently?
- Are payload size and invalidation strategy appropriate?
- Are there scaling assumptions that become unsafe under higher volume or retries?
- What performance findings remain, and how severe are they?

## Review Process

### 1. Define the Review Scope

Identify:
- what is being reviewed
- whether this was a plan review or implementation review
- which files, routes, queries, components, or flows are in scope
- which request paths or UI paths are performance-relevant

Keep the scope tied to the task, not the whole repository.

### 2. Review Backend Request-Path Efficiency

Check for:
- unnecessary synchronous work in request handlers
- expensive operations on hot paths
- avoidable serialization or transformation cost
- missing timeouts around external dependencies
- retries without guardrails
- large payload construction
- duplicated work that could be avoided or deferred
- route logic that performs business-heavy work in the wrong layer

Focus on cost per request and how it scales under load.

### 3. Review Database and Query Behavior

Check for:
- N+1 patterns
- missing pagination or bounding
- full-table scan risk
- over-selection of columns
- unbounded filtering or sorting
- missing or implied index needs
- unnecessary joins
- query patterns likely to degrade with larger result sets
- write or read patterns likely to create contention or cost spikes

Focus on cardinality, selectivity, and how data-access cost grows with volume.

### 4. Review Cache and Redis Behavior

Check for:
- unclear cache key design
- missing TTL
- missing invalidation strategy
- cache usage that hides poor query design instead of addressing it
- stale data risk
- over-broad cache invalidation
- inconsistent read and write behavior
- caching patterns that create correctness or scale issues under concurrency

Focus on whether caching improves performance predictably and safely.

### 5. Review Frontend Data Flow and Rendering

Check for:
- duplicated server state
- misuse of client state stores for remote data
- over-broad React Query invalidation
- duplicate fetching
- unnecessary rerenders
- large list rendering without strategy
- missing lazy loading where appropriate
- heavy components on critical routes
- excessive prop drilling or state coupling that increases render cost

Focus on fetch efficiency, invalidation precision, and render cost on real UI paths.

### 6. Review Scalability Characteristics

Check for:
- assumptions that fail under higher volume
- no strategy for large result sets
- no strategy for bursts or retries
- coupling that prevents isolated scaling
- hidden cost multipliers
- lack of idempotency where reprocessing may happen
- synchronous dependencies that become bottlenecks
- operational cost increases that are not acknowledged

This section should cover how the change behaves beyond the happy path at low scale.

### 7. Summarize Findings and Decision

For each finding:
- state the issue clearly
- explain where it appears
- explain the cost or scaling risk
- assign a severity
- recommend a concrete correction when possible

Then provide:
- residual risks
- overall decision

## Output Requirements

Produce the result using all sections below.

### Performance Review

#### Scope
State:
- what was reviewed
- whether this was plan review or implementation review
- which files, routes, queries, components, or flows were in scope

#### Risk Summary
Summarize the main performance, scalability, and cost concerns relevant to the task.

#### Findings
List each finding with:
- title
- severity: `blocker`, `major`, or `minor`
- affected file(s) or flow(s)
- issue description
- performance or scalability impact

If no findings are identified, say so explicitly and state what was reviewed.

#### Recommended Changes
List the corrective actions or optimizations needed for each non-minor issue.

#### Residual Risks
State what risk remains even if the current findings are addressed, or what uncertainty remains due to limited validation or lack of measurement.

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
- `blocker` for changes likely to cause serious degradation, outages, runaway cost, or unsafe scaling behavior
- `major` for meaningful inefficiencies or scalability weaknesses that materially reduce confidence
- `minor` for lower-risk optimization opportunities or limited inefficiencies that do not materially break the expected performance posture

## Decision Rules

Use:
- `approved` when no material performance or scalability issues remain
- `approved_with_minor_issues` when only minor optimization items remain
- `changes_required` when material issues must be addressed before completion
- `blocked` when the change creates or preserves a serious performance, scaling, or operational-cost problem that should stop the task from moving forward

If any unresolved `blocker` finding exists, do not use `approved` or `approved_with_minor_issues`.

## Stack-Specific Review Expectations

### Frontend

Prefer:
- server state handled with the project’s server-state tools
- client state stores used only where justified for local or app-level client state

Flag:
- duplicated server state in client state stores
- over-broad invalidation without reason
- avoidable rerenders caused by state shape or component design
- large list rendering without paging, virtualization, or bounded access
- unnecessary duplicate fetching on the same route or interaction path

### Backend

Flag:
- handlers doing business-heavy work on the request path without clear justification
- unbounded result sets
- route changes that alter cost profile without acknowledgment
- expensive serialization or response construction
- retries, external calls, or synchronous work without guardrails

### Database

Flag:
- changes that likely require indexes but do not acknowledge them
- query changes with no bounded-cardinality reasoning
- read or write patterns likely to create contention or cost spikes
- joins or scans that become risky under realistic volume

### Cache / Redis / Infrastructure

Flag:
- unclear cache scoping
- missing invalidation strategy
- TTL choices that make correctness or freshness unclear
- stale-read risk not acknowledged
- cache use that masks inefficient query design instead of correcting it

## Performance Review Quality Standard

Be:
- concrete
- file-aware
- cost-aware
- scalability-aware
- explicit about severity and decision

Prefer statements like:
- “List endpoint is unbounded and lacks pagination.”
- “Query selects more columns than the response needs.”
- “React Query invalidation is broader than necessary and may trigger avoidable refetching.”
- “Cache invalidation after mutation is undefined, so stale reads may persist.”
- “Critical route now performs expensive transformation synchronously on every request.”

Avoid statements like:
- “Performance could be improved.”
- “This may not scale well.”
- “Consider optimizing later.”

## Prohibited Behavior

Do not:
- give generic optimization advice disconnected from the change
- ignore scaling assumptions just because the current dataset may be small
- approve a change that leaves material unbounded query or request-path risk unresolved
- confuse correctness issues with performance issues unless there is a clear cost or scale implication
- downgrade severity just to make the review pass
- omit residual risk when verification or measurement is limited

## Output Style

Be:
- direct
- structured
- performance-specific
- evidence-oriented

Prefer:
- exact files or flows
- explicit cost drivers
- explicit scaling concerns
- explicit severity and decision
- concrete recommended changes

Avoid:
- long narrative prose
- motivational language
- vague “best practice” commentary without operational value

## Handoff

If this skill is used on an L2 or L3 task, its conclusions must be reflected in `REVIEW_REPORT.md`.

If the decision is:
- `approved` or `approved_with_minor_issues`, the task may proceed to the remaining required reviews or verification steps
- `changes_required` or `blocked`, the task must not be treated as complete until the issues are addressed or explicitly resolved
