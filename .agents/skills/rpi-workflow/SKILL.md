---
name: rpi-workflow
description: Use for any non-L0, multi-file, or higher-risk task that must follow the full Research → Risk Classification → Plan → Gap Check → Quality Gate → Implement → Review → Verify procedure. Orchestrates the RPI workflow by routing the task through the appropriate repository skills and enforcing approvals and completion gates. Do not use for trivial L0 work or for a single isolated phase when a phase-specific skill is sufficient.
---

# RPI Workflow

## Purpose

Orchestrate the full repository execution protocol for non-trivial work.

This skill exists to ensure that significant tasks follow the required sequence:

**Research → Risk Classification → Plan → Gap Check → Quality Gate → Approval → Implement → Review → Verify**

This skill should:
- route the task through the correct phase-specific skills
- enforce the required order of execution
- prevent premature coding
- ensure risk level and governance requirements are respected
- ensure L2 and L3 tasks produce the required gate artifacts before task closure

This skill must not:
- replace the phase-specific skills
- skip required phases for non-trivial work
- allow implementation to begin before the required preconditions are satisfied

## Use This Skill When

Use this skill for:
- any task that is not clearly L0
- any multi-file change
- any architectural change
- any API, schema, persistence, query, cache, state-flow, auth, permission, or observability-related task
- any rule, workflow, skill, or project-governance change
- any task where the full RPI procedure should be enforced from start to finish

Use it when the task needs **workflow orchestration**, not just one isolated phase.

## Do Not Use This Skill For

Do not use this skill for:
- trivial, tightly localized L0 work
- isolated research-only tasks
- isolated planning-only tasks
- isolated review-only tasks
- implementation that is already fully approved and only needs the `rpi-implement` phase
- tasks where a single phase-specific skill is sufficient and full orchestration is unnecessary

## Core Rules

- **RPI is mandatory for non-trivial work:** Do not skip required phases.
- **No coding before governance is satisfied:** Implementation must not begin until the workflow allows it.
- **Risk-aware enforcement:** The required rigor depends on the assigned risk level.
- **Context-budget discipline:** Keep active context under an estimated 40% of available budget whenever practical by favoring targeted loading, concise summaries, and minimal delegation payloads.
- **Phase-specific skills remain authoritative:** This skill routes and enforces; the detailed execution of each phase belongs to the corresponding skill.
- **No false completion:** A task is not complete until all required downstream gates have passed.
- **Escalate when reality changes:** If new evidence increases task severity, update the workflow path accordingly.

## Inputs

Use these inputs when available:
- the user request
- `AGENTS.md`
- repository docs
- domain docs
- existing task artifacts
- research output
- implementation plan
- current risk classification
- quality-gate artifacts
- review artifacts
- verification artifacts

When delegating to subagents:
- do not fork full thread context by default
- pass only the minimum task-local context needed to execute the assigned phase
- prefer exact file paths, compact summaries, and acceptance criteria over broad transcript history
- if context is getting too large, stop and compress the task state into a short handoff before continuing

## Workflow Objectives

This skill should ensure that the task answers these questions in order:

- What is actually in scope?
- What is the correct risk level?
- What is the explicit implementation plan?
- Is the plan safe and complete enough to execute?
- Does the task require a quality gate and approval?
- Has implementation stayed within approved scope?
- Have the required specialized reviews been performed?
- Is there explicit verification evidence?
- Is the task actually complete for its risk level?

## Workflow Sequence

### Step 1 — Run `rpi-research`

Use `rpi-research` first.

The research phase must:
- gather repository evidence
- identify the actual files, contracts, and boundaries involved
- avoid stack or architecture assumptions
- surface constraints, dependencies, and early risk signals
- make unknowns explicit

Expected outcome:
- evidence inventory
- affected areas
- early risk signals
- research readiness for planning

Do not continue to planning if research still depends on guesswork.

### Step 2 — Classify Risk

