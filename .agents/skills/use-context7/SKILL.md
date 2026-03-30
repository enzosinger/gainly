---
name: use-context7
description: Use when repository work depends on external library or framework documentation that is not already clear from local code or project docs. Resolve the correct library first, then query Context7 for specific documentation. Do not use when repository evidence is sufficient or when the task does not require external docs.
---

# Use Context7

## Purpose

Use the Context7 MCP integration to retrieve external library and framework documentation that is relevant to the current task.

This skill should help:
- confirm current library or framework behavior
- clarify APIs, configuration, or usage patterns
- reduce guessing when local repository evidence is insufficient
- support research, planning, review, or implementation with targeted documentation lookup

This skill must not:
- replace repository evidence when the local code already answers the question
- become a generic browsing step for every task
- be used without a focused documentation question

## Use This Skill When

Use this skill when:
- the task depends on a library, framework, SDK, or tool whose behavior is not fully clear from the repository
- the repository uses a dependency with version-sensitive behavior
- you need to confirm official usage, API shape, configuration, or migration details
- external documentation is needed to avoid guessing

Common examples include:
- framework APIs
- library configuration
- validation libraries
- routing libraries
- data-fetching libraries
- ORM behavior
- build-tool behavior
- CSS framework behavior
- SDK usage
- integration setup details

## Do Not Use This Skill For

Do not use this skill when:
- the answer is already clear from repository code, tests, or project docs
- the task is purely local refactoring with no external-doc dependency
- the question is too vague to search effectively
- the task requires implementation rather than documentation lookup

## Core Rules

- **Repository evidence first:** Prefer local repository evidence when it is sufficient.
- **Targeted external lookup:** Query Context7 only for the specific library question that remains unresolved.
- **Resolve before querying:** Identify the correct library ID before requesting docs.
- **Precise questions:** Use focused queries, not broad searches.
- **No invented docs:** If Context7 is unavailable or incomplete, say so explicitly.
- **No setup fiction:** Do not assume MCP is configured unless it is actually available in the environment.

## Inputs

Use these inputs when available:
- the current task
- the unresolved external documentation question
- the relevant library, framework, SDK, or tool name
- repository evidence showing where that dependency is used
- version clues from the repository when available

## Context7 Usage Objectives

Before using Context7, determine:
- what exact library or framework needs confirmation
- what exact documentation question needs answering
- whether the repository already answers the question
- whether version-specific behavior might matter

## Usage Process

### 1. Confirm External Documentation Is Needed

Before querying Context7:
- inspect the relevant local code and docs
- identify the exact unresolved question
- confirm that external documentation is still needed

Examples:
- exact API usage is unclear
- configuration behavior is version-sensitive
- migration or integration behavior is uncertain
- the repository references a library pattern without explaining it

### 2. Resolve the Correct Library

Use the Context7 library-resolution tool first to find the correct library identifier.

Prefer the most relevant result based on:
- exact package or framework name
- repository usage
- likely version or ecosystem match

Do not query docs against an unverified or ambiguous library target if better resolution is possible.

### 3. Query the Documentation

After resolving the correct library, query Context7 with a focused question.

Good query patterns:
- exact API usage
- configuration option behavior
- migration guidance for a specific feature
- best-practice usage for a specific integration
- version-sensitive behavior for a specific function or pattern

Avoid broad queries like:
- “tell me about React”
- “how does Fastify work”
- “show Tailwind docs”

### 4. Return Only What Helps the Task

Summarize the documentation findings in a task-relevant way.

Include:
- what was confirmed
- what it means for the current task
- any uncertainty or limitation
- whether further local repository checks are still needed

Do not dump generic docs when only a small answer is relevant.

## Fallback Behavior

If Context7 is unavailable, not configured, or fails:
- state that the Context7 MCP is unavailable
- do not pretend the lookup succeeded
- state that external documentation could not be retrieved through Context7
- note that setup or access needs to be fixed before this skill can be used as intended

If a task artifact or planning note is being produced, record a clear TODO such as:
- `TODO: Configure or restore Context7 MCP access before relying on external library documentation lookup.`

## Output Requirements

When this skill is used, the output should include:

### 1. Documentation Target
State:
- the library or framework being queried
- the documentation question being answered

### 2. Resolution Result
State:
- which library target was selected
- why it appears to be the correct match

### 3. Documentation Findings
Summarize:
- the relevant behavior, API, or configuration confirmed
- any version-sensitive or conditional details that matter

### 4. Task Relevance
State:
- how the documentation affects the current task
- whether it changes research, planning, implementation, or review decisions

### 5. Limitations
State:
- any ambiguity, missing version clarity, or incomplete documentation result
- whether additional local repository evidence is still needed

If Context7 is unavailable, replace the above with:
- the attempted documentation target
- the fact that Context7 was unavailable
- the required TODO or next action

## Query Quality Standard

Prefer:
- exact library names
- exact API or configuration questions
- short, specific documentation requests
- repository-aware framing

Avoid:
- broad educational queries
- generic browsing
- vague “best practices” searches with no task context
- asking Context7 for information already established locally

## Prohibited Behavior

Do not:
- use Context7 when local repository evidence is sufficient
- skip library resolution before querying docs
- pretend MCP is available when it is not
- fabricate documentation findings
- use vague documentation summaries with no task relevance

## Output Style

Be:
- concise
- task-focused
- explicit about what was confirmed
- explicit about limitations

Prefer:
- exact library naming
- exact question framing
- short, actionable doc summaries
- direct impact on the task

Avoid:
- long documentation dumps
- generic tutorial-style explanations
- unsupported certainty

## Handoff

This skill supports other phases of work.

Its output should be usable by:
- `rpi-research` when external docs are needed to confirm behavior
- `rpi-plan` when a plan depends on version-specific library behavior
- implementation or review phases when correctness depends on official library documentation

Use the documentation findings to reduce guesswork, not to replace repository-specific reasoning.
