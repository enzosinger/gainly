import { useMemo, useState } from "react";
import { mockExercises } from "../data/mockExercises";
import type { Exercise, MuscleGroup } from "../types/domain";
import {
  buildCreatedExercise,
  buildUpdatedExercise,
  filterExercisesByMuscleGroup,
  normalizeExerciseMuscleGroup,
} from "./exercise-store-helpers";

export function useMockExercises() {
  const [exercises, setExercises] = useState(() => mockExercises.map(normalizeExerciseMuscleGroup));
  const [exerciseLibraryMuscleGroupFilter, setExerciseLibraryMuscleGroupFilter] = useState<MuscleGroup | "all">("all");
  const exerciseLibraryExercises = useMemo(
    () => filterExercisesByMuscleGroup(exercises, exerciseLibraryMuscleGroupFilter),
    [exerciseLibraryMuscleGroupFilter, exercises],
  );

  return {
    exercises,
    exerciseLibraryExercises,
    exerciseLibraryMuscleGroupFilter,
    setExerciseLibraryMuscleGroupFilter,
    createExercise: async (input: { name: string; muscleGroup: MuscleGroup; description?: string }) => {
      let createdExercise: Exercise | null = null;

      setExercises((current) => {
        createdExercise = buildCreatedExercise(current, input);
        return [...current, createdExercise];
      });

      if (!createdExercise) {
        throw new Error("Exercise could not be created.");
      }

      return createdExercise;
    },
    updateExercise: async (
      exerciseId: string,
      input: { name: string; muscleGroup: MuscleGroup; description?: string },
    ) => {
      let updatedExercise: Exercise | null = null;

      setExercises((current) => {
        updatedExercise = buildUpdatedExercise(current, exerciseId, input);
        return current.map((exercise) => (exercise.id === exerciseId ? (updatedExercise as Exercise) : exercise));
      });

      if (!updatedExercise) {
        throw new Error("Exercise could not be updated.");
      }

      return updatedExercise;
    },
    deleteExerciseFromLibrary: async (exerciseId: string) => {
      setExercises((current) => current.filter((exercise) => exercise.id !== exerciseId));
    },
  };
}
