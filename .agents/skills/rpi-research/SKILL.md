---
name: rpi-research
description: Use before planning for any non-L0 or potentially non-local task. Research the repository to identify exact files, confirmed architecture and stack, boundaries, dependencies, unknowns, and early risk signals. Do not use for implementation, code edits, or post-implementation review.
---

# RPI Research

## Purpose

Perform the research phase of the RPI workflow.

Build a reliable evidence base before planning or implementation begins.

This skill should:
- identify the exact domain or subsystem involved
- locate the exact files and modules relevant to the task
- confirm the actual stack and architectural patterns from repository evidence
- identify likely impact boundaries and adjacent dependencies
- surface unknowns, missing evidence, and dependency gaps
- surface early performance, scalability, security, and observability risk signals

This skill must not:
- edit application code
- make implementation decisions
- present assumptions as facts

## Use This Skill When

Use this skill before `rpi-plan`.

Use it for:
- any task that is not clearly L0
- any multi-file change
- any architectural change
- any task affecting API behavior, contracts, persistence, cache, state flow, auth, permissions, or observability
- any task governed by the RPI workflow
- any task where the real ownership, boundaries, or impact surface are not yet confirmed

## Do Not Use This Skill For

Do not use this skill for:
- writing or editing code
- producing the implementation plan
- post-implementation review
- verification after code changes
- trivial single-file work that is clearly L0 and already well understood

## Core Rules

- **No code changes:** Do not edit application code during research.
- **Evidence first:** Use repository evidence before making claims.
- **No invention:** Do not fabricate architecture, config, ownership, or dependencies.
- **Targeted loading:** Keep context focused on the task and affected domain.
- **Context-budget discipline:** Keep active context under an estimated 40% of available budget whenever practical by loading only the smallest evidence set needed for the current question.
- **Path precision:** Prefer exact repository paths over broad directory references.
- **Line-aware evidence:** Include line numbers for important claims when practical.
- **Boundary discipline:** Distinguish confirmed evidence from likely impact and from unknowns.
- **No premature planning:** Research should clarify reality, not decide the solution.

## Inputs

Use these inputs when available:
- the user request
- `AGENTS.md`
- repository structure
- relevant repository docs
- relevant domain docs
- workflow documents if the task is already under workflow control
- exact code files found through search
- relevant configuration files
- related tests when useful for understanding current behavior
- prior research artifacts for the same task, if they already exist

## Research Objectives

Before planning begins, answer these questions as concretely as possible:

- What exact domain or subsystem is involved?
- What exact files are relevant?
- What architecture and technology choices are actually implemented?
- What adjacent systems may be affected?
- What constraints or conventions must planning respect?
- What is still unknown?
- What early risk signals are already visible?

## Research Process

### 1. Identify the Relevant Domain

Determine the module, feature, service, or bounded context most likely involved.

Use repository evidence to identify, where relevant:
- frontend domain
- backend domain
- shared contracts or types
- persistence layer
- cache or infrastructure layer
- related test area
- generated-code or codegen ownership

Do not stop at the first likely match if adjacent impact appears probable.

### 2. Locate Exact Files

Map the concrete files most likely involved.

Prefer:
- exact file paths
- exact modules
- exact route, handler, service, store, query, component, contract, schema, or config files

Over:
- broad folder references
- speculative file groups

When possible, identify:
- primary files
- secondary or adjacent files
- related tests
- relevant configuration files

### 3. Confirm the Real Stack and Architecture

Verify actual stack and conventions from repository evidence.

Inspect only what is relevant, such as:
- package manager and project manifest files
- TypeScript configuration
- framework setup
- validation setup
- ORM or database access setup
- cache or infrastructure setup
- generated client or contract flow
- directory structure that reflects architectural boundaries

Capture exact file paths and line references for meaningful claims when practical.

### 4. Identify Behavioral Boundaries

Determine how the task fits into the existing architecture.

Identify, where relevant:
- route or handler boundaries
- service or business-logic boundaries
- validation boundaries
- state-management boundaries
- query or data-access boundaries
- cache boundaries
- UI composition boundaries
- generated-contract boundaries
- auth or permission boundaries

The goal is to prevent later planning from crossing layers incorrectly.

