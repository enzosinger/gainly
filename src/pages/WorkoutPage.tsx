import ExerciseAccordion from "../components/organisms/logger/ExerciseAccordion";
import { useGainlyStore } from "../state/gainly-store";

export default function WorkoutPage() {
  const { routines, exercises, workoutRoutineId } = useGainlyStore();
  const workoutRoutine = routines.find((routine) => routine.id === workoutRoutineId) ?? routines[0];
  const exerciseNamesById = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise.name]));

  if (!workoutRoutine) {
    return (
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Workout</h1>
        <p className="mt-4 text-sm text-white/60">No workout available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{workoutRoutine.weekday}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{workoutRoutine.name} workout</h1>
      </header>
      <div className="space-y-3">
        {workoutRoutine.exercises.map((item) => (
          <ExerciseAccordion
            key={item.id}
            item={item}
            name={exerciseNamesById[item.exerciseId] ?? "Exercise"}
            pairExerciseNamesById={exerciseNamesById}
          />
        ))}
      </div>
    </section>
  );
}
