import { describe, expect, it } from "vitest";
import type { Id } from "./_generated/dataModel";
import type { WorkoutSessionExerciseStructure } from "./structureTypes";
import { getWorkoutSessionFallbackPatches } from "./workoutSessionFallbacks";

describe("getWorkoutSessionFallbackPatches", () => {
  it("fills only missing current values from matching previous session sets", () => {
    const currentExercises: WorkoutSessionExerciseStructure[] = [
      {
        id: "current-exercise-1",
        routineExerciseId: "routine-exercise-1",
        exerciseId: "ex-primary" as Id<"exercises">,
        position: 0,
        sets: [
          {
            id: "current-set-1",
            templateSetId: "set-1",
            technique: "normal",
          },
          {
            id: "current-set-2",
            templateSetId: "set-2",
            technique: "superset",
            weightKg: 24,
            pairReps: 15,
          },
        ],
      },
    ];

    const previousExercises: WorkoutSessionExerciseStructure[] = [
      {
        id: "previous-exercise-1",
        routineExerciseId: "routine-exercise-1",
        exerciseId: "ex-primary" as Id<"exercises">,
        position: 0,
        sets: [
          {
            id: "previous-set-1",
            templateSetId: "set-1",
            technique: "normal",
            weightKg: 50,
            reps: 10,
          },
          {
            id: "previous-set-2",
            templateSetId: "set-2",
            technique: "superset",
            weightKg: 20,
            reps: 12,
            pairWeightKg: 22.5,
            pairReps: 12,
          },
        ],
      },
    ];

    expect(getWorkoutSessionFallbackPatches(currentExercises, previousExercises)).toEqual([
      {
        setId: "current-set-1",
        weightKg: 50,
        reps: 10,
      },
      {
        setId: "current-set-2",
        reps: 12,
        pairWeightKg: 22.5,
      },
    ]);
  });
});
