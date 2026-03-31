import { createContext, useContext, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { mockExercises } from "../data/mockExercises";
import { mockRoutines } from "../data/mockRoutines";
import type {
  Exercise,
  Routine,
  RoutineCreationInput,
  RoutineProgressSummary,
  TechniqueType,
} from "../types/domain";
import type { MuscleGroup, RoutineExercise } from "../types/domain";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type GainlyStoreValue = {
  viewer: { id: string; name: string | null; email: string | null } | null;
  exercises: Exercise[];
  exerciseLibraryExercises: Exercise[];
  exerciseLibraryMuscleGroupFilter: MuscleGroup | "all";
  setExerciseLibraryMuscleGroupFilter: (muscleGroup: MuscleGroup | "all") => void;
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  createRoutine: (input: RoutineCreationInput) => Promise<Routine>;
  deleteRoutine: (routineId: string) => Promise<void>;
  reorderRoutines: (nextIds: string[]) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => void;
  removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => void;
  addTechniqueToRoutineExercise: (
    routineId: string,
    routineExerciseId: string,
    technique: Exclude<TechniqueType, "normal">,
  ) => void;
  createExercise: (input: { name: string; muscleGroup: MuscleGroup; description?: string }) => Promise<Exercise>;
  updateExercise: (
    exerciseId: string,
    input: { name: string; muscleGroup: MuscleGroup; description?: string },
  ) => Promise<Exercise>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

function normalizeExerciseDescription(description?: string) {
  const trimmedDescription = description?.trim();
  return trimmedDescription ? trimmedDescription : undefined;
}

function buildCreatedExercise(
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
    muscleGroup: input.muscleGroup,
    description: normalizeExerciseDescription(input.description),
  };
}

function buildUpdatedExercise(
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
    muscleGroup: input.muscleGroup,
    description,
  };
}

function buildCreatedRoutine(currentRoutines: Routine[], input: RoutineCreationInput) {
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
    exercises: [],
    updatedAt: Date.now(),
  };
}

function filterExercisesByMuscleGroup(exercises: Exercise[], muscleGroup: MuscleGroup | "all") {
  if (muscleGroup === "all") {
    return exercises;
  }

  return exercises.filter((exercise) => exercise.muscleGroup === muscleGroup);
}

function appendSetToRoutineExercise(
  routine: Routine,
  routineExerciseId: string,
  technique: TechniqueType,
) {
  return {
    ...routine,
    updatedAt: Date.now(),
    exercises: routine.exercises.map((routineExercise) => {
      if (routineExercise.id !== routineExerciseId) {
        return routineExercise;
      }

      const nextSetIndex = routineExercise.sets.length + 1;
      return {
        ...routineExercise,
        sets: [
          ...routineExercise.sets,
          {
            id: `${routineExercise.id}-set-${nextSetIndex}`,
            technique,
          },
        ],
      };
    }),
  };
}

