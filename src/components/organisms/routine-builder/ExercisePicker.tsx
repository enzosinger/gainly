import { FormEvent, useMemo, useState } from "react";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";

const muscleGroupOptions: MuscleGroup[] = ["chest", "back", "shoulders", "legs", "biceps", "triceps"];
const pickerMuscleFilterOptions: Array<MuscleGroup | "all"> = ["all", ...muscleGroupOptions];

export default function ExercisePicker({ routineId }: { routineId: string }) {
  const { exercises, addExerciseToRoutine, createExercise } = useGainlyStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all");
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
  const createFormId = `exercise-create-form-${routineId}`;
  const filteredExercises = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesSearch =
        normalizedQuery.length === 0 || exercise.name.toLowerCase().includes(normalizedQuery);
      const matchesMuscleGroup = muscleFilter === "all" || exercise.muscleGroup === muscleFilter;

      return matchesSearch && matchesMuscleGroup;
    });
  }, [exercises, muscleFilter, searchQuery]);

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
          aria-controls={createFormId}
          aria-expanded={createOpen}
          onClick={() => setCreateOpen((current) => !current)}
        >
          {createOpen ? "Cancel" : "Create new"}
        </Button>
      </CardHeader>
      {createOpen ? (
        <CardContent className="pb-0">
          <form id={createFormId} className="panel-inset space-y-3 rounded-2xl p-4" onSubmit={handleCreate}>
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
        <div className="space-y-4">
          {!createOpen ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm">
                <span className="block text-[hsl(var(--muted-foreground))]">Search exercises</span>
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="mt-2"
                  placeholder="Search by name"
                />
              </label>
              <label className="block text-sm">
                <span className="block text-[hsl(var(--muted-foreground))]">Filter by muscle group</span>
                <Select
                  value={muscleFilter}
                  onChange={(event) => setMuscleFilter(event.target.value as MuscleGroup | "all")}
                  className="mt-2"
                >
                  {pickerMuscleFilterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all" ? "All muscle groups" : option}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          ) : null}
          {filteredExercises.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-3 py-4 text-sm text-[hsl(var(--muted-foreground))]">
              No exercises match these filters.
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredExercises.map((exercise) => (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
