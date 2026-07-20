import { describe, expect, it } from "vitest";
import { MUSCLE_GROUP_FILTER_OPTIONS, MUSCLE_GROUPS, normalizeMuscleGroup } from "../../lib/muscle-groups";
import { getMuscleGroupLabel } from "../i18n/copy";

describe("muscle groups", () => {
  it("exposes the canonical display order and normalizes legacy legs to quads", () => {
    expect(MUSCLE_GROUPS).toEqual([
      "chest",
      "back",
      "shoulders",
      "quads",
      "hamstrings",
      "calves",
      "biceps",
      "triceps",
    ]);
    expect(normalizeMuscleGroup("legs")).toBe("quads");
  });

  it("exposes a shared filter option list that keeps the canonical ordering", () => {
    expect(MUSCLE_GROUP_FILTER_OPTIONS).toEqual(["all", ...MUSCLE_GROUPS]);
  });

  it("labels the new lower-body groups in both languages", () => {
    expect(getMuscleGroupLabel("en", "quads")).toBe("Quads");
    expect(getMuscleGroupLabel("en", "hamstrings")).toBe("Hamstrings");
    expect(getMuscleGroupLabel("en", "calves")).toBe("Calves");
    expect(getMuscleGroupLabel("pt", "quads")).toBe("Quadríceps");
    expect(getMuscleGroupLabel("pt", "hamstrings")).toBe("Posterior de coxa");
    expect(getMuscleGroupLabel("pt", "calves")).toBe("Panturrilhas");
  });
});
