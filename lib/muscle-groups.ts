export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "quads",
  "hamstrings",
  "calves",
  "biceps",
  "triceps",
] as const;

export const LEGACY_MUSCLE_GROUP = "legs" as const;

export type CanonicalMuscleGroup = (typeof MUSCLE_GROUPS)[number];
export type MuscleGroup = CanonicalMuscleGroup | typeof LEGACY_MUSCLE_GROUP;

export const ALL_MUSCLE_GROUPS = [...MUSCLE_GROUPS, LEGACY_MUSCLE_GROUP] as const;
export const MUSCLE_GROUP_FILTER_OPTIONS = ["all", ...MUSCLE_GROUPS] as const;

export function normalizeMuscleGroup(muscleGroup: MuscleGroup): CanonicalMuscleGroup {
  return muscleGroup === LEGACY_MUSCLE_GROUP ? "quads" : muscleGroup;
}