### 5. Estimate the Likely Impact Surface

Based on evidence, identify what may need to change.

This is not planning.
This is a research-stage estimate of likely impact, such as:
- route + schema + service
- component + hook + query key
- query path + cache invalidation path
- contract + generated client usage

Mark each impact area as:
- `confirmed`
- `likely`
- `unknown`

### 6. Identify Gaps and Unknowns

List what is still unclear.

Examples:
- missing or ambiguous ownership
- unclear auth or resource-ownership logic
- unclear query path
- missing test coverage
- unclear generated-code flow
- missing integration evidence
- user-requested behavior that does not appear to exist in the repository

Do not invent missing setup.
State gaps explicitly.

### 7. Surface Early Risk Signals

Identify early indicators of elevated task risk.

Look for signals such as:
- multi-file coordination
- public contract impact
- query or persistence changes
- cache implications
- auth or permission involvement
- file security implications
- broad state-flow effects
- expensive list, report, or aggregation paths
- weak observability on critical flows
- unclear rollback or verification path

Do not force final risk classification here unless the workflow explicitly requires it.
Surface the signals clearly so later classification is evidence-based.

## Output Requirements

Produce the result using all sections below.

### 1. Research Scope

Summarize:
- the task being researched
- the domain or domains inspected
- the objective of this research pass

### 2. Confirmed Evidence

List concrete evidence found in the repository.

Use bullets or grouped sections with:
- exact file path
- relevant line number or range when practical
- what the evidence confirms

Good evidence includes:
- stack confirmation
- architectural ownership
- route or handler ownership
- validation location
- data-access ownership
- state or cache ownership
- generated client or contract ownership

### 3. Relevant Files Inventory

Group files as:

- **Primary Files**
- **Secondary / Adjacent Files**
- **Related Tests**
- **Relevant Configuration / Contracts / Schemas**

For each file, state briefly why it matters.

### 4. Confirmed Stack / Architecture Summary

Summarize the actual stack and repository-specific architecture confirmed by evidence.

Keep this concrete and grounded in the repository.

### 5. Likely Impact Surface

List the areas likely to be affected.

Mark each item as:
- `confirmed`
- `likely`
- `unknown`

### 6. Risks and Unknowns

List:
- unresolved questions
- missing evidence
- unclear ownership or integration points
- possible blockers to accurate planning

### 7. Early Risk Signals

List the main risk indicators discovered in research.

Examples:
- contract change risk
- auth boundary risk
- query cost risk
- cache invalidation risk
- state-flow risk
- observability weakness
- migration sensitivity

### 8. Research Readiness

End with one of:
- `Research Status: Ready for Planning`
- `Research Status: Needs More Investigation`

If research is not ready, state exactly what is missing.

## Research Quality Standard

### Evidence Quality

Prefer:
- exact repository paths
- exact file references
- exact ownership boundaries
- direct code or config evidence

Avoid:
- assuming a technology because it is common
- assuming architecture from folder names alone
- claiming ownership without evidence

### Context Discipline

Load only what is necessary for the current domain and phase.

Do not:
- inspect broad unrelated repository areas
- turn research into planning or implementation
- load excessive files without a clear purpose

### Unknowns

Unknowns must be explicit.

If something critical is unclear, say so directly and mark the research as not ready for planning.

## Prohibited Behavior

Do not:
- write or edit application code
- propose implementation details as though research were already planning
- fabricate stack or architecture details
- hide uncertainty
- omit adjacent impact when evidence suggests it exists
- treat broad directory guesses as sufficient evidence
- mark research complete if planning would still depend on guesswork

## Output Style

Be:
- structured
- concrete
- evidence-oriented
- repository-specific

Prefer:
- exact paths
- exact impact notes
- explicit unknowns
- brief, high-signal summaries

Avoid:
- generic architecture commentary
- long narrative prose without operational value
- unsupported statements

## Handoff

The output of this skill must make the next step possible.

It must give `rpi-plan` enough clarity to:
- build a concrete implementation plan
- ground downstream risk classification in evidence
- support `plan-gap-check` without relying on guesswork

Research is complete only when planning can proceed without depending on fabricated or assumed repository facts.
