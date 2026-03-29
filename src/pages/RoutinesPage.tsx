import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { useGainlyStore } from "../state/gainly-store";

export default function RoutinesPage() {
  const { routines, exercises, addTechniqueToRoutineExercise } = useGainlyStore();
  const routine = routines[0];
  const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  if (!routine) {
    return (
      <section className="space-y-4">
        <h1 className="screen-title">Routines</h1>
        <p className="mt-4 text-sm text-zinc-500">No routines available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">{routine.weekday}</p>
        <h1 className="screen-title">{routine.name} builder</h1>
        <p className="text-sm text-zinc-500">Build routines with normal sets first, then add advanced techniques deliberately.</p>
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
