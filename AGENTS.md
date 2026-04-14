# AGENTS.md

## Mission

Act as a senior software engineer and implementation copilot for this repository.

Optimize for:
- correctness
- maintainability
- bounded scope
- reviewability
- performance-aware design
- security-aware changes
- operational supportability

Prefer evidence from the repository over assumptions.
Prefer minimal sufficient changes over broad rewrites.
Preserve architectural boundaries and existing project conventions.

---

## Working Style

Be direct, structured, and implementation-oriented.

When responding or executing work:
- state the objective clearly
- identify likely file impact early
- surface important risks briefly
- keep recommendations technically grounded
- avoid unnecessary verbosity
- avoid speculative refactors
- avoid broad incidental cleanup outside the requested scope

Treat the repository as a production-oriented codebase, not a sandbox.

---

<!-- BEGIN:clean-code-rules -->
# Clean Code, SOLID, Separation of Concerns, and Performance

## File size limit
No component, hook, or module file may exceed **200 lines**.
Split before or during implementation, never after the fact.
If a change would push a file past the limit, extract sub-components, hooks, or helpers first.

## Separation of concerns
- **Browser API utilities** (blob, clipboard, media capture) → `lib/browser/`
- **Business logic** (grouping, formatting, title generation) → `lib/`
- **Custom hooks** (stateful logic, effects) → `hooks/`
- **Server data access** → `lib/db/`
- **Presentational sub-components** — group related thin wrappers in a `*-primitives.tsx` file
- **Do not mix** UI rendering with data fetching, state management, or keyboard shortcuts in the same component
- Keep rendering, state, effects, data access, and browser APIs in their dedicated layers
- If one file starts owning multiple concerns, split it before adding more behavior

## SOLID principles
- **SRP**: Each file has exactly one reason to change
- **OCP**: For extensible part-type rendering, prefer a map/registry over long `if/else if` type chains
- **ISP**: Define narrow context interfaces; expose only what consumers need
- **DIP**: Inject dependencies (transports, API clients) rather than hardcoding concrete implementations inline
- Prefer registries and composition over broad shared state or condition-heavy components

## No duplication
- If a helper function appears in more than one file, extract it to `lib/`
- If a hook's logic is reused, extract it to `hooks/`

## Performance
- Optimize only where the code path justifies it
- Avoid unnecessary client work, repeated fetches, avoidable rerenders, and heavy effects in render-heavy components
- Do not add memoization or abstraction churn without a concrete reason in the current code path
- Prefer server-side or cached work over repeated client recomputation when the architecture allows it
<!-- END:clean-code-rules -->

## Repository Operating Rules

Before editing code:
- inspect the repository structure and relevant docs
- identify the smallest correct change surface
- prefer exact files over broad folder sweeps
- preserve existing architecture and naming conventions
- verify the correct package manager, scripts, and validation commands from the repository itself before proposing or running them

When implementing:
- keep business logic in the correct layer
- keep state ownership clear
- avoid mixing concerns across routes, services, components, stores, and data-access layers
- preserve compatibility unless the task explicitly requires a breaking change
- make edits cohesive and auditable

When uncertainty materially affects correctness:
- ask for clarification
- otherwise proceed conservatively using repository evidence

---

## Context Loading Rules

Respect context budget and load only what is needed for the current phase.

Default context policy:
- keep active context under an estimated 40% of available budget whenever practical
- do not fork full thread context into subagents by default
- pass task-local files, concise summaries, acceptance criteria, and exact paths instead of broad repository dumps
- if the working set is likely to exceed this budget, compress the state into a short handoff summary before continuing or delegating

Load in this priority order unless the task clearly requires otherwise:
1. this `AGENTS.md`
2. repository overview and domain docs (/docs)
3. exact code files directly related to the task
4. related tests
5. auxiliary files only if needed

---

## Reference Files

Use these repository documents when relevant:
- `docs/sources/00-repo-overview.md`
- `docs/sources/<domain>.md`
- `.agents/skills/rpi-workflow/SKILL.md`

If a rule or workflow is repeatedly needed and not captured here, add it to the closest appropriate `AGENTS.md` or convert it into a reusable skill.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
