# Reliable workout week navigation and documented onboarding

## Problem statement

After opening a routine, changing to another week can leave Gainly displaying its restoration message indefinitely. The session synchronization guard treats every week of a routine as the same request. A rejected request for an earlier selection can also reset the guard or show an error for a newer selection.

The README repeats broad feature lists but leaves out required authentication setup and uses ambiguous wording about the exercise catalog.

## Solution

Restore or synchronize the selected routine's session for each selected week. Keep request deduplication for unchanged routine/week/version selections. Ignore rejected restoration requests after the user changes selection. Give new contributors an ordered setup guide that accurately describes Gainly's current product and constraints.

## User stories

1. As a lifter, I can open the previous week of a routine and reach that week's workout
2. As a lifter, I can move back to the current week and see the current session
3. As a lifter, I can use browser Back and Forward without leaving the displayed week and restored session out of sync
4. As a lifter, I do not see a restoration error from a week I have already left
5. As a lifter, I can retry a failed week by navigating away and returning
6. As a lifter, repeated reactive updates for the same routine version do not trigger duplicate restoration requests
7. As a contributor, I can install the locked dependencies and understand which Convex configuration is needed
8. As a new user, I know the exercise library belongs to my account and can create my first routine
9. As a contributor, I can run the documented checks and see which checks do not constitute real-service end-to-end validation
10. As a Portuguese reader, I retain access to an accurate Portuguese introduction and setup guidance

## Implementation decisions

- Preserve the current backend contract, week calculation, routes, and visual design
- Treat restoration identity as the selected routine, selected week start, and routine update version
- A rejected request may update the current error/guard only while it still belongs to the active effect
- Keep synchronization state in a dedicated hook if the page would exceed the repository's 200-line limit
- Keep documentation and the product fix separately reviewable
- Preserve existing artwork and bilingual support; do not copy Corral's orchestration, durability, release, or test claims

## Testing decisions

Prefer the complete running app with a disposable Convex deployment. This checkout has no deployment configuration or credentials, and the available cloud browser cannot execute local browser flows. Do not connect to an unknown production service or bypass runtime restrictions.

Use the existing page interaction seam with the Convex hook boundary replaced by a deterministic fake. Exercise real routing, page rendering, week controls, loading state, and asynchronous restoration failures. Assert the selected week and visible workout or error, with exact mutation arguments as additional evidence. Cover previous/next, Back/Forward, rapid navigation with delayed failure, repeated updates, and routine version changes. Run the existing full suite and production build. Report this as page integration coverage, not browser or real-backend E2E.

Check README links, commands, tracked artwork, and claims against repository and official Convex sources.

## Out of scope

Offline support, retries after arbitrary browser closure, changing workout completion/save semantics, changing historical session rules, data migration, dependency upgrades, a new backend, merges, and deployment.

## Further notes

The source baseline is 2db6fd4a7f46003a1c79655023ec160b2fbdb77c. The existing open unique-ID refactor is unrelated and must remain untouched. GitHub upstream permission is read-only; use the existing contributor fork for draft pull requests.
