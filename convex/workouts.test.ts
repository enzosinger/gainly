import { describe, expect, it } from "vitest";
import type { Id } from "./_generated/dataModel";
import type { RoutineExerciseStructure, WorkoutSessionExerciseStructure } from "./structureTypes";
import { syncSessionWithRoutine } from "./workouts";

describe("syncSessionWithRoutine", () => {
  it("preserves logged superset pair values when the routine template has no pair data", () => {
    const existingExercises: WorkoutSessionExerciseStructure[] = [
      {
        id: "session-exercise-1",
        routineExerciseId: "routine-exercise-1",
        exerciseId: "ex-primary" as Id<"exercises">,
        position: 0,
        repRangeMin: 5,
        repRangeMax: 8,
        warmupSets: 0,
        feederSets: 0,
        sets: [
          {
            id: "session-set-1",
            templateSetId: "set-1",
            technique: "superset" as const,
            pairExerciseId: "ex-pair" as Id<"exercises">,
            weightKg: 100,
            reps: 1,
            pairWeightKg: 100,
            pairReps: 2,
          },
        ],
      },
    ];

    const routine = {
      exercises: [
        {
          id: "routine-exercise-1",
          exerciseId: "ex-primary" as Id<"exercises">,
          repRangeMin: 6,
          repRangeMax: 9,
          sets: [
            {
              id: "set-1",
              technique: "superset" as const,
              pairExerciseId: "ex-pair" as Id<"exercises">,
            },
          ],
        },
      ],
    } satisfies { exercises: RoutineExerciseStructure[] };

    const syncedExercises = syncSessionWithRoutine(existingExercises, routine);

    expect(syncedExercises[0]?.sets[0]).toMatchObject({
      technique: "superset",
      pairExerciseId: "ex-pair",
      weightKg: 100,
      reps: 1,
      pairWeightKg: 100,
      pairReps: 2,
    });
    expect(syncedExercises[0]).toMatchObject({
      repRangeMin: 6,
      repRangeMax: 9,
    });
  });
});
