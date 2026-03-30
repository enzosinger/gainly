# Gainly Routine Builder UX Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the `/routines` planning flow so the user can switch routines, filter the exercise picker, add normal sets, and remove exercises without changing the current frontend-only architecture.

**Architecture:** Keep the B2 local UI layer and mocked store structure intact. Store the selected routine id locally in `RoutinesPage`, add two focused store actions for routine editing, and evolve the existing routine-builder organisms rather than introducing new route structure or a broader model refactor.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Testing Library, Vitest

---

## File Structure

- Modify: `src/pages/RoutinesPage.tsx`
  - Hold page-local selected-routine state, render the routine switcher, and wire the active routine into the picker and editor list.
- Modify: `src/components/organisms/routine-builder/ExercisePicker.tsx`
  - Add local search and muscle-group filtering while keeping inline exercise creation.
- Modify: `src/components/organisms/routine-builder/RoutineExerciseEditor.tsx`
  - Add `Add set` and `Remove exercise` actions and remove the low-value helper copy.
- Modify: `src/state/gainly-store.tsx`
  - Add store actions for appending a normal set and removing an exercise from a routine.
- Modify: `src/pages/RoutinesPage.test.tsx`
  - Cover routine switching, picker filtering, adding normal sets, removing exercises, and preserving advanced-technique behavior.

## Task 1: Lock The Missing Builder Behaviors In Tests

**Files:**
- Modify: `src/pages/RoutinesPage.test.tsx`

- [ ] **Step 1: Write the failing routine-switcher and filter tests**

Add these tests to `src/pages/RoutinesPage.test.tsx`:

```tsx
it("switches the routine editor with the routine selector", async () => {
  const user = userEvent.setup();

  render(
    <GainlyStoreProvider>
      <RoutinesPage />
    </GainlyStoreProvider>,
  );

  expect(screen.getByRole("heading", { name: /push builder/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();

  await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-lower-a");

  expect(screen.getByRole("heading", { name: /pull builder/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /barbell back squat/i })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
});

it("filters the exercise picker by search text and muscle group", async () => {
  const user = userEvent.setup();

  render(
    <GainlyStoreProvider>
      <RoutinesPage />
    </GainlyStoreProvider>,
  );

  const searchInput = screen.getByRole("textbox", { name: /search exercises/i });
  const muscleGroupFilter = screen.getByRole("combobox", { name: /filter by muscle group/i });

  await user.type(searchInput, "curl");

  expect(screen.getByRole("button", { name: /incline dumbbell curl/i })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /barbell bench press/i })).not.toBeInTheDocument();

  await user.clear(searchInput);
  await user.selectOptions(muscleGroupFilter, "legs");

  expect(screen.getByRole("button", { name: /barbell back squat/i })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /barbell bench press/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the routines test file to verify the new expectations fail**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: FAIL because `RoutinesPage` does not yet render a routine selector or picker filters.

- [ ] **Step 3: Write the failing normal-set and remove-exercise tests**

Add these tests to the same file:

```tsx
it("adds a normal set to a routine exercise", async () => {
  const user = userEvent.setup();

  render(
    <GainlyStoreProvider>
      <RoutinesPage />
    </GainlyStoreProvider>,
  );

  const benchCard = screen.getByRole("heading", { name: /barbell bench press/i }).closest(".panel-card");
  expect(benchCard).not.toBeNull();

  await user.click(within(benchCard as HTMLElement).getByRole("button", { name: /add set/i }));

  expect(within(benchCard as HTMLElement).getByText(/set 3 · normal/i)).toBeInTheDocument();
});

