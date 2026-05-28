import type { Routine, RoutineExercise, SetEntry } from "../types/domain";

function buildDuplicateName(sourceName: string, routines: Routine[]) {
  const baseName = `${sourceName} copy`;
  const existingNames = new Set(routines.map((routine) => routine.name));
  let nextName = baseName;
  let suffix = 2;

  while (existingNames.has(nextName)) {
    nextName = `${baseName} ${suffix}`;
    suffix += 1;
  }

  return nextName;
}

function buildDuplicateId(name: string, routines: Routine[]) {
  const baseId = `routine-${name.toLowerCase().replace(/\s+/g, "-")}`;
  const existingIds = new Set(routines.map((routine) => routine.id));
  let nextId = baseId;
  let suffix = 2;

  while (existingIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return nextId;
}

function copySetForDuplicate(set: SetEntry): SetEntry {
  return {
    id: set.id,
    technique: set.technique,
    backoffPercent: set.backoffPercent,
    clusterBlocks: set.clusterBlocks,
    clusterRepRange: set.clusterRepRange,
    pairExerciseId: set.pairExerciseId,
  };
}

function copyExerciseForDuplicate(exercise: RoutineExercise): RoutineExercise {
  return {
    id: exercise.id,
    exerciseId: exercise.exerciseId,
    sets: exercise.sets.map(copySetForDuplicate),
    repRangeMin: exercise.repRangeMin,
    repRangeMax: exercise.repRangeMax,
    warmupSets: exercise.warmupSets,
    feederSets: exercise.feederSets,
  };
}

export function duplicateRoutineDraft(routines: Routine[], routineId: string) {
  const sourceRoutine = routines.find((routine) => routine.id === routineId);

  if (!sourceRoutine) {
    throw new Error("Routine could not be duplicated.");
  }

  const name = buildDuplicateName(sourceRoutine.name, routines);

  return {
    id: buildDuplicateId(name, routines),
    name,
    completed: false,
    deltaPercent: 0,
    hasProgressHistory: false,
    isActive: true,
    exercises: sourceRoutine.exercises.map(copyExerciseForDuplicate),
    updatedAt: Date.now(),
  };
}
