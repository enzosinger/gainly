import type { WorkoutSessionExerciseStructure, WorkoutSessionSetStructure } from "./structureTypes";

type SetFallbackPatch = {
  setId: string;
  weightKg?: number;
  reps?: number;
  pairWeightKg?: number;
  pairReps?: number;
};

function buildSetKey(exerciseId: string, set: Pick<WorkoutSessionSetStructure, "templateSetId">) {
  return `${exerciseId}:${set.templateSetId}`;
}

function hasFallbackPatch(patch: SetFallbackPatch) {
  return (
    patch.weightKg !== undefined ||
    patch.reps !== undefined ||
    patch.pairWeightKg !== undefined ||
    patch.pairReps !== undefined
  );
}

export function getWorkoutSessionFallbackPatches(
  currentExercises: WorkoutSessionExerciseStructure[],
  previousExercises: WorkoutSessionExerciseStructure[],
) {
  const previousSetsByKey = new Map<string, WorkoutSessionSetStructure>();

  for (const exercise of previousExercises) {
    for (const set of exercise.sets) {
      previousSetsByKey.set(buildSetKey(exercise.routineExerciseId, set), set);
    }
  }

  const patches: SetFallbackPatch[] = [];

  for (const exercise of currentExercises) {
    for (const set of exercise.sets) {
      const previousSet = previousSetsByKey.get(buildSetKey(exercise.routineExerciseId, set));
      if (!previousSet) {
        continue;
      }

      const patch: SetFallbackPatch = { setId: set.id };

      if (set.weightKg === undefined && previousSet.weightKg !== undefined) {
        patch.weightKg = previousSet.weightKg;
      }
      if (set.reps === undefined && previousSet.reps !== undefined) {
        patch.reps = previousSet.reps;
      }
      if (set.pairWeightKg === undefined && previousSet.pairWeightKg !== undefined) {
        patch.pairWeightKg = previousSet.pairWeightKg;
      }
      if (set.pairReps === undefined && previousSet.pairReps !== undefined) {
        patch.pairReps = previousSet.pairReps;
      }

      if (hasFallbackPatch(patch)) {
        patches.push(patch);
      }
    }
  }

  return patches;
}
