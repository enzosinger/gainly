import type { Exercise, Routine, RoutineCreationInput, RoutineExercise, TechniqueType } from "../types/domain";
import type { RepRangeInput } from "./gainly-store-types";

export function buildCreatedRoutine(currentRoutines: Routine[], input: RoutineCreationInput) {
  const trimmedName = input.name.trim();
  const baseId = `routine-${trimmedName.toLowerCase().replace(/\s+/g, "-")}`;
  const existingIds = new Set(currentRoutines.map((routine) => routine.id));
  let nextId = baseId;
  let suffix = 2;

  while (existingIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return {
    id: nextId,
    name: trimmedName,
    completed: false,
    deltaPercent: 0,
    isActive: true,
    exercises: [],
    updatedAt: Date.now(),
  };
}

export function buildRenamedRoutine(routine: Routine, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Routine name is required.");
  }

  return {
    ...routine,
    name: trimmedName,
    updatedAt: Date.now(),
  };
}

function normalizeRepRangeBound(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  return value > 0 ? value : undefined;
}

export function normalizeRepRange(input: RepRangeInput) {
  return {
    min: normalizeRepRangeBound(input.min),
    max: normalizeRepRangeBound(input.max),
  };
}

function buildNextSetForRoutineExercise(routineExercise: RoutineExercise) {
  const supersetSet = routineExercise.sets.find((set) => set.technique === "superset" && set.pairExerciseId);

  if (supersetSet) {
    return {
      id: `${routineExercise.id}-set-${routineExercise.sets.length + 1}`,
      technique: "superset" as const,
      pairExerciseId: supersetSet.pairExerciseId,
    };
  }

  return {
    id: `${routineExercise.id}-set-${routineExercise.sets.length + 1}`,
    technique: "normal" as const,
  };
}

export function appendSetToRoutineExercise(routine: Routine, routineExerciseId: string, technique?: TechniqueType) {
  return {
    ...routine,
    updatedAt: Date.now(),
    exercises: routine.exercises.map((routineExercise) => {
      if (routineExercise.id !== routineExerciseId) {
        return routineExercise;
      }

      const nextSetIndex = routineExercise.sets.length + 1;
      const nextSet = technique
        ? { id: `${routineExercise.id}-set-${nextSetIndex}`, technique }
        : buildNextSetForRoutineExercise(routineExercise);

      return {
        ...routineExercise,
        sets: [...routineExercise.sets, nextSet],
      };
    }),
  };
}

export function appendSupersetToRoutine(
  routine: Routine,
  exerciseId: string,
  pairExerciseId: string,
  existingExercises: Exercise[],
) {
  if (exerciseId === pairExerciseId) {
    throw new Error("Superset requires two different exercises.");
  }

  const hasPrimaryExercise = existingExercises.some((exercise) => exercise.id === exerciseId);
  const hasPairExercise = existingExercises.some((exercise) => exercise.id === pairExerciseId);

  if (!hasPrimaryExercise || !hasPairExercise) {
    throw new Error("Superset exercises could not be found.");
  }

  const nextIndex = routine.exercises.length + 1;
  return {
    ...routine,
    updatedAt: Date.now(),
    exercises: [
      ...routine.exercises,
      {
        id: `routine-item-${exerciseId}-${pairExerciseId}-${nextIndex}`,
        exerciseId,
        sets: [
          {
            id: `set-${exerciseId}-${pairExerciseId}-${nextIndex}-1`,
            technique: "superset" as const,
            pairExerciseId,
          },
        ],
      },
    ],
  };
}
