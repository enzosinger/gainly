import type {
  Exercise,
  MuscleGroup,
  Routine,
  RoutineCreationInput,
  TechniqueType,
} from "../types/domain";

export type RepRangeInput = {
  min?: number;
  max?: number;
};

export type GainlyStoreValue = {
  viewer: { id: string; name: string | null; email: string | null } | null;
  isLoading: boolean;
  exercises: Exercise[];
  exerciseLibraryExercises: Exercise[];
  exerciseLibraryMuscleGroupFilter: MuscleGroup | "all";
  setExerciseLibraryMuscleGroupFilter: (muscleGroup: MuscleGroup | "all") => void;
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  createRoutine: (input: RoutineCreationInput) => Promise<Routine>;
  duplicateRoutine: (routineId: string) => Promise<Routine>;
  renameRoutine: (routineId: string, name: string) => Promise<Routine>;
  setRoutineActive: (routineId: string, isActive: boolean) => Promise<void>;
  deleteRoutine: (routineId: string) => Promise<void>;
  reorderRoutines: (nextIds: string[]) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => void;
  removeSetFromRoutineExercise: (routineId: string, routineExerciseId: string, setId: string) => void;
  removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => void;
  addTechniqueToRoutineExercise: (
    routineId: string,
    routineExerciseId: string,
    technique: Exclude<TechniqueType, "normal" | "superset">,
  ) => void;
  addSupersetToRoutine: (routineId: string, exerciseId: string, pairExerciseId: string) => void;
  updateRoutineExerciseRepRange: (routineId: string, routineExerciseId: string, repRange: RepRangeInput) => void;
  updateRoutineExerciseWarmupSets: (routineId: string, routineExerciseId: string, count: number) => void;
  updateRoutineExerciseFeederSets: (routineId: string, routineExerciseId: string, count: number) => void;
  createExercise: (input: { name: string; muscleGroup: MuscleGroup; description?: string }) => Promise<Exercise>;
  updateExercise: (
    exerciseId: string,
    input: { name: string; muscleGroup: MuscleGroup; description?: string },
  ) => Promise<Exercise>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  signOut: () => Promise<void>;
};
