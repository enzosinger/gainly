import { describe, expect, it } from "vitest";
import type { Id } from "./_generated/dataModel";
import { splitRoutineExerciseSetRowsForRemoval } from "./routineStructure";

describe("splitRoutineExerciseSetRowsForRemoval", () => {
  it("treats duplicated set ids as one removal target and keeps remaining rows in order", () => {
    const rows = [
      { _id: "set-1", publicId: "set-1", position: 0 },
      { _id: "set-2", publicId: "set-2", position: 1 },
      { _id: "set-3-a", publicId: "set-3", position: 2 },
      { _id: "set-3-b", publicId: "set-3", position: 2 },
      { _id: "set-4", publicId: "set-4", position: 3 },
    ] as Array<{
      _id: Id<"routineExerciseSets">;
      publicId: string;
      position: number;
    }>;

    const result = splitRoutineExerciseSetRowsForRemoval(rows, "set-3");

    expect(result.targetSetRows).toHaveLength(2);
    expect(result.targetSetRows.map((row) => row._id)).toEqual(["set-3-a", "set-3-b"]);
    expect(result.remainingSetRows.map((row) => row._id)).toEqual(["set-1", "set-2", "set-4"]);
  });
});
