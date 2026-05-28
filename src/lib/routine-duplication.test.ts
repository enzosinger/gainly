import { describe, expect, it, vi } from "vitest";
import { duplicateRoutineDraft } from "./routine-duplication";
import { mockRoutines } from "../data/mockRoutines";

describe("duplicateRoutineDraft", () => {
  it("copies exercises and set count without previous logged weights", () => {
    vi.spyOn(Date, "now").mockReturnValue(123);

    const duplicate = duplicateRoutineDraft(mockRoutines, "routine-upper-a");

    expect(duplicate.name).toBe("Push copy");
    expect(duplicate.completed).toBe(false);
    expect(duplicate.deltaPercent).toBe(0);
    expect(duplicate.hasProgressHistory).toBe(false);
    expect(duplicate.isActive).toBe(true);
    expect(duplicate.exercises).toHaveLength(2);
    expect(duplicate.exercises[0].exerciseId).toBe("ex-barbell-bench-press");
    expect(duplicate.exercises[0].sets).toHaveLength(2);
    expect(duplicate.exercises[0].sets[0]).not.toHaveProperty("weightKg");
    expect(duplicate.exercises[0].sets[0]).not.toHaveProperty("reps");
  });

  it("uses a unique copy name when routine was already duplicated", () => {
    const firstDuplicate = duplicateRoutineDraft(mockRoutines, "routine-upper-a");
    const secondDuplicate = duplicateRoutineDraft([...mockRoutines, firstDuplicate], "routine-upper-a");

    expect(secondDuplicate.name).toBe("Push copy 2");
  });
});
