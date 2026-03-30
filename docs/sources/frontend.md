# Frontend Domain

## Scope

This repository’s primary product surface is a client-rendered React application for planning and viewing training routines. The frontend domain includes route composition, page-level UI flows, the local store, mocked domain data, and the Tailwind-based design system components used to render those flows.

## Confirmed Architectural Boundaries

- Route definitions are centralized in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx).
- Shared page chrome and navigation live in [`src/app/layouts/AppShell.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/layouts/AppShell.tsx).
- Route screens live in [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- App-wide state is provided by [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx).
- Static domain fixtures live in [`src/data`](/Users/enzosinger/Desktop/repos/gainly/src/data).
- Shared domain types live in [`src/types/domain.ts`](/Users/enzosinger/Desktop/repos/gainly/src/types/domain.ts).

## Current State Model

[`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx) owns:

- the `exercises` list
- the `routines` list
- `expandedExerciseId`
- routine reordering
- exercise creation
- adding exercises to routines
- appending sets and techniques to routine exercises
- removing exercises from routines

The store uses React state plus `useMemo` and is the current source of truth for user-editable workout data inside the frontend.

## Route Surfaces

- [`src/pages/DashboardPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/DashboardPage.tsx) renders the weekly overview.
- [`src/pages/WorkoutPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/WorkoutPage.tsx) handles the workout flow.
- [`src/pages/RoutinesPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/RoutinesPage.tsx) handles routine editing with `ExercisePicker` and `RoutineExerciseEditor`.
- [`src/pages/ExercisesPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/ExercisesPage.tsx) covers exercise browsing.
- [`src/pages/ProfilePage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/ProfilePage.tsx) covers the profile surface.

## Testing Surface

- Page-level tests exist beside the route screens in [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- App-level router coverage exists in [`src/app/App.test.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/App.test.tsx).
- Shared render helpers live in [`src/test/test-utils.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/test/test-utils.tsx).

## Constraints For Future Work

- Preserve the existing frontend-only architecture unless repository evidence or the task explicitly requires backend or persistence additions.
- Keep route concerns in page and router files rather than pushing them into generic UI primitives.
- Keep domain mutations in the store instead of distributing them across unrelated components.
- Update or add targeted Vitest/Testing Library coverage when page or store behavior changes.
- Treat `docs/superpowers` as historical implementation context, not as an authoritative replacement for current code evidence.
- When planning future backend work, the user has indicated Convex is the intended backend direction, but that should be treated as roadmap context until Convex files and runtime paths are present in the repository.
