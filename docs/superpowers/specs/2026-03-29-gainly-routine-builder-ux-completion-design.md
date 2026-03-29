# Gainly Routine Builder UX Completion Design

Date: 2026-03-29
Project root: `/Users/enzosinger/Desktop/repos/gainly`
Phase: Frontend-only validation
Status: Approved in brainstorming, written for review

## Goal

Close the most noticeable routine-builder UX gaps that remain after the B2 Monochrome Athletic visual pass so the `/routines` flow feels usable as a planning tool, not just visually coherent.

This pass should improve the routine builder by making the current editing model match user expectations more closely:

- edit one selected routine at a time
- switch between routines explicitly
- find exercises more easily before adding them
- add standard sets without forcing an advanced-technique path
- remove exercises from a routine

## Why This Pass Now

The current B2 UI direction is approved, but the `/routines` page still has product-flow issues that read as UX gaps rather than visual issues:

- only the first routine is editable on the page
- the builder supports adding advanced techniques but not another normal set
- there is no way to remove an exercise from a routine
- exercise picking becomes increasingly noisy as the exercise list grows

This work should happen before any additional cosmetic polish because the builder is currently missing expected planning actions in one of the app's core flows.

## Scope

Included:

- keep `/routines` as a single selected routine editor
- add an explicit routine switcher within `RoutinesPage`
- add exercise search and muscle-group filtering inside the picker
- add a normal-set action to routine exercise cards
- add exercise removal from the selected routine
- remove low-value instructional copy that does not help the user act
- preserve the current local store and mocked-data architecture

Excluded:

- route-driven routine selection
- backend or persistence work
- broad routine-model redesign
- drag-and-drop editing inside the routine builder
- technique-specific configuration editors beyond the current baseline behavior
- dark mode or another visual redesign pass

## Product Direction

The routine builder remains the at-home planning flow.

It should feel deliberate, low-friction, and mobile-first:

- the common path should be obvious
- normal sets should be easier to add than advanced variants
- switching routines should be explicit and lightweight
- finding exercises should not require scanning the full list every time

This pass keeps the approved B2 visual language, but prioritizes interaction clarity over additional stylistic refinement.

## Path Decision

The page should use **local selected-routine state inside `RoutinesPage`** rather than adding route params like `/routines/:routineId`.

Reasoning:

- it matches the current frontend-only validation phase
- it avoids route churn for a focused UX pass
- it keeps the work centered on builder usability instead of navigation architecture
- it remains easy to upgrade later if deep-linking becomes important

The selected routine should default to the first available routine and fall back safely if the current selection disappears.

## Routine Selection Design

`RoutinesPage` should present one routine editor at a time with a routine switcher near the page header.

Requirements:

- the switcher uses the existing local `Select` primitive
- the options show all current routines
- changing the switcher updates the page header, exercise picker, and routine exercise list immediately
- if no routine exists, the existing empty-state behavior remains

The page should not attempt to show all routines expanded at once. The selected-routine model is simpler, clearer on mobile, and better aligned with focused planning.

## Exercise Picker Design

`ExercisePicker` should keep inline exercise creation, but the add flow must become easier to scan and narrow.

The picker should include:

- a search input for exercise name
- a muscle-group filter with a default `All muscle groups` option
- a filtered results list that updates immediately as the user types or changes the filter

Behavior:

- search is case-insensitive
- search matches against exercise name only
- the muscle-group filter is optional and defaults to showing all exercises
- both filters can be used together
- if no exercises match, show a small empty state inside the picker instead of a blank list

Layout expectations:

- on mobile, search and muscle-group filter stack cleanly
- on larger screens, they may sit side by side if the current layout allows it without crowding

## Routine Exercise Editing Design

Each routine exercise card should support the common planning actions directly.

Required actions:

- `Add set` appends a new normal set to that exercise
- `Add technique` remains available for back-off, cluster, and super set additions
- `Remove exercise` removes the exercise from the selected routine

Interaction rules:

- normal sets remain the default editing path
- advanced techniques remain explicit opt-in actions
- removing an exercise should be immediate and local to the selected routine
- if the last exercise is removed, the routine should fall back to the existing empty-state treatment

This pass does not require editing set values inline. It only closes the gap around structure editing.

## Copy Changes

The sentence:

`Start with normal sets, then add advanced work only when needed.`

should be removed from the routine exercise card.

Reasoning:

- it does not help the user make a decision
- the available actions already communicate the editing model
- it consumes space in a high-density planning area without adding signal

Replacement copy is not required unless a component would otherwise become visually unbalanced.

## Data And State Changes

The local store should gain small, focused actions rather than a broader refactor.

Add:

- an action to append a normal set to a routine exercise
- an action to remove an exercise from a routine

The existing `addTechniqueToRoutineExercise` action should remain intact.

The routine switcher state should live in `RoutinesPage`, not in the global store, because it is page-local presentation state rather than shared application state.

## Components Affected

Primary files expected to change:

- `src/pages/RoutinesPage.tsx`
- `src/components/organisms/routine-builder/ExercisePicker.tsx`
- `src/components/organisms/routine-builder/RoutineExerciseEditor.tsx`
- `src/state/gainly-store.tsx`
- `src/pages/RoutinesPage.test.tsx`

Possible small shared-style touchpoints:

- `src/components/ui/select.tsx`
- `src/components/ui/input.tsx`

Only make shared primitive changes if the builder pass reveals a real need. Do not reopen the broader B2 visual system.

## Mobile-First Expectations

This pass should preserve the project's original mobile-first intent.

That means:

- the routine switcher should be easy to use on narrow screens
- the filter controls should not create cramped horizontal layouts on mobile
- exercise actions should remain legible and tappable
- the page should still feel focused rather than overloaded, even after adding the missing controls

Desktop can expand spacing or align controls into rows, but mobile readability is the primary constraint.

## Risks

### 1. Control Creep In Exercise Cards

Adding `Add set`, `Add technique`, and `Remove exercise` could make each card feel busy.

Mitigation:

- make `Add set` the primary lightweight action
- keep `Add technique` secondary
- style `Remove exercise` as a restrained destructive action without introducing a heavy alert palette

### 2. Filter UI Becoming More Complex Than The List

If the filter area is too heavy, it could outweigh the value of the picker itself.

Mitigation:

- keep filtering limited to search plus one muscle-group select
- avoid adding sort controls or extra metadata filters in this pass

### 3. Selection Drift After Mutations

Routine selection and local edits could become inconsistent if the selected routine reference is not refreshed correctly after updates.

Mitigation:

- store only the selected routine id locally
- derive the active routine from current store data each render
- fall back to the first routine if the selected id no longer exists

## Testing Strategy

The routine-builder tests should validate behavior, not cosmetics.

Required coverage:

- switching between routines updates the visible editor content
- searching exercises narrows the add list
- filtering by muscle group narrows the add list
- combined search plus muscle-group filter works correctly
- adding a normal set appends another `normal` set
- removing an exercise removes it from the selected routine only
- advanced-technique addition still works after the builder changes

Existing no-`unilateral` expectations should remain intact.

## Success Criteria

This pass is successful if:

- the user can switch between all routines from `/routines`
- the exercise picker is easier to use once the library grows
- the builder supports normal-set expansion without forcing advanced-technique actions
- an exercise can be removed cleanly from a routine
- the page still feels aligned with the approved B2 UI direction and mobile-first constraints
