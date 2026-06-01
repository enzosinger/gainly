import type { Routine } from "../types/domain";

export function orderRoutineExercisesByIds(routine: Routine, nextIds: string[]): Routine {
  if (routine.exercises.length !== nextIds.length) {
    throw new Error("Routine exercise order must include every exercise.");
  }

  const exercisesById = new Map(routine.exercises.map((exercise) => [exercise.id, exercise]));
  const seenIds = new Set<string>();

  const exercises = nextIds.map((id) => {
    if (seenIds.has(id)) {
      throw new Error("Routine exercise order cannot contain duplicates.");
    }

    const exercise = exercisesById.get(id);
    if (!exercise) {
      throw new Error("Routine exercise order contains an unknown exercise.");
    }

    seenIds.add(id);
    return exercise;
  });

  return {
    ...routine,
    exercises,
    updatedAt: Date.now(),
  };
}
