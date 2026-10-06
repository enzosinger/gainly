import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WorkoutPage from "../pages/WorkoutPage";
import { GainlyStoreProvider } from "../state/gainly-store";
import type { WorkoutSessionExercise, WorkoutSetInput } from "../types/domain";

type Session = { _id: string; status: "in_progress"; exercises: WorkoutSessionExercise[] };
export type SetPatch = WorkoutSetInput & { setId: string };

function initialSession(): Session {
  return {
    _id: "session-upper-b",
    status: "in_progress",
    exercises: [{
      id: "session-shoulder",
      routineExerciseId: "routine-upper-b-shoulder-press",
      exerciseId: "ex-dumbbell-shoulder-press",
      position: 0,
      sets: [{ id: "shoulder-set", templateSetId: "set-upper-b-press-1", technique: "normal", weightKg: 15, reps: 10 }],
    }, {
      id: "session-arms",
      routineExerciseId: "routine-upper-b-arms",
      exerciseId: "ex-incline-dumbbell-curl",
      position: 1,
      sets: [{
        id: "arms-set", templateSetId: "set-upper-b-arms-1", technique: "superset",
        weightKg: 20, reps: 10, pairExerciseId: "ex-cable-triceps-pushdown", pairWeightKg: 22.5, pairReps: 12,
      }],
    }],
  };
}

let session = initialSession();
const listeners = new Set<() => void>();

export function resetSession() { session = initialSession(); }
export function readSession() { return session; }
export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function persistSet(input: SetPatch) {
  session = {
    ...session,
    exercises: session.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => set.id !== input.setId ? set : {
        ...set,
        weightKg: input.weightKg ?? undefined,
        reps: input.reps ?? undefined,
        pairWeightKg: input.pairWeightKg ?? undefined,
        pairReps: input.pairReps ?? undefined,
      }),
    })),
  };
  listeners.forEach((listener) => listener());
}

export function renderWorkoutSave() {
  return render(
    <MemoryRouter initialEntries={["/workout/routine-upper-b"]}>
      <GainlyStoreProvider>
        <Routes><Route path="/workout/:routineId" element={<WorkoutPage />} /></Routes>
      </GainlyStoreProvider>
    </MemoryRouter>,
  );
}
