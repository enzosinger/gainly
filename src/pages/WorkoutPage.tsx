import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import ExerciseAccordion from "../components/organisms/logger/ExerciseAccordion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useGainlyStore } from "../state/gainly-store";
import { getMondayWeekStart, getWeekWindow, shiftWeekWindowStart } from "../lib/week";
import { useLanguage } from "../i18n/LanguageProvider";

export default function WorkoutPage() {
  const { routines, exercises, isLoading } = useGainlyStore();
  const { copy, locale } = useLanguage();
  const { routineId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const ensureSessionForRoutineWeek = useMutation(api.workouts.ensureSessionForRoutineWeek);
  const updateWorkoutSet = useMutation(api.workouts.updateWorkoutSet);
  const completeSession = useMutation(api.workouts.completeSession);
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);

  const workoutRoutine = routines.find((routine) => routine.id === routineId) ?? routines[0];
  const selectedRoutineId = (routineId ?? workoutRoutine?.id) as Id<"routines"> | undefined;
  const currentWeekStart = getMondayWeekStart(Date.now());
  const requestedWeekStart = searchParams.get("weekStart");
  const parsedWeekStart = requestedWeekStart ? Number(requestedWeekStart) : NaN;
  const selectedWeekStart = Number.isFinite(parsedWeekStart)
    ? getMondayWeekStart(parsedWeekStart)
    : currentWeekStart;
  const weekWindow = getWeekWindow(selectedWeekStart, locale);
  const activeSession = useQuery(
    api.workouts.sessionForRoutineWeek,
    selectedRoutineId ? { routineId: selectedRoutineId, weekStart: weekWindow.start } : "skip",
  );
  const weekHistory = useQuery(
    api.workouts.previousHistoryForRoutine,
    selectedRoutineId
      ? { routineId: selectedRoutineId, weekStart: weekWindow.start }
      : "skip",
  );
  const requestedRoutineIdRef = useRef<string | null>(null);
  const weekNavigation = (
    <WeekStrip
      weekLabel={weekWindow.label}
      onPreviousWeek={() => {
        setSearchParams({ weekStart: String(shiftWeekWindowStart(weekWindow.start, -1)) });
      }}
      onNextWeek={() => {
        setSearchParams({ weekStart: String(shiftWeekWindowStart(weekWindow.start, 1)) });
      }}
      canGoNext={weekWindow.start < currentWeekStart}
    />
  );

  const routineUpdatedAt = workoutRoutine?.updatedAt;

  useEffect(() => {
    if (!selectedRoutineId || activeSession === undefined) {
      return;
    }

    const syncKey = `${selectedRoutineId}-${routineUpdatedAt}`;

    if (requestedRoutineIdRef.current === syncKey) {
      return;
    }

    requestedRoutineIdRef.current = syncKey;
    void ensureSessionForRoutineWeek({ routineId: selectedRoutineId, weekStart: weekWindow.start }).catch(() => {
      requestedRoutineIdRef.current = null;
      setWorkflowMessage(copy.workout.restoreError);
    });
  }, [activeSession, copy.workout.restoreError, ensureSessionForRoutineWeek, selectedRoutineId, routineUpdatedAt, weekWindow.start]);

  const exercisesById = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );
  const exerciseNamesById = useMemo(
    () => Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise.name])),
    [exercises],
  );
  function getWorkoutExerciseName(item: (typeof workoutRoutine.exercises)[number]) {
    const primaryExerciseName = exercisesById.get(item.exerciseId)?.name ?? copy.exercises.exerciseEyebrow;
    const pairExerciseId = item.sets.find((set) => set.technique === "superset" && set.pairExerciseId)?.pairExerciseId;

    if (!pairExerciseId) {
      return primaryExerciseName;
    }

    const pairExerciseName = exerciseNamesById[pairExerciseId];
    if (!pairExerciseName) {
      return primaryExerciseName;
    }

    return `${primaryExerciseName} + ${pairExerciseName}`;
  }
  const currentExerciseByRoutineExerciseId = useMemo(
    () =>
      new Map(
        activeSession?.exercises.map((exercise) => {
          return [exercise.routineExerciseId, exercise];
        }) ?? [],
      ),
    [activeSession],
  );
  const previousExerciseByRoutineExerciseId = useMemo(
    () =>
      new Map(
        weekHistory?.latestCompletedSession?.exercises.map((exercise) => {
          return [exercise.routineExerciseId, exercise];
        }) ?? [],
      ),
    [weekHistory],
  );

  if (isLoading) {
    return (
      <section className="space-y-6 md:space-y-8" aria-busy="true">
        {weekNavigation}
        <header className="space-y-2">
          <h1 className="screen-title">{copy.workout.title}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.workout.description}</p>
        </header>
        <Card role="status" aria-label={copy.app.loading}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!workoutRoutine) {
    return (
      <section className="space-y-4">
        <h1 className="screen-title">{copy.workout.title}</h1>
        <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">{copy.workout.noWorkout}</p>
      </section>
    );
  }

  if (!activeSession && selectedRoutineId) {
    return (
      <section className="space-y-4">
        {weekNavigation}
        <header className="space-y-2">
          <h1 className="screen-title">{copy.workout.routineWorkout(workoutRoutine.name)}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.workout.restoringDescription}</p>
        </header>
        {workflowMessage ? (
          <div className="panel-inset border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
            {workflowMessage}
          </div>
        ) : null}
        <div className="panel-card px-4 py-6 text-sm text-[hsl(var(--muted-foreground))]">{copy.workout.restoringBody}</div>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      {weekNavigation}
      <header className="space-y-2">
        <h1 className="screen-title">{copy.workout.routineWorkout(workoutRoutine.name)}</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.workout.description}</p>
      </header>
      <div className="space-y-3">
        {workoutRoutine.exercises.map((item) => {
          const currentExercise = currentExerciseByRoutineExerciseId.get(item.id);
          const previousExercise = previousExerciseByRoutineExerciseId.get(item.id);

          if (!currentExercise) {
            return null;
          }

          return (
            <ExerciseAccordion
              key={item.id}
              item={item}
              name={getWorkoutExerciseName(item)}
              description={exercisesById.get(item.exerciseId)?.description}
              currentExercise={currentExercise}
              previousExercise={previousExercise}
              pairExerciseNamesById={exerciseNamesById}
              onCommitSet={(setId, input) => {
                void updateWorkoutSet({
                  sessionId: activeSession!._id,
                  setId,
                  weightKg: input.weightKg,
                  reps: input.reps,
                  pairWeightKg: input.pairWeightKg,
                  pairReps: input.pairReps,
                }).catch(() => {
                  setWorkflowMessage(copy.workout.saveError);
                });
              }}
            />
          );
        })}
      </div>
      {workflowMessage ? (
        <div className="panel-inset border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
          {workflowMessage}
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {activeSession?.status === "completed" ? copy.workout.completed : copy.workout.activeSession}
        </p>
        <Button
          className="sm:w-auto"
          onClick={() => {
            if (!activeSession) {
              return;
            }

            setWorkflowMessage(null);
            void completeSession({ sessionId: activeSession._id })
              .then(() => {
                navigate("/");
              })
              .catch(() => {
                setWorkflowMessage(copy.workout.completeError);
              });
          }}
        >
          {copy.workout.completeSession}
        </Button>
      </div>
    </section>
  );
}
