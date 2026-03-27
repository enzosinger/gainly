import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { useGainlyStore } from "../state/gainly-store";

export default function RoutinesPage() {
  const { routines, exercises, addTechniqueToRoutineExercise } = useGainlyStore();
  const routine = routines[0];
  const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  if (!routine) {
    return (
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Routines</h1>
        <p className="mt-4 text-sm text-white/60">No routines available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{routine.weekday}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{routine.name} builder</h1>
      </header>
      <ExercisePicker routineId={routine.id} />
      <div className="space-y-3">
        {routine.exercises.map((item) => {
          const exercise = exercisesById.get(item.exerciseId);
          if (!exercise) {
            return null;
          }
          return (
            <RoutineExerciseEditor
              key={item.id}
              exercise={exercise}
              item={item}
              onSelectTechnique={(routineExerciseId, technique) =>
                addTechniqueToRoutineExercise(routine.id, routineExerciseId, technique)
              }
            />
          );
        })}
      </div>
    </section>
  );
}