it("removes an exercise from the selected routine only", async () => {
  const user = userEvent.setup();

  render(
    <GainlyStoreProvider>
      <RoutinesPage />
    </GainlyStoreProvider>,
  );

  const benchCard = screen.getByRole("heading", { name: /barbell bench press/i }).closest(".panel-card");
  expect(benchCard).not.toBeNull();

  await user.click(within(benchCard as HTMLElement).getByRole("button", { name: /remove exercise/i }));

  expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /seated cable row/i })).toBeInTheDocument();

  await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-upper-b");
  expect(screen.getByRole("heading", { name: /incline dumbbell curl/i })).toBeInTheDocument();
});
```

- [ ] **Step 4: Run the routines test file again to confirm the new structure-editing tests fail**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: FAIL because there is no `Add set` action, no `Remove exercise` action, and no store support for either behavior.

- [ ] **Step 5: Commit the failing-test baseline**

```bash
git add src/pages/RoutinesPage.test.tsx
git commit -m "test: define routine builder ux expectations"
```

## Task 2: Add Store Support For Normal Sets And Exercise Removal

**Files:**
- Modify: `src/state/gainly-store.tsx`
- Modify: `src/pages/RoutinesPage.test.tsx`

- [ ] **Step 1: Extend the store contract with the new actions**

Update the `GainlyStoreValue` type in `src/state/gainly-store.tsx`:

```tsx
type GainlyStoreValue = {
  exercises: Exercise[];
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  reorderRoutines: (nextIds: string[]) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => void;
  removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => void;
  addTechniqueToRoutineExercise: (
    routineId: string,
    routineExerciseId: string,
    technique: Exclude<TechniqueType, "normal">,
  ) => void;
  createExercise: (input: { name: string; muscleGroup: MuscleGroup }) => Exercise;
};
```

- [ ] **Step 2: Implement the new store actions**

Add these handlers inside the `useMemo` value object in `src/state/gainly-store.tsx`:

```tsx
addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => {
  setRoutines((current) =>
    current.map((routine) => {
      if (routine.id !== routineId) {
        return routine;
      }

      return {
        ...routine,
        exercises: routine.exercises.map((routineExercise) => {
          if (routineExercise.id !== routineExerciseId) {
            return routineExercise;
          }

          const nextSetIndex = routineExercise.sets.length + 1;
          return {
            ...routineExercise,
            sets: [
              ...routineExercise.sets,
              {
                id: `${routineExercise.id}-set-${nextSetIndex}`,
                technique: "normal",
              },
            ],
          };
        }),
      };
    }),
  );
},
removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => {
  setRoutines((current) =>
    current.map((routine) => {
      if (routine.id !== routineId) {
        return routine;
      }

      return {
        ...routine,
        exercises: routine.exercises.filter((routineExercise) => routineExercise.id !== routineExerciseId),
      };
    }),
  );
},
```

- [ ] **Step 3: Run the routines tests to verify the behavior is still partially failing**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: FAIL, but the remaining failures should now be in the page and component layer rather than missing store actions.

- [ ] **Step 4: Commit the store foundation**

```bash
git add src/state/gainly-store.tsx
git commit -m "feat: add routine editing store actions"
```

## Task 3: Implement The Selected Routine Editor And Picker Filtering

**Files:**
- Modify: `src/pages/RoutinesPage.tsx`
- Modify: `src/components/organisms/routine-builder/ExercisePicker.tsx`
- Modify: `src/components/organisms/routine-builder/RoutineExerciseEditor.tsx`
- Modify: `src/pages/RoutinesPage.test.tsx`

- [ ] **Step 1: Update `RoutinesPage.tsx` to store only the selected routine id locally**

Refactor the page to derive the active routine from `routines` and render a routine switcher:

```tsx
import { useEffect, useState } from "react";
import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { Card, CardContent } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { useGainlyStore } from "../state/gainly-store";

