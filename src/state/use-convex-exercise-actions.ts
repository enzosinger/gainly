import { useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { MuscleGroup } from "../types/domain";
import { normalizeExerciseDescription } from "./exercise-store-helpers";
import { mapExerciseDoc } from "./convex-mappers";

export function useConvexExerciseActions() {
  const createExerciseMutation = useMutation(api.exercises.create);
  const updateExerciseMutation = useMutation(api.exercises.update);
  const deleteExerciseMutation = useMutation(api.exercises.remove);

  return useMemo(
    () => ({
      createExercise: async (input: { name: string; muscleGroup: MuscleGroup; description?: string }) => {
        const createdExercise = await createExerciseMutation({
          name: input.name,
          muscleGroup: input.muscleGroup,
          description: normalizeExerciseDescription(input.description),
        });
        if (!createdExercise) {
          throw new Error("Exercise could not be created.");
        }

        return mapExerciseDoc(createdExercise);
      },
      updateExercise: async (
        exerciseId: string,
        input: { name: string; muscleGroup: MuscleGroup; description?: string },
      ) => {
        const updatedExercise = await updateExerciseMutation({
          exerciseId: exerciseId as Id<"exercises">,
          name: input.name,
          muscleGroup: input.muscleGroup,
          description: normalizeExerciseDescription(input.description),
        });

        if (!updatedExercise) {
          throw new Error("Exercise could not be updated.");
        }

        return mapExerciseDoc(updatedExercise);
      },
      deleteExercise: async (exerciseId: string) => {
        await deleteExerciseMutation({
          exerciseId: exerciseId as Id<"exercises">,
        });
      },
    }),
    [createExerciseMutation, deleteExerciseMutation, updateExerciseMutation],
  );
}
