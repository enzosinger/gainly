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
    expect(getMuscleGroupLabel("en", "quads")).toBe("quads");
    expect(getMuscleGroupLabel("en", "hamstrings")).toBe("hamstrings");
    expect(getMuscleGroupLabel("en", "calves")).toBe("calves");
    expect(getMuscleGroupLabel("pt", "quads")).toBe("quadríceps");
    expect(getMuscleGroupLabel("pt", "hamstrings")).toBe("isquiotibiais");
    expect(getMuscleGroupLabel("pt", "calves")).toBe("panturrilhas");
  });
});
