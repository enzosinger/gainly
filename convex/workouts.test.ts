import { describe, expect, it } from "vitest";
import type { Doc } from "./_generated/dataModel";
import type { Id } from "./_generated/dataModel";
import { syncSessionWithRoutine } from "./workouts";

describe("syncSessionWithRoutine", () => {
  it("preserves logged superset pair values when the routine template has no pair data", () => {
    const existingExercises = [
      {
        id: "session-exercise-1",
        routineExerciseId: "routine-exercise-1",
        exerciseId: "ex-primary" as Id<"exercises">,
        position: 0,
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
    ] as Doc<"workoutSessions">["exercises"];

    const routine = {
      _id: "routine-1" as Id<"routines">,
      userId: "user-1" as Id<"users">,
      name: "Test Routine",
      completed: false,
      deltaPercent: 0,
      position: 0,
      createdAt: 0,
      updatedAt: 0,
      exercises: [
        {
          id: "routine-exercise-1",
          exerciseId: "ex-primary" as Id<"exercises">,
          sets: [
            {
              id: "set-1",
              technique: "superset" as const,
              pairExerciseId: "ex-pair" as Id<"exercises">,
            },
          ],
        },
      ],
    } as Doc<"routines">;

    const syncedExercises = syncSessionWithRoutine(existingExercises, routine);

    expect(syncedExercises[0]?.sets[0]).toMatchObject({
      technique: "superset",
      pairExerciseId: "ex-pair",
      weightKg: 100,
      reps: 1,
      pairWeightKg: 100,
      pairReps: 2,
    });
  });
});