export function GainlyStoreProvider({ children }: { children: React.ReactNode }) {
  const [exercises, setExercises] = useState(mockExercises);
  const [routines, setRoutines] = useState(mockRoutines);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [exerciseLibraryMuscleGroupFilter, setExerciseLibraryMuscleGroupFilter] = useState<MuscleGroup | "all">("all");
  const exerciseLibraryExercises = useMemo(
    () => filterExercisesByMuscleGroup(exercises, exerciseLibraryMuscleGroupFilter),
    [exerciseLibraryMuscleGroupFilter, exercises],
  );

  const value = useMemo(
    () => ({
      viewer: null,
      exercises,
      exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter,
      setExerciseLibraryMuscleGroupFilter,
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
      createRoutine: async (input: RoutineCreationInput) => {
        const createdRoutine = buildCreatedRoutine(routines, input);
        setRoutines((current) => [...current, createdRoutine]);
        return createdRoutine;
      },
      deleteRoutine: async (routineId: string) => {
        setRoutines((current) => current.filter((routine) => routine.id !== routineId));
      },
      reorderRoutines: (nextIds: string[]) => {
        setRoutines((current) => {
          const routinesById = new Map(current.map((routine) => [routine.id, routine]));
          const seenIds = new Set<string>();
          const reordered = nextIds
            .map((id) => routinesById.get(id))
            .filter((routine): routine is Routine => routine !== undefined)
            .map((routine) => {
              seenIds.add(routine.id);
              return routine;
            });

          const untouched = current.filter((routine) => !seenIds.has(routine.id));
          return [...reordered, ...untouched];
        });
      },
      addExerciseToRoutine: (routineId: string, exerciseId: string) => {
        setRoutines((current) =>
          current.map((routine) => {
            if (routine.id !== routineId) {
              return routine;
            }

            const nextItem: RoutineExercise = {
              id: `routine-item-${exerciseId}-${routine.exercises.length + 1}`,
              exerciseId,
              sets: [{ id: `set-${exerciseId}-${routine.exercises.length + 1}-1`, technique: "normal" }],
            };

            return {
              ...routine,
              updatedAt: Date.now(),
              exercises: [...routine.exercises, nextItem],
            };
          }),
        );
      },
      addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => {
        setRoutines((current) =>
          current.map((routine) => {
            if (routine.id !== routineId) {
              return routine;
            }

            return appendSetToRoutineExercise(routine, routineExerciseId, "normal");
          }),
        );
      },
      removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => {
        setRoutines((current) =>
          current.map((routine) => {
            if (routine.id !== routineId) {
              return routine;
            }

            return {
              ...routine,
              updatedAt: Date.now(),
              exercises: routine.exercises.filter((routineExercise) => routineExercise.id !== routineExerciseId),
            };
          }),
        );
      },
      addTechniqueToRoutineExercise: (
        routineId: string,
        routineExerciseId: string,
        technique: Exclude<TechniqueType, "normal">,
      ) => {
        setRoutines((current) =>
          current.map((routine) => {
            if (routine.id !== routineId) {
              return routine;
            }

            return appendSetToRoutineExercise(routine, routineExerciseId, technique);
          }),
        );
      },
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
          return current.map((exercise) => (exercise.id === exerciseId ? updatedExercise as Exercise : exercise));
        });

        if (!updatedExercise) {
          throw new Error("Exercise could not be updated.");
        }

        return updatedExercise;
      },
      deleteExercise: async (exerciseId: string) => {
        setExercises((current) => current.filter((exercise) => exercise.id !== exerciseId));
        setRoutines((current) =>
          current.map((routine) => {
            const nextExercises = routine.exercises.filter((routineExercise) => routineExercise.exerciseId !== exerciseId);
            if (nextExercises.length === routine.exercises.length) {
              return routine;
            }
            return {
              ...routine,
              updatedAt: Date.now(),
              exercises: nextExercises,
            };
          }),
        );
      },
      signOut: async () => {},
    }),
    [
      expandedExerciseId,
      exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter,
      exercises,
      routines,
    ],
  );

  return <GainlyStoreContext.Provider value={value}>{children}</GainlyStoreContext.Provider>;
}

export function useGainlyStore() {
  const value = useContext(GainlyStoreContext);
  if (!value) {
    throw new Error("useGainlyStore must be used within GainlyStoreProvider");
  }
  return value;
}

function mapExerciseDoc(exercise: {
  _id: Id<"exercises">;
  name: string;
  muscleGroup: MuscleGroup;
  description?: string;
}): Exercise {
  return {
    id: exercise._id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    description: exercise.description,
  };
}

function mapRoutineDoc(routine: {
  _id: Id<"routines">;
  name: string;
  completed: boolean;
  deltaPercent: number;
  exercises: RoutineExercise[];
  updatedAt?: number;
}, progressSummary?: RoutineProgressSummary): Routine {
  return {
    id: routine._id,
    name: routine.name,
    completed: routine.completed,
    deltaPercent: progressSummary?.deltaPercent ?? routine.deltaPercent,
    hasProgressHistory: progressSummary?.hasHistory ?? false,
    exercises: routine.exercises,
    updatedAt: routine.updatedAt,
  };
}

