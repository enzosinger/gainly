import { useEffect, useState } from "react";
import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { Card, CardContent } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { useGainlyStore } from "../state/gainly-store";

export default function RoutinesPage() {
  const {
    routines,
    exercises,
    addSetToRoutineExercise,
    removeExerciseFromRoutine,
    addTechniqueToRoutineExercise,
  } = useGainlyStore();
  const [selectedRoutineId, setSelectedRoutineId] = useState("");
  const routine = routines.find((item) => item.id === selectedRoutineId) ?? routines[0];
  const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  useEffect(() => {
    const firstRoutineId = routines[0]?.id ?? "";

    if (!selectedRoutineId) {
      setSelectedRoutineId(firstRoutineId);
      return;
    }

    const hasSelectedRoutine = routines.some((item) => item.id === selectedRoutineId);
    if (!hasSelectedRoutine) {
      setSelectedRoutineId(firstRoutineId);
    }
  }, [routines, selectedRoutineId]);

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
      <header className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="eyebrow">{routine.weekday}</p>
            <h1 className="screen-title">{routine.name} builder</h1>
          </div>
          <label className="block w-full max-w-xs text-sm font-medium text-[hsl(var(--foreground))]">
            <span className="mb-2 block">Routine</span>
            <Select value={routine.id} onChange={(event) => setSelectedRoutineId(event.target.value)}>
              {routines.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.weekday} · {item.name}
                </option>
              ))}
            </Select>
          </label>
        </div>
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
