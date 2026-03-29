import { createContext, useContext, useMemo, useState } from "react";
import { mockExercises } from "../data/mockExercises";
import { mockRoutines } from "../data/mockRoutines";
import type { Exercise, Routine, TechniqueType } from "../types/domain";
import type { MuscleGroup, RoutineExercise } from "../types/domain";

type GainlyStoreValue = {
  exercises: Exercise[];
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  reorderRoutines: (nextIds: string[]) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => void;
  removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => void;
  addTechniqueToRoutineExercise: (
    routineId: string,
    routineExerciseId: string,
    technique: Exclude<TechniqueType, "normal">,
  ) => void;
  createExercise: (input: { name: string; muscleGroup: MuscleGroup }) => Exercise;
};

const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

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
      exercises,
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
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
      createExercise: (input: { name: string; muscleGroup: MuscleGroup }) => {
        const trimmedName = input.name.trim();
        const baseId = `ex-${trimmedName.toLowerCase().replace(/\s+/g, "-")}`;
        let createdExercise: Exercise = {
          id: baseId,
          name: trimmedName,
          muscleGroup: input.muscleGroup,
        };

        setExercises((current) => {
          const existingIds = new Set(current.map((exercise) => exercise.id));
          let nextId = baseId;
          let suffix = 2;

          while (existingIds.has(nextId)) {
            nextId = `${baseId}-${suffix}`;
            suffix += 1;
          }

          createdExercise = {
            ...createdExercise,
            id: nextId,
          };

          return [...current, createdExercise];
        });
        return createdExercise;
      },
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
