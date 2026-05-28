import { normalizeMuscleGroup } from "../../lib/muscle-groups";
import type { Exercise, MuscleGroup } from "../types/domain";

export function normalizeExerciseDescription(description?: string) {
  const trimmedDescription = description?.trim();
  return trimmedDescription ? trimmedDescription : undefined;
}

export function normalizeExerciseMuscleGroup(exercise: Exercise): Exercise {
  return {
    ...exercise,
    muscleGroup: normalizeMuscleGroup(exercise.muscleGroup),
  };
}

export function normalizeExerciseMuscleGroupValue(muscleGroup: unknown): MuscleGroup {
  if (typeof muscleGroup !== "string") {
    return "quads";
  }

  return normalizeMuscleGroup(muscleGroup as MuscleGroup);
}

export function filterExercisesByMuscleGroup(exercises: Exercise[], muscleGroup: MuscleGroup | "all") {
  if (muscleGroup === "all") {
    return exercises;
  }

  return exercises.filter((exercise) => exercise.muscleGroup === muscleGroup);
}

export function buildCreatedExercise(
  currentExercises: Exercise[],
  input: { name: string; muscleGroup: MuscleGroup; description?: string },
) {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    throw new Error("Exercise name is required.");
  }

  const baseId = `ex-${trimmedName.toLowerCase().replace(/\s+/g, "-")}`;
  const existingIds = new Set(currentExercises.map((exercise) => exercise.id));
  let nextId = baseId;
  let suffix = 2;

  while (existingIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return {
    id: nextId,
    name: trimmedName,
    muscleGroup: normalizeMuscleGroup(input.muscleGroup),
    description: normalizeExerciseDescription(input.description),
  };
}

export function buildUpdatedExercise(
  currentExercises: Exercise[],
  exerciseId: string,
  input: { name: string; muscleGroup: MuscleGroup; description?: string },
) {
  const trimmedName = input.name.trim();
  const description = normalizeExerciseDescription(input.description);
  const existingExercise = currentExercises.find((exercise) => exercise.id === exerciseId);

  if (!existingExercise) {
    throw new Error("Exercise could not be updated.");
  }

  if (!trimmedName) {
    throw new Error("Exercise name is required.");
  }

  const duplicateExercise = currentExercises.find(
    (exercise) => exercise.id !== exerciseId && exercise.name === trimmedName,
  );

  if (duplicateExercise) {
    throw new Error("Exercise name already exists.");
  }

  return {
    ...existingExercise,
    name: trimmedName,
    muscleGroup: normalizeMuscleGroup(input.muscleGroup),
    description,
  };
}
