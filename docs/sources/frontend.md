# Frontend Domain

## Scope

The `gainly` frontend is a React 19 + Vite + TypeScript SPA that serves as the primary interface for managing training routines and workout sessions. It functions as a reactive client for the Convex backend, handling authentication, data visualization, and real-time state synchronization. See also [`docs/sources/architecture.md`](/Users/enzosinger/Desktop/repos/gainly/docs/sources/architecture.md).

## Confirmed Architectural Boundaries

- **Bootstrap**: [`src/main.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/main.tsx) wraps the app with `LanguageProvider`, `ThemeProvider`, and `ConvexAuthProvider`.
- **Root Client**: [`src/lib/convex.ts`](/Users/enzosinger/Desktop/repos/gainly/src/lib/convex.ts) initializes the `ConvexReactClient`.
- **App Gate**: [`src/app/App.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/App.tsx) switches between the landing page and the authenticated app shell.
- **Route Definitions**: Centralized in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx).
- **Layouts**: Shared page chrome and navigation live in [`src/app/layouts/AppShell.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/layouts/AppShell.tsx).
- **Pages**: Route screens live in [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- **Store Integration**: [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx) provides the bridge between Convex backend functions and the React UI.
- **Domain Types**: Shared types live in [`src/types/domain.ts`](/Users/enzosinger/Desktop/repos/gainly/src/types/domain.ts).

## State Management

The frontend uses a hybrid state model:

- **Server State**: Managed via Convex `useQuery` and `useMutation` hooks.
- **Derived/Local State**: Post-processing of server data happens within [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx) to provide a consistent API to components.
- **Persistence**: Managed entirely by Convex; the frontend does not maintain local storage for training data.

## Route Surfaces

- [`src/pages/DashboardPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/DashboardPage.tsx): Weekly progress and upcoming routines. It uses direct Convex hooks for weekly summaries.
- [`src/pages/WorkoutPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/WorkoutPage.tsx): Active session tracking and set-by-set input. It uses direct Convex hooks for the selected routine/session.
- [`src/pages/RoutinesPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/RoutinesPage.tsx): Routine management and exercise selection.
- [`src/pages/RoutineDetailPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/RoutineDetailPage.tsx): Routine detail view for `/routines/:routineId`.
- [`src/pages/ExercisesPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/ExercisesPage.tsx): Exercise library browsing.
- [`src/pages/ProfilePage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/ProfilePage.tsx): User settings and statistics.

## Testing Surface

- Page-level tests live beside the route screens under [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- Component and utility tests live alongside their source files under [`src/components`](/Users/enzosinger/Desktop/repos/gainly/src/components) and [`src/lib`](/Users/enzosinger/Desktop/repos/gainly/src/lib).
- Shared render helpers: [`src/test/test-utils.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/test/test-utils.tsx).

## Constraints

- Use Convex hooks (`useQuery`, `useMutation`) for data access and persistence.
- Keep business logic that requires data integrity or multi-entity updates in the **Backend/Convex** layer.
- Preserve the authenticated shell in [`src/app/App.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/App.tsx) and the route tree in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx).
- Update or add targeted Vitest coverage when page or component behavior changes.
