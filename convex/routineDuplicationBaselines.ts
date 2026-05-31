import type { RoutineExerciseSetStructure, RoutineExerciseStructure, WorkoutSessionExerciseStructure } from "./structureTypes";

type SetValueFields = Pick<RoutineExerciseSetStructure, "weightKg" | "reps" | "pairWeightKg" | "pairReps">;

function buildSetValueKey(routineExerciseId: string, setId: string) {
  return `${routineExerciseId}:${setId}`;
}

function hasSetValue(values: SetValueFields) {
  return (
    values.weightKg !== undefined ||
    values.reps !== undefined ||
    values.pairWeightKg !== undefined ||
    values.pairReps !== undefined
  );
}

function buildPreviousSetValues(previousExercises: WorkoutSessionExerciseStructure[]) {
  const valuesBySetKey = new Map<string, SetValueFields>();

  for (const exercise of previousExercises) {
    for (const set of exercise.sets) {
      const values = {
        weightKg: set.weightKg,
        reps: set.reps,
        pairWeightKg: set.pairWeightKg,
        pairReps: set.pairReps,
      };

      if (hasSetValue(values)) {
        valuesBySetKey.set(buildSetValueKey(exercise.routineExerciseId, set.templateSetId), values);
      }
    }
  }

  return valuesBySetKey;
}

function copySetForDuplicate(
  routineExerciseId: string,
  set: RoutineExerciseSetStructure,
  previousSetValues: Map<string, SetValueFields>,
): RoutineExerciseSetStructure {
  const previousValues = previousSetValues.get(buildSetValueKey(routineExerciseId, set.id));

  return {
    id: set.id,
    technique: set.technique,
    weightKg: previousValues?.weightKg ?? set.weightKg,
    reps: previousValues?.reps ?? set.reps,
    backoffPercent: set.backoffPercent,
    clusterBlocks: set.clusterBlocks,
    clusterRepRange: set.clusterRepRange,
    pairExerciseId: set.pairExerciseId,
    pairWeightKg: previousValues?.pairWeightKg ?? set.pairWeightKg,
    pairReps: previousValues?.pairReps ?? set.pairReps,
  };
}

function copyExerciseForDuplicate(
  exercise: RoutineExerciseStructure,
  previousSetValues: Map<string, SetValueFields>,
): RoutineExerciseStructure {
  return {
    id: exercise.id,
    exerciseId: exercise.exerciseId,
    sets: exercise.sets.map((set) => copySetForDuplicate(exercise.id, set, previousSetValues)),
    repRangeMin: exercise.repRangeMin,
    repRangeMax: exercise.repRangeMax,
    warmupSets: exercise.warmupSets,
    feederSets: exercise.feederSets,
  };
}

export function copyExercisesForDuplicateWithBaseline(
  sourceExercises: RoutineExerciseStructure[],
  previousExercises: WorkoutSessionExerciseStructure[] = [],
) {
  const previousSetValues = buildPreviousSetValues(previousExercises);
  return sourceExercises.map((exercise) => copyExerciseForDuplicate(exercise, previousSetValues));
}
