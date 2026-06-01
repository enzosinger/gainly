import { describe, expect, it } from "vitest";
import type { Id } from "./_generated/dataModel";
import { buildRoutineExercisePositionUpdates } from "./routineExerciseOrdering";

function routineExercise(id: string, position: number) {
  return {
    _id: `${id}-row` as Id<"routineExercises">,
    publicId: id,
    position,
  };
}

describe("buildRoutineExercisePositionUpdates", () => {
  it("builds deterministic position updates for a complete exercise order", () => {
    const rows = [
      routineExercise("bench", 0),
      routineExercise("row", 1),
      routineExercise("press", 2),
    ];

    expect(buildRoutineExercisePositionUpdates(rows, ["press", "bench", "row"])).toEqual([
      { routineExerciseId: "press-row", position: 0 },
      { routineExerciseId: "bench-row", position: 1 },
      { routineExerciseId: "row-row", position: 2 },
    ]);
  });

  it("rejects missing, duplicate, or unknown exercise ids", () => {
    const rows = [routineExercise("bench", 0), routineExercise("row", 1)];

    expect(() => buildRoutineExercisePositionUpdates(rows, ["bench"])).toThrow(/every exercise/i);
    expect(() => buildRoutineExercisePositionUpdates(rows, ["bench", "bench"])).toThrow(/duplicates/i);
    expect(() => buildRoutineExercisePositionUpdates(rows, ["bench", "press"])).toThrow(/unknown exercise/i);
  });
});
