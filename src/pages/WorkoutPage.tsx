import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import ExerciseAccordion from "../components/organisms/logger/ExerciseAccordion";
import { Button } from "../components/ui/button";
import { useGainlyStore } from "../state/gainly-store";
import { getMondayWeekStart, getWeekWindow, shiftWeekWindowStart } from "../lib/week";

export default function WorkoutPage() {
  const { routines, exercises } = useGainlyStore();
  const { routineId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const ensureActiveSession = useMutation(api.workouts.ensureActiveSession);
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
  const weekWindow = getWeekWindow(selectedWeekStart);
  const activeSession = useQuery(
    api.workouts.activeSessionForRoutine,
    selectedRoutineId ? { routineId: selectedRoutineId } : "skip",
  );
  const weekHistory = useQuery(
    api.workouts.weekHistoryForRoutine,
    selectedRoutineId
      ? { routineId: selectedRoutineId, weekStart: weekWindow.start, weekEndExclusive: weekWindow.endExclusive }
      : "skip",
  );
  const requestedRoutineIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedRoutineId || activeSession === undefined || activeSession !== null) {
      if (activeSession) {
        requestedRoutineIdRef.current = null;
      }
      return;
    }

    if (requestedRoutineIdRef.current === selectedRoutineId) {
      return;
    }

    requestedRoutineIdRef.current = selectedRoutineId;
    void ensureActiveSession({ routineId: selectedRoutineId }).catch(() => {
      requestedRoutineIdRef.current = null;
      setWorkflowMessage("Unable to restore this workout session. Please refresh and try again.");
    });
  }, [activeSession, ensureActiveSession, selectedRoutineId]);

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

  const weekNavigation = (
    <WeekStrip
      weekStart={weekWindow.start}
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

  if (!workoutRoutine) {
    return (
      <section className="space-y-4">
        <h1 className="screen-title">Workout</h1>
        <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">No workout available.</p>
      </section>
    );
  }

  if (!activeSession && selectedRoutineId) {
    return (
      <section className="space-y-4">
        {weekNavigation}
        <header className="space-y-2">
          <p className="eyebrow">{workoutRoutine.weekday}</p>
          <h1 className="screen-title">{workoutRoutine.name} workout</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Restoring your workout session and pulling the last week-scoped logged set values.
          </p>
        </header>
        {workflowMessage ? (
          <div className="panel-inset border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
            {workflowMessage}
          </div>
        ) : null}
        <div className="panel-card px-4 py-6 text-sm text-[hsl(var(--muted-foreground))]">
          Preparing your workout session...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      {weekNavigation}
      <header className="space-y-2">
        <p className="eyebrow">{workoutRoutine.weekday}</p>
        <h1 className="screen-title">{workoutRoutine.name} workout</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Track each set with current inputs and keep the previous workout from the selected week visible for comparison.
        </p>
      </header>
      <div className="space-y-3">
        {workoutRoutine.exercises.map((item) => {
          const currentExercise = currentExerciseByRoutineExerciseId.get(item.id);
          const previousExercise = previousExerciseByRoutineExerciseId.get(item.id);
          const exercise = exercisesById.get(item.exerciseId);

          if (!currentExercise) {
            return null;
          }

          return (
            <ExerciseAccordion
              key={item.id}
              item={item}
              name={exercise?.name ?? "Exercise"}
              description={exercise?.description}
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
                  setWorkflowMessage("Unable to save that set right now.");
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
          {activeSession?.status === "completed" ? "Workout completed." : "Changes are saved into the active session."}
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
                setWorkflowMessage("Unable to complete this session right now.");
              });
          }}
        >
          Complete session
        </Button>
      </div>
    </section>
  );
}
