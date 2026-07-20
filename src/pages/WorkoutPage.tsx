import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import { WorkoutEmptyState, WorkoutLoadingState, WorkoutRestoringState } from "../components/organisms/logger/WorkoutPageStates";
import WorkoutSessionLog from "../components/organisms/logger/WorkoutSessionLog";
import { useGainlyStore } from "../state/gainly-store";
import { buildWorkoutExerciseEntries } from "../lib/workout-logger";
import { getMondayWeekStart, getWeekWindow, shiftWeekWindowStart } from "../lib/week";
import { useLanguage } from "../i18n/LanguageProvider";

export default function WorkoutPage() {
  const { routines, exercises, expandedExerciseId, isLoading, setExpandedExerciseId } = useGainlyStore();
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
  const selectedWeekStart = Number.isFinite(parsedWeekStart) ? getMondayWeekStart(parsedWeekStart) : currentWeekStart;
  const weekWindow = getWeekWindow(selectedWeekStart, locale);
  const activeSession = useQuery(
    api.workouts.sessionForRoutineWeek,
    selectedRoutineId ? { routineId: selectedRoutineId, weekStart: weekWindow.start } : "skip",
  );
  const weekHistory = useQuery(
    api.workouts.previousHistoryForRoutine,
    selectedRoutineId ? { routineId: selectedRoutineId, weekStart: weekWindow.start } : "skip",
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
  const workoutExercises = useMemo(() => {
    return buildWorkoutExerciseEntries({
      routine: workoutRoutine,
      exercisesById,
      exerciseNamesById,
      currentExerciseByRoutineExerciseId,
      previousExerciseByRoutineExerciseId,
      fallbackExerciseName: copy.exercises.exerciseEyebrow,
    });
  }, [
    copy.exercises.exerciseEyebrow,
    currentExerciseByRoutineExerciseId,
    exerciseNamesById,
    exercisesById,
    previousExerciseByRoutineExerciseId,
    workoutRoutine,
  ]);
  const selectedWorkoutExercise =
    workoutExercises.find((exercise) => exercise.item.id === expandedExerciseId) ?? workoutExercises[0] ?? null;

  useEffect(() => {
    if (!selectedWorkoutExercise || selectedWorkoutExercise.item.id === expandedExerciseId) {
      return;
    }

    setExpandedExerciseId(selectedWorkoutExercise.item.id);
  }, [expandedExerciseId, selectedWorkoutExercise, setExpandedExerciseId]);

  if (isLoading) {
    return (
      <WorkoutLoadingState
        weekNavigation={weekNavigation}
        title={copy.workout.title}
        description={copy.workout.description}
        loadingLabel={copy.app.loading}
      />
    );
  }

  if (!workoutRoutine) {
    return <WorkoutEmptyState title={copy.workout.title} body={copy.workout.noWorkout} />;
  }

  if (!activeSession && selectedRoutineId) {
    return (
      <WorkoutRestoringState
        weekNavigation={weekNavigation}
        title={copy.workout.routineWorkout(workoutRoutine.name)}
        description={copy.workout.restoringDescription}
        body={copy.workout.restoringBody}
        workflowMessage={workflowMessage}
      />
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      {weekNavigation}
      <header className="space-y-2">
        <h1 className="screen-title">{copy.workout.routineWorkout(workoutRoutine.name)}</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.workout.description}</p>
      </header>
      <WorkoutSessionLog
        workoutExercises={workoutExercises}
        selectedWorkoutExercise={selectedWorkoutExercise}
        selectedId={selectedWorkoutExercise?.item.id}
        pairExerciseNamesById={exerciseNamesById}
        sessionStatusText={activeSession?.status === "completed" ? copy.workout.completed : copy.workout.activeSession}
        completeLabel={copy.workout.completeSession}
        workflowMessage={workflowMessage}
        onSelectExercise={setExpandedExerciseId}
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
        onComplete={() => {
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
      />
    </section>
  );
}
