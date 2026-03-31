# Repository Overview

## Purpose

`gainly` is a full-stack training app built with React, Vite, and Convex. It enables users to plan and execute workout routines with real-time persistence and multi-device synchronization.

## Stack

- **Backend/Data**: [Convex](https://www.convex.dev/) via [`convex/`](/Users/enzosinger/Desktop/repos/gainly/convex)
- **Authentication**: [`@convex-dev/auth`](https://labs.convex.dev/auth) setup in [`convex/auth.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/auth.ts)
- **Frontend**: Vite + React 19 + TypeScript
- **Routing**: `react-router-dom` browser router in [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx)
- **Styling**: Tailwind CSS plus custom globals in [`src/styles/globals.css`](/Users/enzosinger/Desktop/repos/gainly/src/styles/globals.css)
- **Icons**: `lucide-react`
- **Tests**: Vitest + Testing Library via [`scripts/run-vitest.mjs`](/Users/enzosinger/Desktop/repos/gainly/scripts/run-vitest.mjs)

## App Entry And Composition

- App bootstrap happens in [`src/main.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/main.tsx), which wraps the application with `ConvexAuthProvider`.
- [`src/app/App.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/App.tsx) handles authentication states and provides the `ConvexGainlyStoreProvider`.
- [`src/app/router.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/router.tsx) defines the main routes:
  - `/` dashboard
  - `/workout/:routineId?`
  - `/routines`
  - `/exercises`
  - `/profile`
- [`src/app/layouts/AppShell.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/app/layouts/AppShell.tsx) provides the shared shell and navigation.

## State And Data Boundaries

- **Server-side state** is managed by Convex (queries and mutations).
- **Client-side state** and cache management is centralized in [`src/state/gainly-store.tsx`](/Users/enzosinger/Desktop/repos/gainly/src/state/gainly-store.tsx), which bridges Convex server functions to the UI.
- Domain types live in [`src/types/domain.ts`](/Users/enzosinger/Desktop/repos/gainly/src/types/domain.ts) and are reflected in [`convex/schema.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/schema.ts).

## UI Structure

- Route-level screens live in [`src/pages`](/Users/enzosinger/Desktop/repos/gainly/src/pages).
- Shared app shell and route wiring live in [`src/app`](/Users/enzosinger/Desktop/repos/gainly/src/app).
- UI primitives live in [`src/components/ui`](/Users/enzosinger/Desktop/repos/gainly/src/components/ui).
- Feature components live under [`src/components/organisms`](/Users/enzosinger/Desktop/repos/gainly/src/components/organisms) and [`src/components/molecules`](/Users/enzosinger/Desktop/repos/gainly/src/components/molecules).

## Validation Commands

Use repository-native commands:

- `npm test`
- `npm run test:run`
- `npm run build`
- `npx tsc --noEmit`
- `npx convex dev` (starts the local backend and client codegen)

## Existing Documentation

- Historical notes: [`docs/superpowers`](/Users/enzosinger/Desktop/repos/gainly/docs/superpowers).
- RPI source docs: [`docs/sources`](/Users/enzosinger/Desktop/repos/gainly/docs/sources).
  - [frontend.md](file:///Users/enzosinger/Desktop/repos/gainly/docs/sources/frontend.md)
  - [backend.md](file:///Users/enzosinger/Desktop/repos/gainly/docs/sources/backend.md)
