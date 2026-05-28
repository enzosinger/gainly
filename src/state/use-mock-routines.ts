import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { mockRoutines } from "../data/mockRoutines";
import { duplicateRoutineDraft } from "../lib/routine-duplication";
import { orderRoutinesByIds } from "../lib/routine-ordering";
import type { Exercise, Routine, RoutineCreationInput, RoutineExercise, TechniqueType } from "../types/domain";
import type { RepRangeInput } from "./gainly-store-types";
import {
  appendSetToRoutineExercise,
  appendSupersetToRoutine,
  buildCreatedRoutine,
  buildRenamedRoutine,
  normalizeRepRange,
} from "./routine-store-helpers";

export function useMockRoutines(exercises: Exercise[]) {
  const [routines, setRoutines] = useState(mockRoutines);

  return {
    routines,
    createRoutine: async (input: RoutineCreationInput) => {
      let createdRoutine: Routine | null = null;
      setRoutines((current) => {
        createdRoutine = buildCreatedRoutine(current, input);
        return [...current, createdRoutine];
      });
      if (!createdRoutine) throw new Error("Routine could not be created.");
      return createdRoutine;
    },
    duplicateRoutine: async (routineId: string) => {
      let duplicatedRoutine: Routine | null = null;
      setRoutines((current) => {
        duplicatedRoutine = duplicateRoutineDraft(current, routineId);
        return [...current, duplicatedRoutine];
      });
      if (!duplicatedRoutine) throw new Error("Routine could not be duplicated.");
      return duplicatedRoutine;
    },
    renameRoutine: async (routineId: string, name: string) => {
      let renamedRoutine: Routine | null = null;
      setRoutines((current) => {
        const routine = current.find((item) => item.id === routineId);
        if (!routine) throw new Error("Routine could not be updated.");
        renamedRoutine = buildRenamedRoutine(routine, name);
        return current.map((item) => (item.id === routineId ? (renamedRoutine as Routine) : item));
      });
      if (!renamedRoutine) throw new Error("Routine could not be updated.");
      return renamedRoutine;
    },
    setRoutineActive: async (routineId: string, isActive: boolean) => {
      setRoutines((current) =>
        current.map((routine) => (routine.id === routineId ? { ...routine, isActive, updatedAt: Date.now() } : routine)),
      );
    },
    deleteRoutine: async (routineId: string) => {
      setRoutines((current) => current.filter((routine) => routine.id !== routineId));
    },
    reorderRoutines: (nextIds: string[]) => {
      setRoutines((current) => orderRoutinesByIds(current, nextIds));
    },
    addExerciseToRoutine: (routineId: string, exerciseId: string) => {
      setRoutines((current) =>
        current.map((routine) => {
          if (routine.id !== routineId) return routine;
          const nextItem: RoutineExercise = {
            id: `routine-item-${exerciseId}-${routine.exercises.length + 1}`,
            exerciseId,
            sets: [{ id: `set-${exerciseId}-${routine.exercises.length + 1}-1`, technique: "normal" }],
          };
          return { ...routine, updatedAt: Date.now(), exercises: [...routine.exercises, nextItem] };
        }),
      );
    },
    addSetToRoutineExercise: (routineId: string, routineExerciseId: string) => {
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId ? appendSetToRoutineExercise(routine, routineExerciseId) : routine,
        ),
      );
    },
    removeSetFromRoutineExercise: (routineId: string, routineExerciseId: string, setId: string) => {
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId
            ? {
                ...routine,
                updatedAt: Date.now(),
                exercises: routine.exercises.map((ex) =>
                  ex.id === routineExerciseId ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) } : ex,
                ),
              }
            : routine,
        ),
      );
    },
    removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => {
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId
            ? { ...routine, updatedAt: Date.now(), exercises: routine.exercises.filter((ex) => ex.id !== routineExerciseId) }
            : routine,
        ),
      );
    },
    addTechniqueToRoutineExercise: (
      routineId: string,
      routineExerciseId: string,
      technique: Exclude<TechniqueType, "normal" | "superset">,
    ) => {
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId ? appendSetToRoutineExercise(routine, routineExerciseId, technique) : routine,
        ),
      );
    },
    addSupersetToRoutine: (routineId: string, exerciseId: string, pairExerciseId: string) => {
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId ? appendSupersetToRoutine(routine, exerciseId, pairExerciseId, exercises) : routine,
        ),
      );
    },
    updateRoutineExerciseRepRange: (routineId: string, routineExerciseId: string, repRange: RepRangeInput) => {
      const normalizedRange = normalizeRepRange(repRange);
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === routineId
            ? {
                ...routine,
                exercises: routine.exercises.map((ex) =>
                  ex.id === routineExerciseId
                    ? { ...ex, repRangeMin: normalizedRange.min, repRangeMax: normalizedRange.max }
                    : ex,
                ),
              }
            : routine,
        ),
      );
    },
    updateRoutineExerciseWarmupSets: (routineId: string, routineExerciseId: string, count: number) => {
      updateRoutineExerciseCount(setRoutines, routineId, routineExerciseId, "warmupSets", count);
    },
    updateRoutineExerciseFeederSets: (routineId: string, routineExerciseId: string, count: number) => {
      updateRoutineExerciseCount(setRoutines, routineId, routineExerciseId, "feederSets", count);
    },
    deleteExerciseFromRoutines: (exerciseId: string) => {
      setRoutines((current) =>
        current.map((routine) => {
          const exercisesAfterDelete = routine.exercises.filter((ex) => ex.exerciseId !== exerciseId);
          return exercisesAfterDelete.length === routine.exercises.length
            ? routine
            : { ...routine, updatedAt: Date.now(), exercises: exercisesAfterDelete };
        }),
      );
    },
  };
}

function updateRoutineExerciseCount(
  setRoutines: Dispatch<SetStateAction<Routine[]>>,
  routineId: string,
  routineExerciseId: string,
  field: "warmupSets" | "feederSets",
  count: number,
) {
  setRoutines((current) =>
    current.map((routine) =>
      routine.id === routineId
        ? {
            ...routine,
            exercises: routine.exercises.map((ex) => (ex.id === routineExerciseId ? { ...ex, [field]: count } : ex)),
          }
        : routine,
    ),
  );
}
