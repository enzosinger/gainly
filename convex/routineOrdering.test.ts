import { describe, expect, it } from "vitest";
import { buildRoutineOrderIds } from "./routineOrdering";
import type { Id } from "./_generated/dataModel";

function routine(id: string, position: number, isActive = true) {
  return {
    _id: id as Id<"routines">,
    position,
    isActive,
  };
}

describe("buildRoutineOrderIds", () => {
  it("preserves inactive slots when an old client sends only active routine ids", () => {
    const routines = [
      routine("push", 0),
      routine("pull", 1, false),
      routine("legs", 2),
    ];

    expect(buildRoutineOrderIds(routines, ["legs", "push"] as Array<Id<"routines">>)).toEqual([
      "legs",
      "pull",
      "push",
    ]);
  });

  it("uses full requested order when all routine ids are provided", () => {
    const routines = [
      routine("push", 0),
      routine("pull", 1, false),
      routine("legs", 2),
    ];

    expect(buildRoutineOrderIds(routines, ["legs", "push", "pull"] as Array<Id<"routines">>)).toEqual([
      "legs",
      "push",
      "pull",
    ]);
  });
});
