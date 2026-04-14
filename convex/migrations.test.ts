import { describe, expect, it } from "vitest";
import type { Doc } from "./_generated/dataModel";
import { buildExerciseMuscleGroupBackfill } from "./migrations";

describe("buildExerciseMuscleGroupBackfill", () => {
  it("maps legacy legs rows to quads and leaves canonical rows alone", () => {
    const legacyExercise = {
      _id: "exercise-1",
      muscleGroup: "legs",
    } as Pick<Doc<"exercises">, "_id" | "muscleGroup">;

    const canonicalExercise = {
      _id: "exercise-2",
      muscleGroup: "quads",
    } as Pick<Doc<"exercises">, "_id" | "muscleGroup">;

    expect(buildExerciseMuscleGroupBackfill(legacyExercise)).toEqual({
      exerciseId: "exercise-1",
      muscleGroup: "quads",
    });
    expect(buildExerciseMuscleGroupBackfill(canonicalExercise)).toBeNull();
  });
});
