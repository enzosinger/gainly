import { useParams } from "react-router-dom";
import ExerciseAccordion from "../components/organisms/logger/ExerciseAccordion";
import { useGainlyStore } from "../state/gainly-store";

export default function WorkoutPage() {
  const { routines, exercises } = useGainlyStore();
  const { routineId } = useParams();
  const workoutRoutine = routines.find((routine) => routine.id === routineId) ?? routines[0];
  const exerciseNamesById = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise.name]));

  if (!workoutRoutine) {
    return (
      <section className="space-y-4">
        <h1 className="screen-title">Workout</h1>
        <p className="mt-4 text-sm text-white/60">No workout available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">{workoutRoutine.weekday}</p>
        <h1 className="screen-title">{workoutRoutine.name} workout</h1>
        <p className="text-sm text-white/60">Track each set with consistent form quality and progressive overload.</p>
      </header>
      <div className="panel-card space-y-3 p-4 md:p-5">
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