Before further planning, classify the task risk.

State explicitly:
- `Risk Level: L0 | L1 | L2 | L3`
- `Classification Rationale: <brief justification>`

Use the repository’s risk policy from `AGENTS.md` and related project rules.

If classification is unclear, use the higher level until evidence supports a lower one.

### Step 3 — Run `rpi-plan`

Use `rpi-plan` after research and risk classification.

The planning phase must:
- create a concrete implementation plan without editing application code
- define the likely implementation surface
- identify target files
- define acceptance criteria
- state assumptions and open questions
- align the approach to research evidence and current risk

Expected outcome:
- implementation plan
- expected file impact
- validation strategy
- acceptance criteria
- planning readiness for gap check

### Step 4 — Run `plan-gap-check`

Use `plan-gap-check` before implementation.

This phase must:
- identify missing context
- identify hidden dependencies
- identify testing or validation gaps
- identify architecture, performance, security, and observability omissions
- reassess whether the current risk level is still correct
- determine whether implementation may proceed

Expected outcome:
- plan gaps
- required revisions
- risk escalation decision if needed
- gate readiness decision
- proceed / revise / escalate / blocked decision

If the result is not ready to proceed, do not begin implementation.

### Step 5 — Create `QUALITY_GATE_PLAN.md` for L2/L3

If the task is L2 or L3, create `QUALITY_GATE_PLAN.md` before implementation.

The quality gate plan must include:
- task summary
- risk level and rationale
- affected domains
- expected files to modify
- performance impact assessment
- scalability impact assessment
- security impact assessment
- observability impact assessment
- API, database, and cache impact
- testing strategy
- rollback or fallback strategy
- mandatory reviewers
- open questions

It must end with one of:
- `Gate Status: Ready for Approval`
- `Gate Status: Blocked`

If blocked, do not proceed.

### Step 6 — Wait for Required Approval

Approval requirements:
- **L0 / L1:** proceed according to normal task flow unless explicit approval is otherwise required
- **L2:** obtain user review and approval of `QUALITY_GATE_PLAN.md` before coding
- **L3:** obtain explicit user review and approval of `QUALITY_GATE_PLAN.md` before coding

Do not start implementation for L2 or L3 before approval is obtained.

### Step 7 — Run `rpi-implement`

Use `rpi-implement` only after the required preconditions are satisfied.

Execution rule:
- delegate the implementation phase to a spawned worker agent using model `gpt-5.4-mini` by default
- keep orchestration and downstream governance in the primary agent
- keep post-implementation review ownership in the primary agent, including review execution, artifact generation, and final readiness decisions
- only bypass the `gpt-5.4-mini` implementation delegation when the user explicitly overrides the model choice
- while the worker is implementing, the primary agent must not compete with the worker on the same implementation work and must instead use that time for non-overlapping coordination, review preparation, or verification prep
- the worker is not responsible for post-implementation review, verification evidence, or completion decisions

Implementation must:
- follow the approved plan
- stay within approved scope
- keep changes small, testable, and reviewable
- avoid silent scope expansion
- surface deviations and risk escalation early
- preserve traceability to the approved plan and quality gate where required

Expected outcome:
- code changes aligned to the approved plan
- targeted tests or validation updates where needed
- implementation notes when material deviations occurred

### Step 8 — Run Specialized Reviews

Select the required reviews based on risk and task type.

The primary agent remains responsible for this step even when Step 7 was delegated.
Delegated implementation does not transfer authority to approve the change, close findings, or declare the task complete.
The primary agent must wait for the worker agent to explicitly signal implementation completion before beginning review or verification artifacts.

Minimum review requirements:

#### L1
- focused review as needed

#### L2
- `review-performance`
- `review-security`

#### L3
- `review-performance`
- `review-security`
- `review-observability`

Add domain-specific reviews when relevant.

Examples:
- migration-sensitive work → migration review
- contract changes → API contract review
- frontend state/data-flow changes → frontend data-flow review

