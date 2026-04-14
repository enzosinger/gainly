import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useId, useState } from "react";
import { useGainlyStore } from "../../../state/gainly-store";
import type { MuscleGroup } from "../../../types/domain";
import { MUSCLE_GROUP_FILTER_OPTIONS, MUSCLE_GROUPS } from "../../../../lib/muscle-groups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { getMuscleGroupLabel } from "../../../i18n/copy";

const textareaClassName =
  "mt-2 flex min-h-[6rem] w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type ExerciseDraft = {
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
};

export default function ExerciseLibraryList() {
  const {
    exercises,
    exerciseLibraryExercises,
    exerciseLibraryMuscleGroupFilter,
    setExerciseLibraryMuscleGroupFilter,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useGainlyStore();
  const { copy, language } = useLanguage();
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createMuscleGroup, setCreateMuscleGroup] = useState<MuscleGroup>("chest");
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ExerciseDraft | null>(null);
  const [savingExerciseId, setSavingExerciseId] = useState<string | null>(null);
  const [pendingDeleteExerciseId, setPendingDeleteExerciseId] = useState<string | null>(null);
  const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(null);
  const createFormId = useId();

  function toggleCreateForm() {
    setCreateOpen((current) => {
      if (current) {
        setCreateName("");
        setCreateDescription("");
        setCreateMuscleGroup("chest");
      } else {
        cancelEdit();
      }

      return !current;
    });
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = createName.trim();
    if (!trimmedName || creatingExercise) {
      return;
    }

    setCreatingExercise(true);

    try {
      await createExercise({
        name: trimmedName,
        muscleGroup: createMuscleGroup,
        description: createDescription,
      });
      setCreateName("");
      setCreateDescription("");
      setCreateMuscleGroup("chest");
      setCreateOpen(false);
    } finally {
      setCreatingExercise(false);
    }
  }

  function beginEdit(exerciseId: string) {
    const exercise = exercises.find((item) => item.id === exerciseId);
    if (!exercise) {
      return;
    }

    setCreateOpen(false);
    setEditingExerciseId(exerciseId);
    setEditDraft({
      name: exercise.name,
      description: exercise.description ?? "",
      muscleGroup: exercise.muscleGroup,
    });
  }

  function cancelEdit() {
    setEditingExerciseId(null);
    setEditDraft(null);
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>, exerciseId: string) {
    event.preventDefault();

    if (!editDraft || savingExerciseId) {
      return;
    }

    setSavingExerciseId(exerciseId);

    try {
      await updateExercise(exerciseId, editDraft);
      cancelEdit();
    } finally {
      setSavingExerciseId(null);
    }
  }

  async function handleDelete(exerciseId: string) {
    if (deletingExerciseId) {
      return;
    }

    setDeletingExerciseId(exerciseId);
    if (editingExerciseId === exerciseId) {
      cancelEdit();
    }

    try {
      await deleteExercise(exerciseId);
    } finally {
      setDeletingExerciseId(null);
    }
  }

  const pendingDeleteExercise = exercises.find((exercise) => exercise.id === pendingDeleteExerciseId) ?? null;

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-4 md:space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{copy.exercises.filterLabel}</p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-controls={createFormId}
              aria-expanded={createOpen}
              aria-label={createOpen ? copy.exercises.cancelAction : copy.exercises.toggleCreate}
              onClick={toggleCreateForm}
            >
              {createOpen ? <X className="size-4" /> : <Plus className="size-4" />}
            </Button>
          </div>
          <div
            role="group"
            aria-label={copy.exercises.muscleGroupFilterLabel}
            className="scrollbar-hide -mx-4 flex flex-nowrap overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0 md:pb-0"
          >
            <div className="flex gap-2">
              {MUSCLE_GROUP_FILTER_OPTIONS.map((option) => {
                const isActive = exerciseLibraryMuscleGroupFilter === option;

                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    aria-pressed={isActive}
                    className="shrink-0 rounded-full px-4 capitalize"
                    onClick={() => setExerciseLibraryMuscleGroupFilter(option)}
                  >
                    {option === "all" ? copy.exercises.allMuscleGroups : getMuscleGroupLabel(language, option)}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {createOpen ? (
          <Card>
            <CardHeader className="space-y-4 p-4 md:p-6">
              <div className="space-y-2">
                <p className="eyebrow">{copy.exercises.createEyebrow}</p>
                <CardTitle className="text-base">{copy.exercises.createCardTitle}</CardTitle>
                <CardDescription>{copy.exercises.createCardDescription}</CardDescription>
              </div>
              <form id={createFormId} className="space-y-4" onSubmit={handleCreate}>
                <label className="block text-sm">
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.nameLabel}</span>
                  <Input
                    value={createName}
                    onChange={(event) => setCreateName(event.target.value)}
                    className="mt-2"
                    placeholder={copy.exercises.namePlaceholder}
                  />
                </label>
                <label className="block text-sm">
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.muscleGroupLabel}</span>
                  <Select
                    value={createMuscleGroup}
                    onChange={(event) => setCreateMuscleGroup(event.target.value as MuscleGroup)}
                    className="mt-2"
                  >
                    {MUSCLE_GROUPS.map((option) => (
                      <option key={option} value={option}>
                        {getMuscleGroupLabel(language, option)}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="block text-sm">
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.descriptionLabel}</span>
                  <textarea
                    value={createDescription}
                    onChange={(event) => setCreateDescription(event.target.value)}
                    className={textareaClassName}
                    placeholder={copy.exercises.descriptionPlaceholder}
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" variant="default" size="sm" disabled={creatingExercise}>
                    {copy.exercises.createAction}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-controls={createFormId}
                    onClick={() => {
                      setCreateName("");
                      setCreateDescription("");
                      setCreateMuscleGroup("chest");
                      setCreateOpen(false);
                    }}
                  >
                    {copy.exercises.close}
                  </Button>
                </div>
              </form>
            </CardHeader>
          </Card>
        ) : null}

        {exerciseLibraryExercises.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-3 py-4 text-sm text-[hsl(var(--muted-foreground))]">
            {copy.exercises.emptyByGroup}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exerciseLibraryExercises.map((exercise) => {
              const isEditing = editingExerciseId === exercise.id;
              const displayDescription = exercise.description?.trim() || copy.exercises.noDescription;

              return (
                <Card key={exercise.id} className="h-full min-h-[15rem] overflow-hidden lg:aspect-[0.94/1]">
                  <CardHeader className="flex h-full flex-col gap-3 p-3 md:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="eyebrow">{copy.exercises.exerciseEyebrow}</p>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={copy.exercises.cancelEditing(exercise.name)}
                            onClick={cancelEdit}
                          >
                            <X className="size-4" />
                          </Button>
                          <Button
                            type="submit"
                            form={`edit-exercise-${exercise.id}`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={copy.exercises.confirmChanges(exercise.name)}
                            disabled={savingExerciseId === exercise.id}
                          >
                            <Check className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={copy.exercises.editExercise(exercise.name)}
                            onClick={() => beginEdit(exercise.id)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={copy.exercises.deleteExercise(exercise.name)}
                            disabled={deletingExerciseId === exercise.id}
                            onClick={() => setPendingDeleteExerciseId(exercise.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditing && editDraft ? (
                      <form
                        id={`edit-exercise-${exercise.id}`}
                        className="flex min-h-0 flex-1 flex-col gap-3"
                        onSubmit={(event) => void handleEditSubmit(event, exercise.id)}
                      >
                        <label className="block text-sm">
                          <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.nameLabel}</span>
                          <Input
                            value={editDraft.name}
                            onChange={(event) =>
                              setEditDraft((current) =>
                                current ? { ...current, name: event.target.value } : current,
                            )
                            }
                            className="mt-2"
                            placeholder={copy.exercises.namePlaceholder}
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.descriptionLabel}</span>
                          <textarea
                            value={editDraft.description}
                            onChange={(event) =>
                              setEditDraft((current) =>
                                current ? { ...current, description: event.target.value } : current,
                            )
                            }
                            className={textareaClassName}
                            placeholder={copy.exercises.descriptionPlaceholder}
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="block text-[hsl(var(--muted-foreground))]">{copy.exercises.muscleGroupLabel}</span>
                          <Select
                            value={editDraft.muscleGroup}
                            onChange={(event) =>
                              setEditDraft((current) =>
                                current ? { ...current, muscleGroup: event.target.value as MuscleGroup } : current,
                              )
                            }
                            className="mt-2"
                          >
                            {MUSCLE_GROUPS.map((option) => (
                              <option key={option} value={option}>
                                {getMuscleGroupLabel(language, option)}
                              </option>
                            ))}
                          </Select>
                        </label>
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="px-0 text-[hsl(var(--muted-foreground))] hover:bg-transparent hover:text-[hsl(var(--foreground))]"
                            disabled={deletingExerciseId === exercise.id}
                            onClick={() => setPendingDeleteExerciseId(exercise.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            {copy.exercises.deleteAction}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex min-h-0 flex-1 flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle className="text-base leading-tight">{exercise.name}</CardTitle>
                          <CardDescription className="min-h-[3.75rem] text-sm leading-6">
                            {displayDescription}
                          </CardDescription>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="capitalize">
                            {getMuscleGroupLabel(language, exercise.muscleGroup)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={pendingDeleteExercise !== null} onOpenChange={(open) => !open && setPendingDeleteExerciseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.exercises.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.exercises.deleteDescription(pendingDeleteExercise?.name ?? undefined)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingExerciseId !== null}>{copy.exercises.cancelAction}</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingDeleteExercise || deletingExerciseId !== null}
              onClick={() => {
                if (!pendingDeleteExercise) {
                  return;
                }

                void handleDelete(pendingDeleteExercise.id);
              }}
            >
              {copy.exercises.deleteAction}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
