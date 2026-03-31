# Backend Domain (Convex)

## Architecture

The `gainly` backend is built on [Convex](https://www.convex.dev/), a serverless platform that provides a reactive database, cloud functions, and authentication. The backend is responsible for data persistence, business logic enforcement, and secure access control.

## Key Components

- **Schema**: [`convex/schema.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/schema.ts) defines the database tables, indices, and relationships.
- **Authentication**: Powered by [`@convex-dev/auth`](https://labs.convex.dev/auth), integrated in [`convex/auth.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/auth.ts).
- **API Functions**: Located in `convex/*.ts`, exposed via the `api` object generated in `convex/_generated/api.ts`.
- **Validation**: Centralized Zod-like validators in [`convex/validators.ts`](/Users/enzosinger/Desktop/repos/gainly/convex/validators.ts).

## Data Model

| Table | Description | Key Indices |
| :--- | :--- | :--- |
| `users` | User profiles (provided by `@convex-dev/auth`). | |
| `exercises` | Custom user exercises library. | `by_user`, `by_user_name` |
| `routines` | Pre-defined workout templates. | `by_user`, `by_user_position` |
| `workoutSessions` | Historical or active workout instances. | `by_user_status_completedAt` |

## API Function Map

### Exercises (`convex/exercises.ts`)
- `list`: Retrieve all exercises for the authenticated user.
- `create`: Add a new exercise to the user's library.
- `remove`: Delete an exercise.

### Routines (`convex/routines.ts`)
- `list`: Retrieve user routines ordered by position.
- `create` / `update` / `remove`: CRUD operations for routines.
- `reorder`: Update routine positional ordering.

### Workouts (`convex/workouts.ts`)
- `start`: Initialize a new workout session from a routine.
- `update`: Record set data or exercise progress.
- `complete`: Finalize a workout session.
- `getHistory`: Retrieve past workout sessions.

## Constraints

- **Authorization**: Every function **MUST** verify the user's identity using `ctx.auth.getUserIdentity()` or the `@convex-dev/auth` helpers.
- **Validation**: All function arguments **MUST** be validated using `v.*` (Convex values) or project-specific validators from `validators.ts`.
- **Integrity**: Multi-table updates (e.g., updating a routine and its exercises) must be performed within a single Convex mutation to ensure atomicity.