export function ConvexGainlyStoreProvider({ children }: { children: React.ReactNode }) {
  const viewer = useQuery(api.app.viewer, {});
  const exerciseDocs = useQuery(api.exercises.list, {}) ?? [];
  const routineDocs = useQuery(api.routines.list, {}) ?? [];
  const progressSummaries = useQuery(api.workouts.progressSummaries, {}) ?? [];
  const createRoutineMutation = useMutation(api.routines.create);
  const deleteRoutineMutation = useMutation(api.routines.remove);
  const createExerciseMutation = useMutation(api.exercises.create);
  const updateExerciseMutation = useMutation(api.exercises.update);
  const deleteExerciseMutation = useMutation(api.exercises.remove);
  const reorderRoutinesMutation = useMutation(api.routines.reorder);
  const addExerciseToRoutineMutation = useMutation(api.routines.addExercise);
  const addSetToRoutineExerciseMutation = useMutation(api.routines.addSet);
  const removeExerciseFromRoutineMutation = useMutation(api.routines.removeExercise);
  const addTechniqueToRoutineExerciseMutation = useMutation(api.routines.addTechnique);
  const { signOut } = useAuthActions();
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [exerciseLibraryMuscleGroupFilter, setExerciseLibraryMuscleGroupFilter] = useState<MuscleGroup | "all">("all");
  const filteredExerciseDocs =
    useQuery(
      api.exercises.list,
      exerciseLibraryMuscleGroupFilter === "all"
        ? "skip"
        : { muscleGroup: exerciseLibraryMuscleGroupFilter },
    ) ?? [];

  const exercises = useMemo(() => exerciseDocs.map(mapExerciseDoc), [exerciseDocs]);
  const exerciseLibraryExercises = useMemo(
    () =>
      exerciseLibraryMuscleGroupFilter === "all"
        ? exercises
        : filteredExerciseDocs.map(mapExerciseDoc),
    [exerciseLibraryMuscleGroupFilter, exercises, filteredExerciseDocs],
  );
  const progressSummaryByRoutineId = useMemo(
    () => new Map(progressSummaries.map((summary) => [summary.routineId, summary])),
    [progressSummaries],
  );
  const routines = useMemo(
    () => routineDocs.map((routine) => mapRoutineDoc(routine, progressSummaryByRoutineId.get(routine._id))),
    [progressSummaryByRoutineId, routineDocs],
  );

  const value = useMemo<GainlyStoreValue>(
    () => ({
      viewer: viewer ? { id: viewer.id, name: viewer.name, email: viewer.email } : null,
      exercises,
      exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter,
      setExerciseLibraryMuscleGroupFilter,
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
      createRoutine: async (input: RoutineCreationInput) => {
        const createdRoutine = await createRoutineMutation({
          name: input.name,
        });

        if (!createdRoutine) {
          throw new Error("Routine could not be created.");
        }

        return mapRoutineDoc(createdRoutine);
      },
      deleteRoutine: async (routineId: string) => {
        await deleteRoutineMutation({
          routineId: routineId as Id<"routines">,
        });
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
        void addSetToRoutineExerciseMutation({
          routineId: routineId as Id<"routines">,
          routineExerciseId,
        });
      },
      removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => {
        void removeExerciseFromRoutineMutation({
          routineId: routineId as Id<"routines">,
          routineExerciseId,
        });
      },
      addTechniqueToRoutineExercise: (routineId: string, routineExerciseId: string, technique) => {
        void addTechniqueToRoutineExerciseMutation({
          routineId: routineId as Id<"routines">,
          routineExerciseId,
          technique,
        });
      },
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
      signOut,
    }),
    [
      addExerciseToRoutineMutation,
      addSetToRoutineExerciseMutation,
      addTechniqueToRoutineExerciseMutation,
      createExerciseMutation,
      createRoutineMutation,
      exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter,
      deleteExerciseMutation,
      deleteRoutineMutation,
      expandedExerciseId,
      exercises,
      removeExerciseFromRoutineMutation,
      reorderRoutinesMutation,
      routines,
      setExerciseLibraryMuscleGroupFilter,
      signOut,
      viewer,
      updateExerciseMutation,
    ],
  );

  return <GainlyStoreContext.Provider value={value}>{children}</GainlyStoreContext.Provider>;
}
