import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { MuscleGroup } from "../../../types/domain";
import { useGainlyStore } from "../../../state/gainly-store";
import { Button } from "../../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { getMuscleGroupLabel } from "../../../i18n/copy";

const muscleGroupOptions: MuscleGroup[] = ["chest", "back", "shoulders", "legs", "biceps", "triceps"];
const pickerMuscleFilterOptions: Array<MuscleGroup | "all"> = ["all", ...muscleGroupOptions];

export default function ExercisePicker({ routineId }: { routineId: string }) {
  const { exercises, addExerciseToRoutine, addSupersetToRoutine, createExercise } = useGainlyStore();
  const { copy, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [supersetMode, setSupersetMode] = useState(false);
  const [selectedSupersetExerciseId, setSelectedSupersetExerciseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("chest");
  const createFormId = `exercise-create-form-${routineId}`;

  useEffect(() => {
    if (!isOpen) {
      setCreateOpen(false);
      setSupersetMode(false);
      setSelectedSupersetExerciseId(null);
      setName("");
      setDescription("");
      setMuscleGroup("chest");
    }
  }, [isOpen]);

  function resetSupersetSelection() {
    setSupersetMode(false);
    setSelectedSupersetExerciseId(null);
  }

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

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    const nextExercise = await createExercise({ name, muscleGroup, description });
    addExerciseToRoutine(routineId, nextExercise.id);
    toast.success(copy.library.addedToast);
    setName("");
    setDescription("");
    setMuscleGroup("chest");
    setCreateOpen(false);
  }

  function handleCreateToggle() {
    if (!isOpen) {
      setIsOpen(true);
    }

    setCreateOpen((current) => {
      if (current) {
        setName("");
        setDescription("");
        setMuscleGroup("chest");
      }

      resetSupersetSelection();
      return !current;
    });
  }

  function handleExerciseSelection(exerciseId: string) {
    if (!supersetMode) {
      addExerciseToRoutine(routineId, exerciseId);
      toast.success(copy.library.addedToast);
      return;
    }

    if (!selectedSupersetExerciseId) {
      setSelectedSupersetExerciseId(exerciseId);
      return;
    }

    if (selectedSupersetExerciseId === exerciseId) {
      toast.error(copy.builder.supersetSameExercise);
      return;
    }

    addSupersetToRoutine(routineId, selectedSupersetExerciseId, exerciseId);
    toast.success(copy.library.addedToast);
    resetSupersetSelection();
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="xl:flex xl:max-h-[calc(100vh-14rem)] xl:flex-col xl:overflow-hidden">
        <CardHeader className="flex flex-col gap-4 pb-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 md:max-w-[18rem]">
            <CardTitle className="text-base">{copy.library.addExercise}</CardTitle>
            <CardDescription>{copy.library.addExerciseDescription}</CardDescription>
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
              {createOpen ? copy.library.collapseAdd : copy.library.createNew}
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="group"
                aria-label={isOpen ? copy.library.collapseAdd : copy.library.expandAdd}
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
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.nameLabel}</span>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2"
                    placeholder={copy.exercises.namePlaceholder}
                  />
                </label>
                <label className="block text-sm">
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.muscleGroupLabel}</span>
                  <Select
                    value={muscleGroup}
                    onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
                    className="mt-2"
                  >
                    {muscleGroupOptions.map((option) => (
                      <option key={option} value={option}>
                        {getMuscleGroupLabel(language, option)}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="block text-sm">
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.descriptionLabel}</span>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="mt-2 flex min-h-[6rem] w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={copy.exercises.descriptionPlaceholder}
                  />
                </label>
                <Button type="submit" variant="default" size="sm">
                  {copy.exercises.createAction}
                </Button>
              </form>
            </CardContent>
          ) : null}
          <CardContent className={`${createOpen ? "pt-4" : ""} xl:min-h-0 xl:flex xl:flex-1 xl:flex-col`}>
            {!createOpen ? (
              <div className="space-y-4 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                  <label className="block text-sm">
                    <span className="block text-[hsl(var(--muted-foreground))]">{copy.library.searchLabel}</span>
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="mt-2"
                      placeholder={copy.library.searchPlaceholder}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="block text-[hsl(var(--muted-foreground))]">{copy.library.filterLabel}</span>
                    <Select
                      value={muscleFilter}
                      onChange={(event) => setMuscleFilter(event.target.value as MuscleGroup | "all")}
                      className="mt-2"
                    >
                      {pickerMuscleFilterOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === "all" ? copy.exercises.allMuscleGroups : getMuscleGroupLabel(language, option)}
                        </option>
                      ))}
                    </Select>
                  </label>
                </div>
                {supersetMode ? (
                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel-inset))] px-3 py-3 text-sm text-[hsl(var(--foreground))]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {selectedSupersetExerciseId
                            ? copy.builder.supersetSelectSecond
                            : copy.builder.supersetSelectFirst}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{copy.builder.supersetInstructions}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetSupersetSelection}
                      >
                        {copy.builder.supersetCancel}
                      </Button>
                    </div>
                  </div>
                ) : null}
                {filteredExerciseLabels.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-3 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                    {copy.library.noMatches}
                  </div>
                ) : (
                  <div className="grid gap-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-1">
                    {filteredExerciseLabels.map(({ exercise, occurrenceCount, hasDuplicateName }) => {
                      const isSelected = selectedSupersetExerciseId === exercise.id;

                      return (
                        <button
                          key={exercise.id}
                          type="button"
                          aria-pressed={supersetMode ? isSelected : undefined}
                          onClick={() => handleExerciseSelection(exercise.id)}
                          className={`panel-inset rounded-2xl px-3 py-3 text-left text-sm text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--ring))] ${
                            isSelected ? "border-[hsl(var(--ring))] bg-[hsl(var(--accent))]" : ""
                          }`}
                        >
                          <span className="block font-medium">{exercise.name}</span>
                          <span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">
                            {getMuscleGroupLabel(language, exercise.muscleGroup)}
                            {hasDuplicateName ? ` · #${occurrenceCount}` : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    type="button"
                    variant={supersetMode ? "outline" : "secondary"}
                    className="w-full"
                    onClick={() => {
                      if (supersetMode) {
                        resetSupersetSelection();
                        return;
                      }

                      setCreateOpen(false);
                      setSupersetMode(true);
                      setSelectedSupersetExerciseId(null);
                      if (!isOpen) {
                        setIsOpen(true);
                      }
                    }}
                  >
                    {supersetMode ? copy.builder.supersetCancel : copy.builder.addSuperset}
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
