import { FormEvent, useState } from "react";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";

const muscleGroupOptions: MuscleGroup[] = ["chest", "back", "shoulders", "legs", "biceps", "triceps"];

export default function ExercisePicker({ routineId }: { routineId: string }) {
  const { exercises, addExerciseToRoutine, createExercise } = useGainlyStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
  const [unilateral, setUnilateral] = useState(false);

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    const nextExercise = createExercise({ name, muscleGroup, unilateral });
    addExerciseToRoutine(routineId, nextExercise.id);
    setName("");
    setMuscleGroup("chest");
    setUnilateral(false);
    setCreateOpen(false);
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add exercise</h2>
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-2 text-sm"
          onClick={() => setCreateOpen((current) => !current)}
        >
          Create new
        </button>
      </div>
      {createOpen ? (
        <form className="mt-4 space-y-3 rounded-2xl bg-white/[0.04] p-3" onSubmit={handleCreate}>
          <label className="block text-sm">
            <span className="block text-white/70">Exercise name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-transparent px-3 py-2"
              placeholder="Romanian Deadlift"
            />
          </label>
          <label className="block text-sm">
            <span className="block text-white/70">Muscle group</span>
            <select
              value={muscleGroup}
              onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[hsl(var(--panel))] px-3 py-2"
            >
              {muscleGroupOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={unilateral}
              onChange={(event) => setUnilateral(event.target.checked)}
              className="size-4 rounded border-white/20 bg-transparent"
            />
            Unilateral movement
          </label>
          <button type="submit" className="rounded-full border border-white/10 px-3 py-2 text-sm">
            Save exercise
          </button>
        </form>
      ) : null}
      <div className="mt-4 grid gap-2">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            onClick={() => addExerciseToRoutine(routineId, exercise.id)}
            className="rounded-2xl bg-white/[0.04] px-3 py-3 text-left"
          >
            {exercise.name}
          </button>
        ))}
      </div>
    </section>
  );
}