Do not treat review as optional when the risk level requires it.

### Step 9 — Create `REVIEW_REPORT.md` for L2/L3

For L2 and L3 tasks, create `REVIEW_REPORT.md` after implementation and specialized reviews.

It must include:
- scope reviewed
- changed files summary
- reviewers executed
- findings by category
- severity per finding
- unresolved risks
- final recommendation
- readiness decision

Allowed final decisions:
- `approved`
- `approved_with_minor_issues`
- `changes_required`
- `blocked`

If any blocker exists, do not use `approved`.

### Step 10 — Run `verify-local-evidence`

Use `verify-local-evidence` before treating the task as complete.

This phase must produce:
- `VERIFICATION_EVIDENCE.md`

It must summarize:
- checks executed
- checks not executed
- results
- limitations
- residual risks
- readiness statement

Verification must be explicit and evidence-based.

### Step 11 — Apply Completion Rules

Do not mark the task complete unless the required gates for its risk level have passed.

#### L0
Completion requires:
- implementation aligned to scope
- lightweight validation

#### L1
Completion normally requires:
- implementation aligned to plan
- focused review where needed
- validation evidence in the final summary or artifact set

#### L2 / L3
Completion requires:
- approved implementation exists
- `QUALITY_GATE_PLAN.md` exists
- `REVIEW_REPORT.md` exists
- `VERIFICATION_EVIDENCE.md` exists
- mandatory reviews were executed
- no unresolved blocker remains

## Risk Escalation Rule

At any point in the workflow, escalate the task if new evidence reveals:
- broader file impact than expected
- hidden API, schema, or contract impact
- cache or concurrency concerns
- auth, permission, or file-access implications
- migration or public-breaking-change implications
- meaningful performance, scalability, security, or observability impact
- unclear rollback or verification path

If the risk level changes materially:
- update the classification
- return to the appropriate prior phase if needed
- do not continue implementation under outdated governance

## Output Requirements

When this skill is actively orchestrating a task, it should keep the workflow state explicit.

At minimum, it should make clear:
- current phase
- current risk level
- whether implementation is allowed yet
- what artifact or approval is still missing
- what the next valid step is

## Decision Logic

### Implementation may proceed only if:
- research is complete enough for planning
- risk is classified
- plan exists
- `plan-gap-check` allows progress
- required gate artifacts exist
- required approval has been obtained
- the `gpt-5.4-mini` implementation delegation is prepared, unless the user explicitly approved a different implementation model

### Implementation must not proceed if:
- research still depends on guesswork
- plan has critical gaps
- risk is underestimated
- the quality gate is blocked
- required approval is missing
- the actual implementation surface has drifted materially beyond the approved plan

## Prohibited Behavior

Do not:
- jump directly from user request to implementation for non-trivial work
- skip risk classification
- treat chat-only reasoning as a substitute for explicit plan or gate artifacts
- start L2 or L3 implementation before approval
- treat delegated implementation as transferring post-implementation review or completion authority away from the primary agent by default
- run the implementation phase on a different model by default when `gpt-5.4-mini` delegation is required
- skip mandatory specialized reviews
- mark a task complete without verification evidence when required
- continue under an outdated risk level after new evidence changes the task

## Output Style

Be:
- structured
- phase-aware
- governance-aware
- explicit about what is allowed next

Prefer:
- direct workflow state
- explicit risk level
- explicit missing artifact or approval
- explicit next step

Avoid:
- vague progress language
- skipping phase transitions implicitly
- treating workflow enforcement as optional guidance

## Handoff

This skill is the top-level orchestrator for significant work.

It should route the task through:
- `rpi-research`
- risk classification
- `rpi-plan`
- `plan-gap-check`
- `rpi-implement`
- required specialized reviews
- `verify-local-evidence`

Use this skill to enforce the full procedure.
Use the phase-specific skills to execute each phase correctly.
