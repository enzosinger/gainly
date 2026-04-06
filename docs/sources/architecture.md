# Architecture

## At A Glance

`gainly` is a React 19 + Vite + TypeScript app backed by Convex. The frontend owns presentation, routing, and client-side composition; Convex owns persistence, auth, and workflow state.

## Frontend

- App bootstrap lives in [`src/main.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/main.tsx), which wraps the app with `LanguageProvider`, `ThemeProvider`, and `ConvexAuthProvider`.
- The authenticated app shell is in [`src/app/App.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/App.tsx).
- Route definitions live in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx) and are rendered through [`src/app/layouts/AppShell.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/layouts/AppShell.tsx).
- App-level Convex state is bridged through [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx).
- Route pages such as [`src/pages/DashboardPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/DashboardPage.tsx) and [`src/pages/WorkoutPage.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/pages/WorkoutPage.tsx) also use direct Convex hooks for page-specific reads and writes.

## Backend

- The Convex schema lives in [`convex/schema.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/schema.ts).
- Routine and workout data are normalized into separate routine, exercise, and session tables rather than nested documents.
- Derived weekly and progress summary tables are maintained separately for dashboard and history views.
- Authentication is configured in [`convex/auth.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/auth.ts) with Convex Auth password flow and rate limiting.
- Starter content is seeded from [`convex/app.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/app.ts).

## Repository Shape

- [`src/app`](/Users/enzosinger/Desktop/repos/gainly/src/app) contains app shell and router wiring.
- [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages) contains route-level screens.
- [`src/components`](/Users/enzosinger/Desktop/repos/gainly/src/components) contains shared UI and feature composition.
- [`convex`](/Users/enzosinger/Desktop/repos/gainly/convex) contains schema, auth, data access, and workflow functions.

## Operating Rule

Keep business logic in Convex when it depends on persistence, ownership, or atomic updates. Keep UI-specific composition in the frontend, and prefer page-local Convex hooks when a screen needs its own live data.
