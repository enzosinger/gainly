import type { Routine, RoutineWeekSummary } from "../types/domain";

export type DashboardWeekStats = {
  completedCount: number;
  pendingCount: number;
  averageDeltaPercent: number | null;
};

export function getRoutineTrainingCounts(routine: Routine) {
  return {
    exerciseCount: routine.exercises.length,
    setCount: routine.exercises.reduce((total, exercise) => total + exercise.sets.length, 0),
  };
}

export function buildDashboardWeekStats(
  routines: Routine[],
  summariesByRoutineId?: Map<string, RoutineWeekSummary>,
): DashboardWeekStats {
  const completedCount = routines.reduce((total, routine) => {
    return summariesByRoutineId?.get(routine.id)?.completed ? total + 1 : total;
  }, 0);
  const deltas = routines
    .map((routine) => summariesByRoutineId?.get(routine.id))
    .filter((summary): summary is RoutineWeekSummary => Boolean(summary?.hasHistory))
    .map((summary) => summary.deltaPercent);

  return {
    completedCount,
    pendingCount: Math.max(routines.length - completedCount, 0),
    averageDeltaPercent:
      deltas.length > 0 ? deltas.reduce((total, delta) => total + delta, 0) / deltas.length : null,
  };
}
