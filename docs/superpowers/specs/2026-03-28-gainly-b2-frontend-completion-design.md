# Gainly B2 Frontend Completion Design

Date: 2026-03-28
Project root: `/Users/enzosinger/Desktop/repos/gainly`
Phase: Frontend-only validation
Status: Approved in brainstorming, written for review

## Goal

Complete the in-progress `B2 Monochrome Athletic` frontend direction using the current local UI layer, bringing the app to a visually consistent and implementation-ready state without migrating to official `shadcn/ui` yet.

This pass is about coherence rather than expansion. The main outcome should be a frontend that feels like one deliberate product across:

- dashboard
- workout logger
- routine builder
- exercise library
- profile

## Path Decision

The current codebase should **keep the local shadcn-like UI layer** in `src/components/ui/*` for this pass.

Reasoning:

- the current bottleneck is visual consistency, not missing official `shadcn/ui` infrastructure
- the app is already partially refactored around local primitives
- migrating now would add setup churn and broad file changes without solving the main design problems
- the current frontend validation phase benefits more from speed and cohesion than from standardizing on the official library immediately

Re-evaluating an official `shadcn/ui` migration is reasonable later, after the B2 system is visually stable and the next phase of product work is clearer.

## Scope

Included:

- keep the current route structure and local state approach
- finish the B2 shell and shared surface language
- unify monochrome hierarchy across all current pages
- reduce ad hoc page-level styling in favor of shared tokens and primitives
- prepare the styling system so a future dark mode can be added cleanly
- remove remaining runtime-facing or product-facing `unilateral` assumptions from the active frontend experience
- update stale design documentation that now conflicts with B2 where needed

Excluded:

- official `shadcn/ui` installation or generated components
- backend or persistence work
- auth or database integration
- new product areas beyond the existing pages and flows
- a dark mode toggle or full dark mode visual pass
- a broad architectural refactor of store or routing

## Product Direction

The app should feel like disciplined training hardware: sharp, quiet, structured, and useful.

The selected B2 direction is:

- shadcn/ui-driven feel
- monochrome base
- no gradients
- full-height left sidebar on desktop
- restrained visual hierarchy powered by borders and spacing more than decoration
- semantic feedback colors deferred to a later pass
- no `unilateral` concept in the active product model or user-facing UI

The tone should move away from premium-marketing language and toward a cleaner operational training tool.

## Core Design Principles

### 1. Consistency Over Expansion

This pass should improve the app by making existing screens feel related, not by adding new feature scope.

If a change does not help the shell, the visual system, or the consistency of the five existing pages, it is likely out of scope.

### 2. Monochrome Hierarchy

The UI should communicate importance through:

- spatial rhythm
- panel layering
- border treatment
- typography weight
- selective use of dark emphasis

It should not depend on gradients, decorative backgrounds, or strong accent colors.

### 3. Shared Primitives First

When page code needs a common treatment, that treatment should live in semantic tokens or the local UI layer instead of becoming another one-off utility cluster.

The local UI layer is intentionally modest, but it should become more internally consistent during this pass.

### 4. Dark Mode Preparedness Without Dark Mode Delivery

The current redesign should remain light-theme only.

However, it should prepare for a later dark mode by:

- moving more colors behind semantic CSS variables
- reducing direct `zinc-*` hardcoding in page and component code
- keeping surface and text roles distinct enough to remap later

This pass should not add:

- theme switching
- dark-specific visual tuning
- dual-theme complexity in component behavior

## Visual System

### Shell

`src/app/layouts/AppShell.tsx` should define the canonical B2 frame.

Desktop expectations:

- full-height left sidebar remains the anchor
- sidebar should feel architectural rather than card-like
- active and inactive navigation states should be clearer and more deliberate
- the main content canvas should feel calm and spacious beside the rail

Mobile expectations:

- keep the current bottom navigation pattern for now
- bring its shape language and typography closer to the desktop shell
- reduce any feeling that desktop and mobile belong to different systems

### Surface Layers

The frontend should standardize on a small semantic surface stack:

- app background
- primary panel
- secondary inset panel
- border
- muted text
- strong foreground

Shadows should remain restrained. Borders and contrast steps should do most of the work.

### Typography

Typography should stay assertive but less promotional.

Rules:

