# Gainly Frontend Validation Design

Date: 2026-03-27
Project root: `/Users/enzosinger/Desktop/repos/gainly`
Phase: Frontend-only validation
Status: Approved in brainstorming, written for review

## Goal

Validate the visual direction, information architecture, and core user flows for Gainly before implementing backend, auth, or persistence.

This phase is specifically about proving that the product feels better suited to the user's training workflow than existing apps, especially in:

- weekly routine visibility
- fast workout logging
- at-home routine planning
- support for advanced set techniques

## Product Direction

Gainly is a mobile-first gym logging app with a premium analytical visual style.

The selected direction is:

- visual style: `A1` Premium Command Center
- dashboard density: compact weekly overview with all routines visible at once
- status feedback: primarily icon-based instead of text-heavy labels
- workout logging: hybrid layout where all exercises remain visible but only one expands at a time
- routine creation: optimized for at-home planning, with equal emphasis on speed and advanced-technique control

The product should feel premium, polished, and performance-oriented without becoming visually noisy or too data-heavy on mobile.

## Scope For This Phase

Included:

- frontend only
- mocked data
- local UI state
- polished mobile-first screens
- responsive desktop layout
- reusable component system
- advanced-technique UX for back-off sets, cluster sets, and supersets

Excluded:

- Convex integration
- authentication
- database persistence
- production analytics logic
- real user data

## Core User Flows

### 1. Weekly Dashboard

The dashboard is the root page and represents the current week, Monday through Sunday.

It should:

- show all routines for the week at once
- allow switching to previous or future weeks
- support reordering routines within the week
- show visually whether each routine has been completed that week
- use iconography and visual state more than text labels for completion
- surface lightweight comparison feedback versus the previous workout when useful

The mobile experience should prioritize scanability and quick recognition. The user should be able to open the app and instantly understand what was done, what is left, and what likely comes next.

### 2. Workout Logging

Workout logging is the in-gym flow and should minimize friction.

The chosen interaction model is:

- all exercises in the routine are visible on the screen
- only one exercise is expanded at a time
- previous workout values are prefilled by default when available
- normal sets are the default behavior
- advanced techniques are explicit opt-in actions

The expanded exercise should make set entry quick and clear while still allowing access to advanced structures.

### 3. Routine Builder

Routine building is the at-home planning flow and can support a more deliberate editing experience.

The user should be able to:

- name the routine
- add exercises one by one
- choose existing exercises
- create a missing exercise inline if needed
- assign body part
- mark the exercise as unilateral or bilateral
- define normal sets by default
- optionally add advanced techniques intentionally

This flow should support both routine speed and advanced control because the user is expected to configure routines outside the gym.

### 4. Exercise Library

The exercise library should exist as a dedicated area in the frontend validation to prove reuse and consistency.

It should show:

- user-owned exercise list
- exercise metadata such as name, body part, and unilateral flag
- reuse pathways into routine creation

### 5. Navigation Shell

The app should have:

- a left sidebar on desktop
- a mobile navigation pattern suited to thumb-first use
- main destinations for `Dashboard`, `Routines`, `Exercises`, and `Profile`

The navigation should feel stable and premium, not generic.

## Advanced Technique Design

All exercises and all sets should start as normal sets by default.

Advanced behavior should only appear when the user deliberately adds it through an explicit contextual action entry point.

The preferred frontend validation pattern is:

- `...`
- `Add technique`

This keeps the common path simple while preserving power for advanced training structures.

### Back-off Set

Definition:

- occurs after the final normal set
- follows 1 minute of rest
- weight should be reduced by 20-30%
- target is failure

Frontend implications:

- back-off set should attach to the end of an exercise's set sequence
- the UI should visually distinguish it from normal sets
- the UI should communicate that it is a derived follow-up set, not a peer normal set

### Cluster Set

Definition:

- a set is split into blocks
- example: 4 blocks of 3 to 4 reps

Frontend implications:

- cluster set needs a structure editor for number of blocks and rep target per block
- workout logging must show the clustered nature clearly, not as a plain normal set row
- the representation should remain compact enough for mobile

### Super Set

Definition:

- combines two exercises for different muscles
- there is no rest between the two exercises, unless unilateral behavior changes that expectation
- for each round, the user logs weight and reps for both exercises

Frontend implications:

- the user should be able to select an existing second exercise
- if the needed exercise does not already exist, the user should be able to create it inline
- the superset should be modeled as a paired structure inside the routine builder
- workout logging should present both exercises together for each round
- the UI must make it obvious that the two exercises belong to the same superset unit

## Interaction Principles

### Planning At Home, Logging At The Gym

The app should separate planning from execution.

Planning flows may be richer:

- more configuration
- more structure editing
- more technique setup

Logging flows should be faster:

- fewer decisions
- previous values prefilled
- stronger visual cues
- minimal interruption to ongoing training

### Visual Feedback Over Wordiness

Completion and state communication should prioritize:

- icons
- visual rhythm
- color/state contrast
- compact indicators

Supporting labels can still exist, but the first read should be visual rather than textual.

### Performance Comparison

After logging a workout, the UI should provide lightweight comparison to the prior instance of that routine.

Examples:

- rep increase
- weight increase
- percentage improvement
- negative regression when relevant

This should feel informative and confidence-building, not cluttered.

## Frontend Architecture

The frontend should use:

- React
- Vite
- Tailwind CSS
- shadcn/ui
- atomic-design-inspired folder organization

Suggested component layers:

- atoms: buttons, inputs, badges, icons, chips, indicators
- molecules: set rows, exercise headers, routine cards, stat summaries
- organisms: dashboard sections, workout panels, routine-builder modules, exercise pickers
- pages/templates: full composed screens

This structure should support fast validation now and smooth backend integration later.

## Responsive Expectations

Primary target:

- mobile-first interaction design

Secondary target:

- clean desktop support

Implications:

- dashboard cards must remain scannable on small screens
- logging interactions must minimize taps and cognitive load
- the desktop layout can expand information density but should preserve the same hierarchy

## Validation Success Criteria

The frontend validation phase is successful if:

- the app feels visually cohesive in the chosen premium analytical direction
- the dashboard is readable and useful on mobile
- the workout logger feels fast and controlled
- the routine builder supports both normal and advanced training structures without confusion
- the product already feels differentiated from simpler gym loggers before backend work begins

## Implementation Boundary

If implementation begins, all code should live under:

`/Users/enzosinger/Desktop/repos/gainly`

No implementation work should be created directly in:

`/Users/enzosinger/Desktop/repos`

## Open Decisions Deferred Intentionally

These topics are intentionally postponed until after frontend validation:

- Convex schema and data model
- auth flows
- persistence behavior
- progress analytics calculations
- exact long-term dashboard metrics after 4 completed workouts

These should be designed only after the frontend flows and visual language feel correct.
