import { useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { RoutineCreationInput } from "../types/domain";
import type { RepRangeInput } from "./gainly-store-types";
import { mapRoutineDoc } from "./convex-mappers";
import { normalizeRepRange } from "./routine-store-helpers";

export function useConvexRoutineActions() {
  const createRoutineMutation = useMutation(api.routines.create);
  const duplicateRoutineMutation = useMutation(api.routineActions.duplicate);
  const renameRoutineMutation = useMutation(api.routineActions.rename);
  const setRoutineActiveMutation = useMutation(api.routineActions.setActive);
  const deleteRoutineMutation = useMutation(api.routines.remove);
  const reorderRoutinesMutation = useMutation(api.routines.reorder);
  const addExerciseToRoutineMutation = useMutation(api.routines.addExercise);
  const addSetToRoutineExerciseMutation = useMutation(api.routines.addSet);
  const removeExerciseFromRoutineMutation = useMutation(api.routines.removeExercise);
  const addTechniqueToRoutineExerciseMutation = useMutation(api.routines.addTechnique);
  const addSupersetToRoutineMutation = useMutation(api.routines.addSuperset);
  const removeSetFromRoutineExerciseMutation = useMutation(api.routines.removeSet);
  const updateRepRangeMutation = useMutation(api.routines.updateRepRange);
  const updateWarmupSetsMutation = useMutation(api.routines.updateWarmupSets);
  const updateFeederSetsMutation = useMutation(api.routines.updateFeederSets);

  return useMemo(
    () => ({
      createRoutine: async (input: RoutineCreationInput) => {
        const createdRoutine = await createRoutineMutation({ name: input.name });
        if (!createdRoutine) throw new Error("Routine could not be created.");
        return mapRoutineDoc(createdRoutine);
      },
      duplicateRoutine: async (routineId: string) => {
        const duplicatedRoutine = await duplicateRoutineMutation({ routineId: routineId as Id<"routines"> });
        if (!duplicatedRoutine) throw new Error("Routine could not be duplicated.");
        return mapRoutineDoc(duplicatedRoutine);
      },
      renameRoutine: async (routineId: string, name: string) => {
        const renamedRoutine = await renameRoutineMutation({ routineId: routineId as Id<"routines">, name });
        if (!renamedRoutine) throw new Error("Routine could not be updated.");
        return mapRoutineDoc(renamedRoutine);
      },
      setRoutineActive: async (routineId: string, isActive: boolean) => {
        await setRoutineActiveMutation({ routineId: routineId as Id<"routines">, isActive });
      },
      deleteRoutine: async (routineId: string) => {
        await deleteRoutineMutation({ routineId: routineId as Id<"routines"> });
      },
      reorderRoutines: (nextIds: string[]) => {
        void reorderRoutinesMutation({ routineIds: nextIds as Id<"routines">[] });
      },
      addExerciseToRoutine: (routineId: string, exerciseId: string) => {
        void addExerciseToRoutineMutation({
          routineId: routineId as Id<"routines">,
          exerciseId: exerciseId as Id<"exercises">,
        });
      },
      addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => {
        void addSetToRoutineExerciseMutation({ routineId: routineId as Id<"routines">, routineExerciseId });
      },
      removeSetFromRoutineExercise: (routineId: string, routineExerciseId: string, setId: string) => {
        void removeSetFromRoutineExerciseMutation({ routineId: routineId as Id<"routines">, routineExerciseId, setId });
      },
      removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => {
        void removeExerciseFromRoutineMutation({ routineId: routineId as Id<"routines">, routineExerciseId });
      },
      addTechniqueToRoutineExercise: (
        routineId: string,
        routineExerciseId: string,
        technique: "backoff" | "cluster",
      ) => {
        void addTechniqueToRoutineExerciseMutation({ routineId: routineId as Id<"routines">, routineExerciseId, technique });
      },
      addSupersetToRoutine: (routineId: string, exerciseId: string, pairExerciseId: string) => {
        void addSupersetToRoutineMutation({
          routineId: routineId as Id<"routines">,
          exerciseId: exerciseId as Id<"exercises">,
          pairExerciseId: pairExerciseId as Id<"exercises">,
        });
      },
      updateRoutineExerciseRepRange: (routineId: string, routineExerciseId: string, repRange: RepRangeInput) => {
        const normalizedRange = normalizeRepRange(repRange);
        void updateRepRangeMutation({
          routineId: routineId as Id<"routines">,
          routineExerciseId,
          repRangeMin: normalizedRange.min ?? null,
          repRangeMax: normalizedRange.max ?? null,
        });
      },
      updateRoutineExerciseWarmupSets: (routineId: string, routineExerciseId: string, count: number) => {
        void updateWarmupSetsMutation({ routineId: routineId as Id<"routines">, routineExerciseId, warmupSets: count });
      },
      updateRoutineExerciseFeederSets: (routineId: string, routineExerciseId: string, count: number) => {
        void updateFeederSetsMutation({ routineId: routineId as Id<"routines">, routineExerciseId, feederSets: count });
      },
    }),
    [
      addExerciseToRoutineMutation,
      addSetToRoutineExerciseMutation,
      addTechniqueToRoutineExerciseMutation,
      addSupersetToRoutineMutation,
      createRoutineMutation,
      deleteRoutineMutation,
      duplicateRoutineMutation,
      removeExerciseFromRoutineMutation,
      removeSetFromRoutineExerciseMutation,
      renameRoutineMutation,
      reorderRoutinesMutation,
      setRoutineActiveMutation,
      updateFeederSetsMutation,
      updateRepRangeMutation,
      updateWarmupSetsMutation,
    ],
  );
}
