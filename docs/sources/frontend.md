# Frontend Domain

## Scope

The `gainly` frontend is a React-based SPA that serves as the primary interface for managing training routines and workout sessions. It functions as a reactive client for the Convex backend, handling authentication, data visualization, and real-time state synchronization.

## Confirmed Architectural Boundaries

- **Root Client**: [`src/lib/convex.ts`](/Users/enzosinger/Desktop/repos/gainly/src/lib/convex.ts) initializes the `ConvexReactClient`.
- **Route Definitions**: Centralized in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx).
- **Layouts**: Shared page chrome and navigation live in [`src/app/layouts/AppShell.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/layouts/AppShell.tsx).
- **Pages**: Route screens live in [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- **Store Integration**: [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx) provides the bridge between Convex backend functions and the React UI.
- **Domain Types**: Shared types live in [`src/types/domain.ts`](/Users/enzosinger/Desktop/repos/gainly/src/types/domain.ts).

## State Management

The frontend uses a hybrid state model:

- **Server State**: Managed via Convex `useQuery` and `useMutation` hooks.
- **Derived/Local State**: Post-processing of server data (e.g., filtering, sorting) happens within [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx) to provide a consistent API to components.
- **Persistence**: Managed entirely by Convex; the frontend does not maintain local storage for training data.

## Route Surfaces

- [`src/pages/DashboardPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/DashboardPage.tsx): Weekly progress and upcoming routines.
- [`src/pages/WorkoutPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/WorkoutPage.tsx): Active session tracking and set-by-set input.
- [`src/pages/RoutinesPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/RoutinesPage.tsx): Routine management and exercise selection.
- [`src/pages/ExercisesPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/ExercisesPage.tsx): Exercise library browsing.
- [`src/pages/ProfilePage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/ProfilePage.tsx): User settings and statistics.

## Testing Surface

- Page-level tests: [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- Store/Logic tests: [`src/state/gainly-store.test.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.test.tsx).
- Shared render helpers: [`src/test/test-utils.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/test/test-utils.tsx).

## Constraints

- Use Convex hooks (`useQuery`, `useMutation`) for all data access and persistence.
- Keep business logic that requires data integrity or multi-entity updates in the **Backend/Convex** layer.
- Ensure UI responsiveness by using optimistic updates where appropriate.
- Update or add targeted Vitest coverage when page or store behavior changes.
