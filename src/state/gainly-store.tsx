import { createContext, useContext, useMemo, useState } from "react";
import { mockExercises } from "../data/mockExercises";
import { mockRoutines } from "../data/mockRoutines";
import type { Exercise, Routine } from "../types/domain";

type GainlyStoreValue = {
  exercises: Exercise[];
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  reorderRoutines: (nextIds: string[]) => void;
};

const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

export function GainlyStoreProvider({ children }: { children: React.ReactNode }) {
  const [routines, setRoutines] = useState(mockRoutines);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      exercises: mockExercises,
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
      reorderRoutines: (nextIds: string[]) => {
        setRoutines((current) => {
          const routinesById = new Map(current.map((routine) => [routine.id, routine]));
          return nextIds
            .map((id) => routinesById.get(id))
            .filter((routine): routine is Routine => routine !== undefined);
        });
      },
    }),
    [expandedExerciseId, routines],
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
