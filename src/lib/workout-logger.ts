import type { Exercise, MuscleGroup, Routine, RoutineExercise, WorkoutSessionExercise } from "../types/domain";

export type WorkoutExerciseEntry = {
  item: RoutineExercise;
  name: string;
  primaryExerciseName: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  currentExercise: WorkoutSessionExercise;
  previousExercise?: WorkoutSessionExercise;
};

type BuildWorkoutExerciseEntriesInput = {
  routine?: Routine;
  exercisesById: Map<string, Exercise>;
  exerciseNamesById: Record<string, string>;
  currentExerciseByRoutineExerciseId: Map<string, WorkoutSessionExercise>;
  previousExerciseByRoutineExerciseId: Map<string, WorkoutSessionExercise>;
  fallbackExerciseName: string;
};

export function buildWorkoutExerciseEntries({
  routine,
  exercisesById,
  exerciseNamesById,
  currentExerciseByRoutineExerciseId,
  previousExerciseByRoutineExerciseId,
  fallbackExerciseName,
}: BuildWorkoutExerciseEntriesInput) {
  if (!routine) {
    return [];
  }

  return routine.exercises.flatMap((item) => {
    const exercise = exercisesById.get(item.exerciseId);
    const currentExercise = currentExerciseByRoutineExerciseId.get(item.id);
    const primaryExerciseName = exercise?.name ?? fallbackExerciseName;
    const pairExerciseId = item.sets.find((set) => set.technique === "superset" && set.pairExerciseId)?.pairExerciseId;
    const pairExerciseName = pairExerciseId ? exerciseNamesById[pairExerciseId] : null;

    if (!currentExercise) {
      return [];
    }

    const entry: WorkoutExerciseEntry = {
      item,
      name: pairExerciseName ? `${primaryExerciseName} + ${pairExerciseName}` : primaryExerciseName,
      primaryExerciseName,
      muscleGroup: exercise?.muscleGroup,
      description: exercise?.description,
      currentExercise,
      previousExercise: previousExerciseByRoutineExerciseId.get(item.id),
    };

    return [
      entry,
    ];
  });
}
