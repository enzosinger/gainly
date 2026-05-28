import { normalizeExerciseMuscleGroupValue } from "./exercise-store-helpers";
import type { Exercise, Routine, RoutineExercise, RoutineProgressSummary } from "../types/domain";
import type { Id } from "../../convex/_generated/dataModel";

export function mapExerciseDoc(exercise: {
  _id: Id<"exercises">;
  name: string;
  muscleGroup: unknown;
  description?: string;
}): Exercise {
  return {
    id: exercise._id,
    name: exercise.name,
    muscleGroup: normalizeExerciseMuscleGroupValue(exercise.muscleGroup),
    description: exercise.description,
  };
}

export function mapRoutineDoc(routine: {
  _id: Id<"routines">;
  name: string;
  completed: boolean;
  deltaPercent: number;
  isActive?: boolean;
  exercises: RoutineExercise[];
  updatedAt?: number;
}, progressSummary?: RoutineProgressSummary): Routine {
  return {
    id: routine._id,
    name: routine.name,
    completed: routine.completed,
    deltaPercent: progressSummary?.deltaPercent ?? routine.deltaPercent,
    isActive: routine.isActive ?? true,
    hasProgressHistory: progressSummary?.hasHistory ?? false,
    exercises: routine.exercises.map((ex) => ({
      ...ex,
      warmupSets: ex.warmupSets ?? 0,
      feederSets: ex.feederSets ?? 0,
    })),
    updatedAt: routine.updatedAt,
  };
}
