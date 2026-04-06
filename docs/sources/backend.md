# Backend Domain (Convex)

## Architecture

The `gainly` backend is built on [Convex](https://www.convex.dev/), a serverless platform that provides a reactive database, cloud functions, and authentication. The backend owns persistence, business logic enforcement, and secure access control. See also [`docs/sources/architecture.md`](/Users/enzosinger/Desktop/repos/gainly/docs/sources/architecture.md).

## Key Components

- **Schema**: [`convex/schema.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/schema.ts) defines the database tables, indices, and relationships.
- **Authentication**: Powered by [`@convex-dev/auth`](https://labs.convex.dev/auth), integrated in [`convex/auth.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/auth.ts).
- **API Functions**: Located in `convex/*.ts`, consumed through the generated `api` module in [`convex/_generated/api.d.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/_generated/api.d.ts).
- **Validation**: Centralized validators in [`convex/validators.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/validators.ts).

## Data Model

The current schema uses normalized routine and session tables plus derived summaries:

- `users` from `@convex-dev/auth`.
- `exercises` for the user exercise library.
- `routines` for routine metadata and ordering.
- `routineExercises` and `routineExerciseSets` for the normalized routine structure.
- `workoutSessions`, `workoutSessionExercises`, and `workoutSessionSets` for workout execution state.
- `routineWeekSummaries` and `routineProgressSummaries` for derived dashboard/history data.
- `authRateLimits` for authentication throttling and password sign-up/session markers.

## Authentication

- [`convex/auth.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/auth.ts) implements the Convex Auth password flow.
- Password sign-in and sign-up are rate limited per normalized email address.
- Sign-up creates or updates the `users` row, and login attempts are throttled before session creation.
- [`convex/auth.config.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/auth.config.ts) wires the auth provider expected by Convex.

## Starter Data

[`convex/app.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/app.ts) seeds starter exercises and routines for a new authenticated user when no routines exist yet.

## Constraints

- **Authorization**: Functions should verify identity with `ctx.auth.getUserIdentity()` or the `@convex-dev/auth` helpers, and ownership checks should stay server-side.
- **Validation**: Function arguments should be validated with `v.*` or project-specific validators from `validators.ts`.
- **Integrity**: Multi-table writes belong in a single Convex mutation when atomicity matters.
- **Structure**: Prefer normalized child tables over nested arrays for growing routine and session data.
