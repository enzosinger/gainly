import { FormEvent, useEffect, useMemo, useState } from "react";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";
import { Button } from "../../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { ChevronDown } from "lucide-react";

const muscleGroupOptions: MuscleGroup[] = ["chest", "back", "shoulders", "legs", "biceps", "triceps"];
const pickerMuscleFilterOptions: Array<MuscleGroup | "all"> = ["all", ...muscleGroupOptions];

export default function ExercisePicker({ routineId }: { routineId: string }) {
  const { exercises, addExerciseToRoutine, createExercise } = useGainlyStore();
  const [isOpen, setIsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all");
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
  const createFormId = `exercise-create-form-${routineId}`;

  useEffect(() => {
    if (!isOpen) {
      setCreateOpen(false);
    }
  }, [isOpen]);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesSearch =
        normalizedQuery.length === 0 || exercise.name.toLowerCase().includes(normalizedQuery);
      const matchesMuscleGroup = muscleFilter === "all" || exercise.muscleGroup === muscleFilter;

      return matchesSearch && matchesMuscleGroup;
    });
  }, [exercises, muscleFilter, searchQuery]);
  const filteredExerciseLabels = useMemo(() => {
    const nameCounts = filteredExercises.reduce((counts, exercise) => {
      counts.set(exercise.name, (counts.get(exercise.name) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());
    const seenCounts = new Map<string, number>();

    return filteredExercises.map((exercise) => {
      const occurrenceCount = (seenCounts.get(exercise.name) ?? 0) + 1;
      seenCounts.set(exercise.name, occurrenceCount);

      return {
        exercise,
        occurrenceCount,
        hasDuplicateName: (nameCounts.get(exercise.name) ?? 0) > 1,
      };
    });
  }, [filteredExercises]);

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

  function handleCreateToggle() {
    if (!isOpen) {
      setIsOpen(true);
    }

    setCreateOpen((current) => !current);
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="xl:flex xl:max-h-[calc(100vh-14rem)] xl:flex-col xl:overflow-hidden">
        <CardHeader className="flex flex-col gap-4 pb-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 md:max-w-[18rem]">
            <CardTitle className="text-base">Add exercise</CardTitle>
            <CardDescription>Pull from the library or create a movement for this routine.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              aria-controls={createFormId}
              aria-expanded={createOpen}
              onClick={handleCreateToggle}
            >
              {createOpen ? "Cancel" : "Create new"}
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="group"
                aria-label={isOpen ? "Collapse add exercise" : "Expand add exercise"}
              >
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent className="xl:min-h-0 xl:flex xl:flex-1 xl:flex-col">
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
          <CardContent className={`${createOpen ? "pt-4" : ""} xl:min-h-0 xl:flex xl:flex-1 xl:flex-col`}>
            {!createOpen ? (
              <div className="space-y-4 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
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
                {filteredExerciseLabels.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-3 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                    No exercises match these filters.
                  </div>
                ) : (
                  <div className="grid gap-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-1">
                    {filteredExerciseLabels.map(({ exercise, occurrenceCount, hasDuplicateName }) => {
                      return (
                        <button
                          key={exercise.id}
                          type="button"
                          onClick={() => addExerciseToRoutine(routineId, exercise.id)}
                          className="panel-inset rounded-2xl px-3 py-3 text-left text-sm text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--ring))]"
                        >
                          <span className="block font-medium">{exercise.name}</span>
                          <span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">
                            {exercise.muscleGroup}
                            {hasDuplicateName ? ` · #${occurrenceCount}` : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
