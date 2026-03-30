# Repository Overview

## Purpose

`gainly` is a frontend-only training app built with React and Vite. The current repository models routines, exercises, and workout flows locally with mocked data and a React context store rather than a backend or persistence layer.

## Stack

- Package manager: `npm` via [`package.json`](/Users/enzosinger/Desktop/repos/gainly/package.json)
- Runtime/build: Vite + React 19 + TypeScript
- Routing: `react-router-dom` browser router in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx)
- Styling: Tailwind CSS plus custom globals in [`src/styles/globals.css`](/Users/enzosinger/Desktop/repos/gainly/src/styles/globals.css)
- Tests: Vitest + Testing Library via [`scripts/run-vitest.mjs`](/Users/enzosinger/Desktop/repos/gainly/scripts/run-vitest.mjs) and files under [`src/**/*.test.tsx`](/Users/enzosinger/Desktop/repos/gainly/src)

## App Entry And Composition

- App bootstrap happens in [`src/main.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/main.tsx), which mounts `App` inside `React.StrictMode`.
- [`src/app/App.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/App.tsx) wraps the router with `GainlyStoreProvider`.
- [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx) defines the main routes:
  - `/` dashboard
  - `/workout/:routineId?`
  - `/routines`
  - `/exercises`
  - `/profile`
- [`src/app/layouts/AppShell.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/layouts/AppShell.tsx) provides the shared shell and navigation.

## State And Data Boundaries

- Local application state lives in [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx).
- The store initializes from mocked fixtures in [`src/data/mockExercises.ts`](/Users/enzosinger/Desktop/repos/gainly/src/data/mockExercises.ts) and [`src/data/mockRoutines.ts`](/Users/enzosinger/Desktop/repos/gainly/src/data/mockRoutines.ts).
- Domain types live in [`src/types/domain.ts`](/Users/enzosinger/Desktop/repos/gainly/src/types/domain.ts).
- There is no repository evidence of backend APIs, persistence, auth, cache infrastructure, or server-side validation in the current codebase.

## UI Structure

- Route-level screens live in [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- Shared app shell and route wiring live in [`src/app`](/Users/enzosinger/Desktop/repos/gainly/src/app).
- UI primitives live in [`src/components/ui`](/Users/enzosinger/Desktop/repos/gainly/src/components/ui).
- More feature-shaped components live under [`src/components/organisms`](/Users/enzosinger/Desktop/repos/gainly/src/components/organisms) and [`src/components/molecules`](/Users/enzosinger/Desktop/repos/gainly/src/components/molecules).

## Validation Commands

Use repository-native commands unless a task requires something narrower:

- `npm test`
- `npm run test:run`
- `npm run build`
- `npx tsc --noEmit`

`npm test` routes through [`scripts/run-vitest.mjs`](/Users/enzosinger/Desktop/repos/gainly/scripts/run-vitest.mjs), which strips `--runInBand` before invoking Vitest.

## Existing Documentation

- Historical planning and design notes currently live under [`docs/superpowers`](/Users/enzosinger/Desktop/repos/gainly/docs/superpowers).
- The RPI workflow source docs for this repo live under [`docs/sources`](/Users/enzosinger/Desktop/repos/gainly/docs/sources).

## Future Direction

- The user has stated that this project is intended to use Convex as a future backend.
- That is future planning context, not current repository architecture evidence.
- Until Convex code, config, schema, or deployment files exist in this repository, treat backend, data, auth, caching, and operational behavior as unimplemented rather than assumed.
