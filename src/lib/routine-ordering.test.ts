import { describe, expect, it } from "vitest";
import { orderRoutinesByActiveIds, orderRoutinesByIds } from "./routine-ordering";
import { mockRoutines } from "../data/mockRoutines";

describe("routine ordering", () => {
  it("preserves inactive routine slots when active routines are dragged and later reactivated", () => {
    const routines = [
      { ...mockRoutines[0], id: "push", name: "Push", isActive: true },
      { ...mockRoutines[1], id: "pull", name: "Pull", isActive: false },
      { ...mockRoutines[2], id: "legs", name: "Legs", isActive: true },
    ];

    const dragged = orderRoutinesByActiveIds(routines, ["legs", "push"]);

    expect(dragged.map((routine) => routine.id)).toEqual(["legs", "pull", "push"]);

    const reactivated = dragged.map((routine) =>
      routine.id === "pull" ? { ...routine, isActive: true } : routine,
    );

    expect(reactivated.filter((routine) => routine.isActive !== false).map((routine) => routine.id)).toEqual([
      "legs",
      "pull",
      "push",
    ]);
  });

  it("keeps deterministic full-order reorders when every routine id is provided", () => {
    const ordered = orderRoutinesByIds(mockRoutines, ["routine-upper-b", "routine-upper-a", "routine-lower-a"]);

    expect(ordered.map((routine) => routine.id)).toEqual([
      "routine-upper-b",
      "routine-upper-a",
      "routine-lower-a",
    ]);
  });
});
