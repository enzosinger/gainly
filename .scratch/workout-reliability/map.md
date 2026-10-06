# Make workout navigation reliable and onboarding reproducible

## Destination

Identify the highest-value gaps in Gainly's existing workout flow, implement the first independently verifiable reliability fix, and replace the README with accurate, reproducible onboarding. Leave additional product work as explicit proposals.

## Notes

Use wayfinder, primary-source research, a written spec, vertical tickets, and implementation with independent standards/spec review. Full-autopilot authorization permits conservative decisions within this scope. It does not permit production data changes, merges, deployments, credential creation, or new product commitments.

## Decisions so far

- [Restore sessions for the selected week](issues/01-restore-week-sessions.md): session identity includes routine, week, and routine version; a new week needs its own restoration request
- [Document the app that exists](issues/02-document-onboarding.md): follow Corral's concrete promise, ordered setup, screenshots, and limits while deriving every product claim from Gainly

## Not yet specified

- Whether empty workout fields should erase stored values or retain them; inspect the persistence contract and existing user expectations before implementation
- Whether workout completion should wait for every pending set save and expose retry status

## Out of scope

New training features, an offline sync system, account flows, schema migration, deployment, and the unrelated open unique-ID refactor.

Published proposal/spec: https://github.com/enzosinger/gainly/issues/2
