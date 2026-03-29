import { FormEvent, useState } from "react";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";

const muscleGroupOptions: MuscleGroup[] = ["chest", "back", "shoulders", "legs", "biceps", "triceps"];

export default function ExercisePicker({ routineId }: { routineId: string }) {
  const { exercises, addExerciseToRoutine, createExercise } = useGainlyStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    const nextExercise = createExercise({ name, muscleGroup });
    addExerciseToRoutine(routineId, nextExercise.id);
    setName("");
    setMuscleGroup("chest");
    setCreateOpen(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">Add exercise</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCreateOpen((current) => !current)}
        >
          Create new
        </Button>
      </CardHeader>
      {createOpen ? (
        <CardContent>
          <form className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-3" onSubmit={handleCreate}>
            <label className="block text-sm">
              <span className="block text-zinc-600">Exercise name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2"
                placeholder="Romanian Deadlift"
              />
            </label>
            <label className="block text-sm">
              <span className="block text-zinc-600">Muscle group</span>
              <select
                value={muscleGroup}
                onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
                className="mt-2 flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                {muscleGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="default" size="sm">
              Save exercise
            </Button>
          </form>
        </CardContent>
      ) : null}
      <CardContent className={createOpen ? "pt-0" : ""}>
        <div className="grid gap-2">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => addExerciseToRoutine(routineId, exercise.id)}
              className="rounded-md border border-zinc-200 bg-white px-3 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-50"
            >
              {exercise.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
