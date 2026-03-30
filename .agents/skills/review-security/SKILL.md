---
name: review-security
description: Use after planning or implementation when a task may affect trust boundaries, authentication, authorization, external input, file access, secrets, or sensitive data. Review the change for validation gaps, permission flaws, exposure risks, abuse paths, and security regressions. Required for L2 and L3 tasks with security-relevant scope.
---

# Review Security

## Purpose

Perform a focused security review of a proposed or implemented change.

This skill should identify:
- broken trust boundaries
- missing or weak validation
- authentication or authorization flaws
- unsafe data exposure
- secret or configuration handling mistakes
- abuse paths
- operational security regressions

This skill should help determine whether the change is acceptable as-is, needs hardening, or must be blocked before completion.

## Use This Skill When

Use this skill:
- after planning when security risk must be evaluated before implementation
- after implementation when security review is required before task closure
- for any task affecting auth, permissions, files, API boundaries, external input, or sensitive data
- for L2 tasks when security review is required
- for L3 tasks where security review is mandatory

Use it for changes involving:
- request validation
- route handlers or API boundaries
- auth or permission logic
- file upload or download behavior
- secrets or environment usage
- data selection or exposure changes
- abuse-sensitive endpoints
- cache decisions that influence access or security-sensitive behavior

## Do Not Use This Skill For

Do not use this skill for:
- implementation planning by itself
- writing or editing code
- general architecture review without security focus
- performance review
- observability review
- vague “security best practices” commentary unsupported by the actual change

## Core Rules

- **Review actual boundaries:** Focus on real trust boundaries, not generic advice.
- **Evidence-based findings:** Tie findings to the actual plan, changed files, or affected flows.
- **Severity discipline:** Classify each finding with the defined severity levels.
- **Actionable output:** Findings must be specific enough to guide correction.
- **No false approval:** Do not approve changes that leave material security regressions unresolved.
- **No vague reassurance:** Avoid generic statements that do not identify a concrete issue or non-issue.

## Inputs

Use these inputs when available:
- implementation plan
- `QUALITY_GATE_PLAN.md`
- changed files
- route handlers
- validation schemas
- auth or permission logic
- file access logic
- environment or config usage
- `REVIEW_REPORT.md`, if being updated
- `VERIFICATION_EVIDENCE.md`
- related tests
- logs or error-handling behavior relevant to the security surface

## Security Review Objectives

The review should answer these questions clearly:

- Are all external inputs validated at the correct boundary?
- Are authentication and authorization enforced at the correct layer?
- Does the change expose sensitive data unnecessarily?
- Are secrets, tokens, and configuration handled safely?
- Are files, downloads, or external content handled safely?
- Does the change introduce abuse, replay, or enumeration paths?
- Does cache or infrastructure behavior weaken access or security guarantees?
- What security findings remain, and how severe are they?

## Review Process

### 1. Define the Review Scope

Identify:
- what is being reviewed
- whether the review is pre-implementation or post-implementation
- which files, routes, flows, or boundaries are in scope
- which security-sensitive behaviors are relevant

Keep the scope tied to the task, not the entire repository.

### 2. Review Boundary Validation

Check for:
- missing input validation
- incomplete validation
- weak coercion or parsing assumptions
- trust in frontend validation alone
- unsafe assumptions about request payloads
- unvalidated query params, headers, cookies, or path params
- schema declarations that do not match real route behavior

Look for validation at the real server-side trust boundary.

### 3. Review Authentication and Authorization

Check for:
- missing auth checks at sensitive routes
- authorization based only on “logged in” state
- missing ownership or resource-level checks
- role logic that is too broad
- privilege escalation paths
- permission checks enforced only in the UI
- backend handlers that assume trusted callers without verifying rights

Focus on whether the backend enforces the intended access model.

### 4. Review Sensitive Data Exposure

Check for:
- returning internal fields unnecessarily
- logging sensitive data
- error messages leaking internal details
- exposing secrets, tokens, internal identifiers, or private metadata
- selecting or returning broader record sets than necessary
- insecure debug behavior in normal execution paths

Prefer least exposure consistent with the task.

### 5. Review Files, Downloads, and External Input

Check for:
- weak file access control
- insecure upload validation
- trusting path or identifier input without verification
- unsafe assumptions about content type, filename, or metadata
- missing access checks on download routes
- unsafe external-content handling or storage assumptions

Be especially strict when file access or user-owned resources are involved.

### 6. Review Secrets and Configuration

