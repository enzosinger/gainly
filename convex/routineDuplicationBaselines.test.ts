import { describe, expect, it } from "vitest";
import type { Id } from "./_generated/dataModel";
import { copyExercisesForDuplicateWithBaseline } from "./routineDuplicationBaselines";
import type { RoutineExerciseStructure, WorkoutSessionExerciseStructure } from "./structureTypes";

describe("copyExercisesForDuplicateWithBaseline", () => {
  it("copies latest logged set values by routine exercise and template set id", () => {
    const sourceExercises: RoutineExerciseStructure[] = [
      {
        id: "routine-exercise-bench",
        exerciseId: "ex-bench" as Id<"exercises">,
        sets: [
          { id: "set-top", technique: "normal" },
          { id: "set-backoff", technique: "backoff", weightKg: 70, reps: 8 },
        ],
      },
    ];
    const previousExercises: WorkoutSessionExerciseStructure[] = [
      {
        id: "session-exercise-bench",
        routineExerciseId: "routine-exercise-bench",
        exerciseId: "ex-bench" as Id<"exercises">,
        position: 0,
        sets: [
          { id: "session-set-top", templateSetId: "set-top", technique: "normal", weightKg: 85, reps: 6 },
          { id: "session-set-extra", templateSetId: "removed-set", technique: "normal", weightKg: 30, reps: 12 },
        ],
      },
    ];

    const duplicateExercises = copyExercisesForDuplicateWithBaseline(sourceExercises, previousExercises);

    expect(duplicateExercises[0]?.sets[0]).toMatchObject({ weightKg: 85, reps: 6 });
    expect(duplicateExercises[0]?.sets[1]).toMatchObject({ weightKg: 70, reps: 8 });
    expect(duplicateExercises[0]?.sets).toHaveLength(2);
  });

  it("copies superset pair values from the latest completed session", () => {
    const sourceExercises: RoutineExerciseStructure[] = [
      {
        id: "routine-exercise-arms",
        exerciseId: "ex-curl" as Id<"exercises">,
        sets: [{ id: "set-superset", technique: "superset", pairExerciseId: "ex-extension" as Id<"exercises"> }],
      },
    ];
    const previousExercises: WorkoutSessionExerciseStructure[] = [
      {
        id: "session-exercise-arms",
        routineExerciseId: "routine-exercise-arms",
        exerciseId: "ex-curl" as Id<"exercises">,
        position: 0,
        sets: [
          {
            id: "session-set-superset",
            templateSetId: "set-superset",
            technique: "superset",
            weightKg: 20,
            reps: 10,
            pairWeightKg: 25,
            pairReps: 12,
          },
        ],
      },
    ];

    const duplicateExercises = copyExercisesForDuplicateWithBaseline(sourceExercises, previousExercises);

    expect(duplicateExercises[0]?.sets[0]).toMatchObject({
      weightKg: 20,
      reps: 10,
      pairWeightKg: 25,
      pairReps: 12,
    });
  });
});
