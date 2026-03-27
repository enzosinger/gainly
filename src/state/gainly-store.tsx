import { createContext, useContext, useMemo, useState } from "react";
import { mockExercises } from "../data/mockExercises";
import { mockRoutines } from "../data/mockRoutines";
import type { Exercise, Routine } from "../types/domain";
import type { MuscleGroup, RoutineExercise } from "../types/domain";

type GainlyStoreValue = {
  exercises: Exercise[];
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  reorderRoutines: (nextIds: string[]) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  createExercise: (input: { name: string; muscleGroup: MuscleGroup; unilateral: boolean }) => Exercise;
};

const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

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
      createExercise: (input: { name: string; muscleGroup: MuscleGroup; unilateral: boolean }) => {
        const id = `ex-${input.name.toLowerCase().trim().replace(/\s+/g, "-")}`;
        const nextExercise: Exercise = {
          id,
          name: input.name.trim(),
          muscleGroup: input.muscleGroup,
          unilateral: input.unilateral,
        };

        setExercises((current) => [...current, nextExercise]);
        return nextExercise;
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