export default function RoutinesPage() {
  const {
    routines,
    exercises,
    addTechniqueToRoutineExercise,
    addSetToRoutineExercise,
    removeExerciseFromRoutine,
  } = useGainlyStore();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(routines[0]?.id ?? null);

  useEffect(() => {
    if (!routines.length) {
      setSelectedRoutineId(null);
      return;
    }

    if (!selectedRoutineId || !routines.some((routine) => routine.id === selectedRoutineId)) {
      setSelectedRoutineId(routines[0].id);
    }
  }, [routines, selectedRoutineId]);

  const routine = routines.find((entry) => entry.id === selectedRoutineId) ?? routines[0];
  const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  if (!routine) {
    return (
      <section className="space-y-4">
        <h1 className="screen-title">Routines</h1>
        <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">No routines available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-3">
        <div className="space-y-2">
          <p className="eyebrow">{routine.weekday}</p>
          <h1 className="screen-title">{routine.name} builder</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Edit one routine at a time with a faster planning flow for sets and exercise selection.
          </p>
        </div>
        <label className="block max-w-sm text-sm">
          <span className="block text-[hsl(var(--muted-foreground))]">Routine</span>
          <Select
            aria-label="Routine"
            value={routine.id}
            onChange={(event) => setSelectedRoutineId(event.target.value)}
            className="mt-2"
          >
            {routines.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.weekday} · {entry.name}
              </option>
            ))}
          </Select>
        </label>
      </header>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <ExercisePicker routineId={routine.id} />
        <div className="space-y-3">
          {routine.exercises.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-[hsl(var(--muted-foreground))]">
                Add an exercise to start shaping this routine.
              </CardContent>
            </Card>
          ) : null}
          {routine.exercises.map((item) => {
            const exercise = exercisesById.get(item.exerciseId);
            if (!exercise) {
              return null;
            }
            return (
              <RoutineExerciseEditor
                key={item.id}
                exercise={exercise}
                item={item}
                onAddSet={(routineExerciseId) => addSetToRoutineExercise(routine.id, routineExerciseId)}
                onRemove={(routineExerciseId) => removeExerciseFromRoutine(routine.id, routineExerciseId)}
                onSelectTechnique={(routineExerciseId, technique) =>
                  addTechniqueToRoutineExercise(routine.id, routineExerciseId, technique)
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add local search and muscle-group filtering to `ExercisePicker.tsx`**

Refactor the picker component like this:

```tsx
import { FormEvent, useMemo, useState } from "react";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";

const muscleGroupOptions: MuscleGroup[] = ["chest", "back", "shoulders", "legs", "biceps", "triceps"];

export default function ExercisePicker({ routineId }: { routineId: string }) {
  const { exercises, addExerciseToRoutine, createExercise } = useGainlyStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all");
  const createFormId = `exercise-create-form-${routineId}`;

  const filteredExercises = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesSearch = !normalizedQuery || exercise.name.toLowerCase().includes(normalizedQuery);
      const matchesMuscle = muscleFilter === "all" || exercise.muscleGroup === muscleFilter;
      return matchesSearch && matchesMuscle;
    });
  }, [exercises, muscleFilter, searchQuery]);

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    const nextExercise = createExercise({ name, muscleGroup });
    addExerciseToRoutine(routineId, nextExercise.id);
    setName("");
    setMuscleGroup("chest");
    setCreateOpen(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-base">Add exercise</CardTitle>
          <CardDescription>Search or filter the library before adding a movement to this routine.</CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-controls={createFormId}
          aria-expanded={createOpen}
          onClick={() => setCreateOpen((current) => !current)}
        >
          {createOpen ? "Cancel" : "Create new"}
        </Button>
      </CardHeader>
      {createOpen ? (
        <CardContent className="pb-0">
          <form id={createFormId} className="panel-inset space-y-3 rounded-2xl p-4" onSubmit={handleCreate}>
            <label className="block text-sm">
              <span className="block text-[hsl(var(--muted-foreground))]">Exercise name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2"
                placeholder="Romanian Deadlift"
              />
            </label>
            <label className="block text-sm">
              <span className="block text-[hsl(var(--muted-foreground))]">Muscle group</span>
              <Select
                value={muscleGroup}
                onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
                className="mt-2"
              >
                {muscleGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </label>
            <Button type="submit" variant="default" size="sm">
              Save exercise
            </Button>
          </form>
        </CardContent>
      ) : null}
      <CardContent className={createOpen ? "space-y-4 pt-4" : "space-y-4"}>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px]">
          <label className="block text-sm">
            <span className="block text-[hsl(var(--muted-foreground))]">Search exercises</span>
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="mt-2"
              placeholder="Search by exercise name"
            />
          </label>
          <label className="block text-sm">
            <span className="block text-[hsl(var(--muted-foreground))]">Filter by muscle group</span>
            <Select
              aria-label="Filter by muscle group"
              value={muscleFilter}
              onChange={(event) => setMuscleFilter(event.target.value as MuscleGroup | "all")}
              className="mt-2"
            >
              <option value="all">All muscle groups</option>
              {muscleGroupOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>
        </div>
        {filteredExercises.length ? (
          <div className="grid gap-2">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => addExerciseToRoutine(routineId, exercise.id)}
                className="panel-inset rounded-2xl px-3 py-3 text-left text-sm text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--ring))]"
              >
                {exercise.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="panel-inset rounded-2xl px-3 py-3 text-sm text-[hsl(var(--muted-foreground))]">
            No exercises match the current filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Add `Add set` and `Remove exercise` actions to `RoutineExerciseEditor.tsx`**

Update the component like this:

```tsx
import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function RoutineExerciseEditor({
  exercise,
  item,
  onAddSet,
  onRemove,
  onSelectTechnique,
}: {
  exercise: Exercise;
  item: RoutineExercise;
  onAddSet: (routineExerciseId: string) => void;
  onRemove: (routineExerciseId: string) => void;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster" | "superset") => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
        <div className="space-y-2">
          <p className="eyebrow">Routine exercise</p>
          <CardTitle className="text-base">{exercise.name}</CardTitle>
        </div>
        <Badge variant="outline" className="capitalize">
          {exercise.muscleGroup}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => onAddSet(item.id)}>
            Add set
          </Button>
          <TechniqueMenu onSelect={(technique) => onSelectTechnique(item.id, technique)} />
          <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
            Remove exercise
          </Button>
        </div>
        <div className="space-y-2">
          {item.sets.map((set, index) => (
            <div
              key={set.id}
              className="panel-inset rounded-2xl px-3 py-3 text-sm text-[hsl(var(--muted-foreground))]"
            >
              Set {index + 1} · {set.technique}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run the routines test file to verify the full behavior passes**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: PASS with all routines-page behavior tests green, including the existing create-exercise and advanced-technique coverage.

- [ ] **Step 5: Commit the routine-builder UX implementation**

```bash
git add src/pages/RoutinesPage.tsx src/components/organisms/routine-builder/ExercisePicker.tsx src/components/organisms/routine-builder/RoutineExerciseEditor.tsx src/pages/RoutinesPage.test.tsx
git commit -m "feat: complete routine builder ux flow"
```

## Task 4: Run Broader Verification For The Builder Pass

**Files:**
- Modify: `src/pages/RoutinesPage.test.tsx` (only if a verification failure requires a small test fix)
- Modify: `src/pages/WorkoutPage.test.tsx` (only if a shared routine edit side effect appears)

- [ ] **Step 1: Run the focused page test suite**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx src/pages/WorkoutPage.test.tsx`
Expected: PASS, confirming the builder changes did not break the logger expectations that still rely on routine structure.

- [ ] **Step 2: Run the full test suite**

Run: `npm test -- --runInBand`
Expected: PASS with all existing app and page tests green.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: PASS with a completed Vite production build and no TypeScript errors.

- [ ] **Step 4: Commit any verification-driven adjustments**

```bash
git add src/pages/RoutinesPage.test.tsx src/pages/WorkoutPage.test.tsx src/pages/RoutinesPage.tsx src/components/organisms/routine-builder/ExercisePicker.tsx src/components/organisms/routine-builder/RoutineExerciseEditor.tsx src/state/gainly-store.tsx
git commit -m "test: verify routine builder ux completion"
```
