import { useMemo, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GainlyStoreContext } from "./gainly-store-context";
import { mapExerciseDoc, mapRoutineDoc } from "./convex-mappers";
import { useConvexExerciseActions } from "./use-convex-exercise-actions";
import { useConvexRoutineActions } from "./use-convex-routine-actions";
import type { MuscleGroup } from "../types/domain";

export function ConvexGainlyStoreProvider({ children }: { children: React.ReactNode }) {
  const viewer = useQuery(api.app.viewer, {});
  const exerciseDocs = useQuery(api.exercises.list, {});
  const routineDocs = useQuery(api.routines.list, {});
  const progressSummaries = useQuery(api.workouts.progressSummaries, {});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [exerciseLibraryMuscleGroupFilter, setExerciseLibraryMuscleGroupFilter] = useState<MuscleGroup | "all">("all");
  const filteredExerciseDocsQuery = useQuery(
    api.exercises.list,
    exerciseLibraryMuscleGroupFilter === "all" ? "skip" : { muscleGroup: exerciseLibraryMuscleGroupFilter },
  );
  const exerciseActions = useConvexExerciseActions();
  const routineActions = useConvexRoutineActions();
  const { signOut } = useAuthActions();

  const isLoading =
    viewer === undefined ||
    exerciseDocs === undefined ||
    routineDocs === undefined ||
    progressSummaries === undefined ||
    (exerciseLibraryMuscleGroupFilter !== "all" && filteredExerciseDocsQuery === undefined);
  const exercises = useMemo(() => exerciseDocs?.map(mapExerciseDoc) ?? [], [exerciseDocs]);
  const exerciseLibraryExercises = useMemo(
    () =>
      exerciseLibraryMuscleGroupFilter === "all"
        ? exercises
        : (filteredExerciseDocsQuery ?? []).map(mapExerciseDoc),
    [exerciseLibraryMuscleGroupFilter, exercises, filteredExerciseDocsQuery],
  );
  const progressSummaryByRoutineId = useMemo(
    () => new Map((progressSummaries ?? []).map((summary) => [summary.routineId, summary])),
    [progressSummaries],
  );
  const routines = useMemo(
    () => (routineDocs ?? []).map((routine) => mapRoutineDoc(routine, progressSummaryByRoutineId.get(routine._id))),
    [progressSummaryByRoutineId, routineDocs],
  );

  const value = useMemo(
    () => ({
      viewer: viewer ? { id: viewer.id, name: viewer.name, email: viewer.email } : null,
      isLoading,
      exercises,
      exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter,
      setExerciseLibraryMuscleGroupFilter,
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
      ...routineActions,
      ...exerciseActions,
      signOut,
    }),
    [
      exerciseActions,
      exerciseLibraryExercises,
      exerciseLibraryMuscleGroupFilter,
      exercises,
      expandedExerciseId,
      isLoading,
      routineActions,
      routines,
      signOut,
      viewer,
    ],
  );

  return <GainlyStoreContext.Provider value={value}>{children}</GainlyStoreContext.Provider>;
}
