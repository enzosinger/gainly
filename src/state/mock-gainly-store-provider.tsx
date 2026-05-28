import { useMemo, useState } from "react";
import { GainlyStoreContext } from "./gainly-store-context";
import { useMockExercises } from "./use-mock-exercises";
import { useMockRoutines } from "./use-mock-routines";

export function GainlyStoreProvider({ children }: { children: React.ReactNode }) {
  const exerciseStore = useMockExercises();
  const routineStore = useMockRoutines(exerciseStore.exercises);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      viewer: null,
      isLoading: false,
      exercises: exerciseStore.exercises,
      exerciseLibraryExercises: exerciseStore.exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter: exerciseStore.exerciseLibraryMuscleGroupFilter,
      setExerciseLibraryMuscleGroupFilter: exerciseStore.setExerciseLibraryMuscleGroupFilter,
      routines: routineStore.routines,
      expandedExerciseId,
      setExpandedExerciseId,
      createRoutine: routineStore.createRoutine,
      duplicateRoutine: routineStore.duplicateRoutine,
      renameRoutine: routineStore.renameRoutine,
      setRoutineActive: routineStore.setRoutineActive,
      deleteRoutine: routineStore.deleteRoutine,
      reorderRoutines: routineStore.reorderRoutines,
      addExerciseToRoutine: routineStore.addExerciseToRoutine,
      addSetToRoutineExercise: routineStore.addSetToRoutineExercise,
      removeSetFromRoutineExercise: routineStore.removeSetFromRoutineExercise,
      removeExerciseFromRoutine: routineStore.removeExerciseFromRoutine,
      addTechniqueToRoutineExercise: routineStore.addTechniqueToRoutineExercise,
      addSupersetToRoutine: routineStore.addSupersetToRoutine,
      updateRoutineExerciseRepRange: routineStore.updateRoutineExerciseRepRange,
      updateRoutineExerciseWarmupSets: routineStore.updateRoutineExerciseWarmupSets,
      updateRoutineExerciseFeederSets: routineStore.updateRoutineExerciseFeederSets,
      createExercise: exerciseStore.createExercise,
      updateExercise: exerciseStore.updateExercise,
      deleteExercise: async (exerciseId: string) => {
        await exerciseStore.deleteExerciseFromLibrary(exerciseId);
        routineStore.deleteExerciseFromRoutines(exerciseId);
      },
      signOut: async () => {},
    }),
    [exerciseStore, expandedExerciseId, routineStore],
  );

  return <GainlyStoreContext.Provider value={value}>{children}</GainlyStoreContext.Provider>;
}