- eyebrow labels remain small, uppercase, and high tracking
- page titles remain bold and compact
- supporting copy should become more direct and less ornamental
- repeated metadata should use consistent small-text treatments

### Spacing

Page spacing should follow one rhythm across headers, section stacks, cards, and subpanels.

The redesign should reduce visible cases where one page uses shared primitives while another uses custom spacing and older utility patterns.

## Shared Component System

### Tokens

`src/styles/globals.css` should become the main source of semantic design tokens for the B2 pass.

It should define and consistently use variables for:

- background
- foreground
- panel
- panel inset
- border
- muted text
- strong accent emphasis within monochrome
- focus ring

These names do not need to match official `shadcn/ui`, but they should be semantic enough that later remapping is straightforward.

### Local Primitives

The current local primitives should remain in place:

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/input.tsx`

They should be refined to consume the shared token logic more consistently.

If the redesign reveals a repeated missing control, a small additional local primitive is acceptable. The likely candidate is a select-like form control so forms do not mix polished primitives with raw styled native elements.

### Page-Level Styling Reduction

Pages and organisms should rely less on direct color utilities for surfaces and text where a semantic class or primitive can express the same intent.

This does not require removing all utility classes. It does require reducing cases where visual meaning is only encoded through hardcoded `zinc-*` strings in page markup.

## Page Application

### Dashboard

The dashboard should be the clearest expression of B2.

It should establish:

- the core header rhythm
- the sidebar-to-canvas relationship
- the monochrome panel hierarchy
- the app's operational tone

Routine cards and the week strip should feel part of the same system, not adjacent components with separate visual rules.

### Workout Logger

The workout logger should prioritize focus and compactness.

Accordion panels, previous-performance text, set rows, and technique indicators should feel operational rather than decorative. The expanded state should read clearly without relying on color.

### Routine Builder

The routine builder should feel deliberate and tool-like.

Exercise creation, exercise picking, and technique addition should share the same surface grammar as the rest of the app. Mixed styling between local primitives and custom controls should be reduced.

### Exercise Library

The exercise library should align visually with the routine builder. Metadata display should be consistent with the app-wide badge and supporting-text system.

### Profile

The profile page should stop depending on page-local card styling when the same outcome can be expressed by the shared panel system. It should feel like another screen in the same app, not a separately styled summary page.

## `unilateral` Removal

`unilateral` should no longer make sense in the active frontend product.

This pass should ensure:

- no runtime domain model depends on it
- no user-facing UI presents it
- no active frontend flows assume it
- no current tests expect it to appear in the UI

Historical documents may still contain it until they are updated, but the active product direction and current implementation should not.

## Architecture

This pass should keep the current frontend architecture intact:

- React
- Vite
- Tailwind CSS
- local UI layer in `src/components/ui/*`
- local store in `src/state/gainly-store.tsx`

The store and route structure are not the main problem to solve here. The work is primarily about presentation-system cleanup and consistency.

## Risks

Primary risks:

- only partially moving styles to semantic tokens, leaving the app split between system-driven and ad hoc styling
- improving one page more than the others, which would preserve the current inconsistent feel
- overbuilding the local UI layer beyond what the current frontend validation phase needs
- accidentally reintroducing product assumptions from the older `A1` direction or from `unilateral`-era copy

## Verification

This pass should be considered successful when:

- the five current pages feel visually related and intentionally designed together
- the shell and navigation clearly express the B2 direction
- local primitives provide a more consistent visual foundation
- runtime-facing `unilateral` references are absent from the frontend
- the app remains green on the current verification commands

Verification commands:

- `npm test -- --runInBand`
- `npm run build`

Additional validation:

- manual consistency sweep across dashboard, workout logger, routine builder, exercise library, and profile
- targeted search for `unilateral` in active app code and tests

## Implementation Notes

Expected implementation emphasis:

1. semantic token cleanup in `src/styles/globals.css`
2. shell refinement in `src/app/layouts/AppShell.tsx`
3. local primitive refinement in `src/components/ui/*`
4. consistency pass through dashboard, workout, routines, exercises, and profile
5. cleanup of remaining active `unilateral` references where relevant

The goal is a cleaner, more future-friendly B2 frontend without pausing to standardize on official `shadcn/ui` yet.
