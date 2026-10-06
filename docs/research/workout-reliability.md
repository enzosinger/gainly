# Workout week restoration research

Source baseline: [2db6fd4](https://github.com/enzosinger/gainly/tree/2db6fd4a7f46003a1c79655023ec160b2fbdb77c). Research date: 2026-10-06.

## Decision

Restore a workout using its routine, selected week, and routine update version. Keep the existing backend and session model. First repair navigation and its asynchronous failure handling, rather than add new training features.

## Evidence

- The [session query and creation mutation](https://github.com/enzosinger/gainly/blob/2db6fd4a7f46003a1c79655023ec160b2fbdb77c/convex/workouts.ts) use the `by_user_routine_weekStart` index and accept `weekStart`
- The [workout page](https://github.com/enzosinger/gainly/blob/2db6fd4a7f46003a1c79655023ec160b2fbdb77c/src/pages/WorkoutPage.tsx) uses routine ID and update time to suppress repeated restoration requests, omitting the selected week
- Its restoring screen remains visible while the selected week's session is absent
- Page interaction regressions reproduced the missing previous-week restoration request and the persistence of an old restoration error after navigation
- Independent review identified another case: a request rejected after navigating to a still-loading week must not remain cached and be reused when the user returns

## Verification seam

The regression uses the actual workout page, week controls, session inputs, React StrictMode, and in-memory router history. Only the Convex query/mutation boundary is replaced. Mutation dispatch checks the actual registered function name. Assertions cover rendered week/session values as well as request identity and count.

Run the focused check with:

```sh
NODE_OPTIONS=--no-experimental-webstorage pnpm test:run src/pages/WorkoutPage.navigation.test.tsx --maxWorkers=1
```

Run the full suite with `pnpm test:run` and the production build with `pnpm build`. The Node flag above is needed when Node's experimental Web Storage conflicts with jsdom.

These checks are page integration evidence. They do not prove authentication or remote persistence against a live Convex deployment. A configured disposable development deployment and a working browser runtime are required for that final acceptance check.

## Adjacent findings

- The npm lockfile omits the declared Radix switch dependency, so `npm ci` fails on the baseline. A frozen install using the existing pnpm lockfile succeeds without changing dependency versions
- The README calls the library shared, while [exercise queries](https://github.com/enzosinger/gainly/blob/2db6fd4a7f46003a1c79655023ec160b2fbdb77c/convex/exercises.ts) filter by the authenticated user
- The [set editor](https://github.com/enzosinger/gainly/blob/2db6fd4a7f46003a1c79655023ec160b2fbdb77c/src/components/molecules/SetRow.tsx) falls back to stored numbers when a draft field is empty. Clearing values and completing while saves are pending need a separate persistence-focused investigation

## Follow-on proposals

Choose one package-manager lockfile and establish a clean-install/test/build CI check. Separately specify set-edit persistence and completion behavior with real-service acceptance tests. Do not silently fold dependency updates, offline storage, historical data changes, or account recovery into this navigation fix.
