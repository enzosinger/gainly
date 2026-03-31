import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { useGainlyStore } from "../state/gainly-store";

export default function RoutineDetailPage() {
  const { routines, exercises, addSetToRoutineExercise, removeExerciseFromRoutine, addTechniqueToRoutineExercise } =
    useGainlyStore();
  const { routineId } = useParams();
  const navigate = useNavigate();
  const routine = useMemo(() => routines.find((item) => item.id === routineId) ?? null, [routineId, routines]);
  const exercisesById = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), [exercises]);

  if (!routine) {
    return (
      <section className="space-y-4">
        <header className="space-y-2">
          <p className="eyebrow">Routine editor</p>
          <h1 className="screen-title">Routine not found</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            The requested routine does not exist or was removed.
          </p>
        </header>
        <Link to="/routines">
          <Button variant="outline">Back to routines</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="screen-title">{routine.name} builder</h1>
          </div>
          <label className="block w-full max-w-xs text-sm font-medium text-[hsl(var(--foreground))]">
            <span className="mb-2 block">Routine</span>
            <Select value={routine.id} onChange={(event) => navigate(`/routines/${event.target.value}`)}>
              {routines.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
          Build the session from a clean baseline, then layer in advanced techniques deliberately.
        </p>
      </header>

      <div className="space-y-4">
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
                onAddSet={(routineExerciseId) => addSetToRoutineExercise(routine.id, routineExerciseId)}
                onRemove={(routineExerciseId) => removeExerciseFromRoutine(routine.id, routineExerciseId)}
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
