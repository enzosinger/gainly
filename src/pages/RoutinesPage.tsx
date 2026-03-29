import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { Card, CardContent } from "../components/ui/card";
import { useGainlyStore } from "../state/gainly-store";

export default function RoutinesPage() {
  const { routines, exercises, addTechniqueToRoutineExercise } = useGainlyStore();
  const routine = routines[0];
  const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  if (!routine) {
    return (
      <section className="space-y-4">
        <h1 className="screen-title">Routines</h1>
        <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">No routines available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">{routine.weekday}</p>
        <h1 className="screen-title">{routine.name} builder</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Build the session from a clean baseline, then layer in advanced techniques deliberately.
        </p>
      </header>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <ExercisePicker routineId={routine.id} />
        <div className="space-y-3">
          {routine.exercises.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-[hsl(var(--muted-foreground))]">
                Add an exercise to start shaping this routine.
              </CardContent>
            </Card>
          ) : null}
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
      </div>
    </section>
  );
}
