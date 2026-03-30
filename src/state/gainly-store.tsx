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
  createExercise: (input: { name: string; muscleGroup: MuscleGroup }) => Promise<Exercise>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

function buildCreatedExercise(currentExercises: Exercise[], input: { name: string; muscleGroup: MuscleGroup }) {
  const trimmedName = input.name.trim();
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
    weekday: input.weekday ?? "Monday",
    completed: false,
    deltaPercent: 0,
    exercises: [],
  };
}

function appendSetToRoutineExercise(
  routine: Routine,
  routineExerciseId: string,
  technique: TechniqueType,
) {
  return {
    ...routine,
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

  const value = useMemo(
    () => ({
      viewer: null,
      exercises,
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
      createExercise: async (input: { name: string; muscleGroup: MuscleGroup }) => {
        const createdExercise = buildCreatedExercise(exercises, input);
        setExercises((current) => [...current, createdExercise]);
        return createdExercise;
      },
      deleteExercise: async (exerciseId: string) => {
        setExercises((current) => current.filter((exercise) => exercise.id !== exerciseId));
        setRoutines((current) =>
          current.map((routine) => ({
            ...routine,
            exercises: routine.exercises.filter((routineExercise) => routineExercise.exerciseId !== exerciseId),
          })),
        );
      },
      signOut: async () => {},
    }),
    [expandedExerciseId, exercises, routines],
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
}): Exercise {
  return {
    id: exercise._id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
  };
}

function mapRoutineDoc(routine: {
  _id: Id<"routines">;
  name: string;
  weekday: string;
  completed: boolean;
  deltaPercent: number;
  exercises: RoutineExercise[];
}, progressSummary?: RoutineProgressSummary): Routine {
  return {
    id: routine._id,
    name: routine.name,
    weekday: routine.weekday,
    completed: routine.completed,
    deltaPercent: progressSummary?.deltaPercent ?? routine.deltaPercent,
    hasProgressHistory: progressSummary?.hasHistory ?? false,
    exercises: routine.exercises,
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
  const deleteExerciseMutation = useMutation(api.exercises.remove);
  const reorderRoutinesMutation = useMutation(api.routines.reorder);
  const addExerciseToRoutineMutation = useMutation(api.routines.addExercise);
  const addSetToRoutineExerciseMutation = useMutation(api.routines.addSet);
  const removeExerciseFromRoutineMutation = useMutation(api.routines.removeExercise);
  const addTechniqueToRoutineExerciseMutation = useMutation(api.routines.addTechnique);
  const { signOut } = useAuthActions();
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const exercises = useMemo(() => exerciseDocs.map(mapExerciseDoc), [exerciseDocs]);
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
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
      createRoutine: async (input: RoutineCreationInput) => {
        const createdRoutine = await createRoutineMutation({
          name: input.name,
          weekday: input.weekday,
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
      createExercise: async (input: { name: string; muscleGroup: MuscleGroup }) => {
        const createdExercise = await createExerciseMutation(input);
        if (!createdExercise) {
          throw new Error("Exercise could not be created.");
        }

        return mapExerciseDoc(createdExercise);
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
      deleteExerciseMutation,
      deleteRoutineMutation,
      expandedExerciseId,
      exercises,
      removeExerciseFromRoutineMutation,
      reorderRoutinesMutation,
      routines,
      signOut,
      viewer,
    ],
  );

  return <GainlyStoreContext.Provider value={value}>{children}</GainlyStoreContext.Provider>;
}