Check for:
- secrets in code
- unsafe defaults
- unsafe environment-variable usage
- debug behavior that leaks sensitive information
- implicit trust in local-only assumptions
- configuration paths that weaken security guarantees unexpectedly

Focus on whether configuration and secret handling remain safe in realistic environments.

### 7. Review Abuse and Resilience Paths

Check for:
- missing rate limiting on sensitive endpoints
- brute-force or enumeration risk
- replay or idempotency issues in critical writes
- abuse paths through search or list endpoints
- excessive trust in client state
- weak anti-abuse assumptions around retries, identifiers, or state transitions

This section should cover security-relevant misuse, not just correctness.

### 8. Review Data Access and Infrastructure Effects

Check for:
- data access changes that broaden accessible records without explicit authorization logic
- raw SQL or dangerous query construction without strict safety rationale
- cached sensitive data without access considerations
- security-sensitive decisions derived from stale or weakly scoped cache state
- infrastructure shortcuts that weaken trust boundaries

Focus on how storage, caching, and infrastructure choices affect security guarantees.

### 9. Summarize Findings and Decision

For each finding:
- state the issue clearly
- explain where it appears
- explain the risk
- assign a severity
- recommend a concrete correction when possible

Then provide:
- residual risks
- overall decision

## Output Requirements

Produce the result using all sections below.

### Security Review

#### Scope
State:
- what was reviewed
- whether this was plan review or implementation review
- which files, routes, or flows were in scope

#### Threat Summary
Summarize the main trust boundaries and likely abuse or exposure concerns relevant to the task.

#### Findings
List each finding with:
- title
- severity: `blocker`, `major`, or `minor`
- affected file(s) or flow(s)
- issue description
- risk explanation

If no findings are identified, say so explicitly and state what was reviewed.

#### Recommended Changes
List the corrective actions or hardening steps needed for each non-minor issue.

#### Residual Risks
State what risk remains even if the current findings are addressed, or what uncertainty remains due to limited verification.

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
- `blocker` for vulnerabilities, likely security regressions, or broken trust-boundary enforcement
- `major` for material weaknesses that significantly reduce confidence or leave important abuse or exposure paths insufficiently controlled
- `minor` for lower-risk hardening opportunities that do not materially break the intended security posture

## Decision Rules

Use:
- `approved` when no material security issues remain
- `approved_with_minor_issues` when only minor hardening items remain
- `changes_required` when material issues must be addressed before completion
- `blocked` when the change creates or preserves a serious security problem that should stop the task from moving forward

If any unresolved `blocker` finding exists, do not use `approved` or `approved_with_minor_issues`.

## Stack-Specific Review Expectations

### Fastify + Zod or equivalent backend validation stack

Flag:
- any external input path without validation
- validation inconsistent with real route behavior
- mismatches between declared schema and actual route assumptions
- handlers that parse or trust data outside the validated boundary

### React or equivalent frontend client

Flag:
- reliance on frontend-only route protection
- storing sensitive server truth in unsafe client state patterns
- exposing privileged behaviors hidden only by UI
- security assumptions enforced only in components and not in backend boundaries

### Drizzle / PostgreSQL or equivalent data-access layer

Flag:
- data access changes that broaden accessible records without explicit authorization logic
- unsafe query construction
- record-selection logic that leaks data across ownership boundaries
- write paths with weak ownership or permission enforcement

### Redis / caching / infrastructure

Flag:
- cached sensitive data without clear access considerations
- security-sensitive decisions derived from stale or weakly scoped cache state
- cache invalidation or cache scoping that can weaken security expectations

## Security Review Quality Standard

Be:
- concrete
- implementation-aware
- boundary-focused
- abuse-aware
- explicit about severity and decision

Prefer statements like:
- “Route validates the body but not resource ownership from the path parameter.”
- “Permission is enforced in the UI only, not at the API boundary.”
- “Download flow lacks resource-level authorization.”
- “Error path may leak internal operational details.”
- “Data-access change broadens visible records without an ownership filter.”

Avoid statements like:
- “Consider improving security.”
- “This should be more secure.”
- “Looks mostly safe.”

## Prohibited Behavior

Do not:
- give generic security advice disconnected from the change
- hide uncertainty when verification is partial
- approve a change that leaves material auth, exposure, or trust-boundary issues unresolved
- confuse correctness issues with security issues unless there is a clear security implication
- downgrade severity just to make the review pass
- omit residual risk when it materially affects confidence

## Output Style

Be:
- direct
- structured
- security-specific
- evidence-oriented

Prefer:
- exact files or flows
- explicit trust boundaries
- explicit abuse paths
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
