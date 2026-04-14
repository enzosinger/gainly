import { MUSCLE_GROUPS, normalizeMuscleGroup, type CanonicalMuscleGroup } from "../../lib/muscle-groups";
import type { Exercise, Routine } from "../types/domain";

export type PlannedWeeklyVolumeStatus = "low" | "moderate" | "high";

export type PlannedWeeklyVolumeEntry = {
  muscleGroup: CanonicalMuscleGroup;
  plannedSets: number;
  status: PlannedWeeklyVolumeStatus;
};

export function getPlannedWeeklyVolumeStatus(plannedSets: number): PlannedWeeklyVolumeStatus {
  if (plannedSets <= 6) {
    return "low";
  }

  if (plannedSets <= 12) {
    return "moderate";
  }

  return "high";
}

export function buildPlannedWeeklyVolume(routines: Routine[], exercises: Exercise[]): PlannedWeeklyVolumeEntry[] {
  const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const plannedSetsByMuscleGroup = new Map<CanonicalMuscleGroup, number>(
    MUSCLE_GROUPS.map((muscleGroup) => [muscleGroup, 0]),
  );

  for (const routine of routines) {
    for (const routineExercise of routine.exercises) {
      const exercise = exerciseById.get(routineExercise.exerciseId);

      if (!exercise) {
        continue;
      }

      const muscleGroup = normalizeMuscleGroup(exercise.muscleGroup);
      plannedSetsByMuscleGroup.set(
        muscleGroup,
        (plannedSetsByMuscleGroup.get(muscleGroup) ?? 0) + routineExercise.sets.length,
      );
    }
  }

  return MUSCLE_GROUPS.map((muscleGroup) => {
    const plannedSets = plannedSetsByMuscleGroup.get(muscleGroup) ?? 0;

    return {
      muscleGroup,
      plannedSets,
      status: getPlannedWeeklyVolumeStatus(plannedSets),
    };
  });
}
