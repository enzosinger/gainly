import { describe, expect, it } from "vitest";
import { buildPlannedWeeklyVolume } from "./profile-weekly-volume";
import type { Exercise, Routine } from "../types/domain";

function buildSet(id: string) {
  return { id, technique: "normal" as const };
}

describe("buildPlannedWeeklyVolume", () => {
  it("returns every muscle group in canonical order with zero low volume when no routines exist", () => {
    expect(buildPlannedWeeklyVolume([], [])).toEqual([
      { muscleGroup: "chest", plannedSets: 0, status: "low" },
      { muscleGroup: "back", plannedSets: 0, status: "low" },
      { muscleGroup: "shoulders", plannedSets: 0, status: "low" },
      { muscleGroup: "quads", plannedSets: 0, status: "low" },
      { muscleGroup: "hamstrings", plannedSets: 0, status: "low" },
      { muscleGroup: "calves", plannedSets: 0, status: "low" },
      { muscleGroup: "biceps", plannedSets: 0, status: "low" },
      { muscleGroup: "triceps", plannedSets: 0, status: "low" },
    ]);
  });

  it("derives planned sets from routine template sets and applies the exact threshold bands", () => {
    const exercises: Exercise[] = [
      { id: "ex-chest", name: "Chest Press", muscleGroup: "chest" },
      { id: "ex-back", name: "Row", muscleGroup: "back" },
      { id: "ex-shoulders", name: "Press", muscleGroup: "shoulders" },
    ];
    const routines: Routine[] = [
      {
        id: "routine-1",
        name: "Upper",
        completed: false,
        deltaPercent: 0,
        exercises: [
          { id: "routine-1-chest", exerciseId: "ex-chest", sets: Array.from({ length: 6 }, (_, index) => buildSet(`chest-${index + 1}`)) },
          { id: "routine-1-back", exerciseId: "ex-back", sets: Array.from({ length: 7 }, (_, index) => buildSet(`back-${index + 1}`)) },
          {
            id: "routine-1-shoulders",
            exerciseId: "ex-shoulders",
            sets: Array.from({ length: 13 }, (_, index) => buildSet(`shoulders-${index + 1}`)),
          },
        ],
      },
    ];

    expect(buildPlannedWeeklyVolume(routines, exercises)).toEqual([
      { muscleGroup: "chest", plannedSets: 6, status: "low" },
      { muscleGroup: "back", plannedSets: 7, status: "moderate" },
      { muscleGroup: "shoulders", plannedSets: 13, status: "high" },
      { muscleGroup: "quads", plannedSets: 0, status: "low" },
      { muscleGroup: "hamstrings", plannedSets: 0, status: "low" },
      { muscleGroup: "calves", plannedSets: 0, status: "low" },
      { muscleGroup: "biceps", plannedSets: 0, status: "low" },
      { muscleGroup: "triceps", plannedSets: 0, status: "low" },
    ]);
  });

  it("reclassifies legacy legs exercises to quads without changing the routine template", () => {
    const exercises: Exercise[] = [{ id: "ex-squat", name: "Squat", muscleGroup: "legs" }];
    const routines: Routine[] = [
      {
        id: "routine-1",
        name: "Lower",
        completed: false,
        deltaPercent: 0,
        exercises: [{ id: "routine-1-squat", exerciseId: "ex-squat", sets: [buildSet("set-1"), buildSet("set-2")] }],
      },
    ];

    expect(buildPlannedWeeklyVolume(routines, exercises)).toEqual([
      { muscleGroup: "chest", plannedSets: 0, status: "low" },
      { muscleGroup: "back", plannedSets: 0, status: "low" },
      { muscleGroup: "shoulders", plannedSets: 0, status: "low" },
      { muscleGroup: "quads", plannedSets: 2, status: "low" },
      { muscleGroup: "hamstrings", plannedSets: 0, status: "low" },
      { muscleGroup: "calves", plannedSets: 0, status: "low" },
      { muscleGroup: "biceps", plannedSets: 0, status: "low" },
      { muscleGroup: "triceps", plannedSets: 0, status: "low" },
    ]);
  });
});
