import { FormEvent, useState } from "react";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";

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
        <div className="space-y-2">
          <CardTitle className="text-base">Add exercise</CardTitle>
          <CardDescription>Pull from the library or create a movement for this routine.</CardDescription>
        </div>
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
        <CardContent className="pb-0">
          <form className="panel-inset space-y-3 rounded-2xl p-4" onSubmit={handleCreate}>
            <label className="block text-sm">
              <span className="block text-[hsl(var(--muted-foreground))]">Exercise name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2"
                placeholder="Romanian Deadlift"
              />
            </label>
            <label className="block text-sm">
              <span className="block text-[hsl(var(--muted-foreground))]">Muscle group</span>
              <Select
                value={muscleGroup}
                onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
                className="mt-2"
              >
                {muscleGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </label>
            <Button type="submit" variant="default" size="sm">
              Save exercise
            </Button>
          </form>
        </CardContent>
      ) : null}
      <CardContent className={createOpen ? "pt-4" : ""}>
        <div className="grid gap-2">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => addExerciseToRoutine(routineId, exercise.id)}
              className="panel-inset rounded-2xl px-3 py-3 text-left text-sm text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--ring))]"
            >
              {exercise.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
