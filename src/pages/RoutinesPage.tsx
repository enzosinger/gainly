import { FormEvent, useId, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoutineWeekCard from "../components/molecules/RoutineWeekCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";

export default function RoutinesPage() {
  const { routines, createRoutine, deleteRoutine, isLoading } = useGainlyStore();
  const { copy } = useLanguage();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeleteRoutineId, setPendingDeleteRoutineId] = useState<string | null>(null);
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const createFormId = useId();

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const createdRoutine = await createRoutine({ name: trimmedName });
      setName("");
      setCreateOpen(false);
      navigate(`/routines/${createdRoutine.id}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(routineId: string) {
    if (deletingRoutineId) {
      return;
    }

    setDeletingRoutineId(routineId);

    try {
      await deleteRoutine(routineId);
    } finally {
      setDeletingRoutineId(null);
    }
  }

  const pendingDeleteRoutine = routines.find((routine) => routine.id === pendingDeleteRoutineId) ?? null;

  if (isLoading) {
    return (
      <section className="space-y-6 md:space-y-8" aria-busy="true">
        <header className="space-y-3">
          <p className="eyebrow">{copy.routines.eyebrow}</p>
          <h1 className="screen-title">{copy.routines.title}</h1>
          <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
            {copy.routines.description}
          </p>
        </header>

        <Card role="status" aria-label={copy.app.loading}>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
            <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="min-h-[11rem]">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">{copy.routines.eyebrow}</p>
        <h1 className="screen-title">{copy.routines.title}</h1>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">{copy.routines.description}</p>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.routines.available(routines.length)}</p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-controls={createFormId}
            aria-expanded={createOpen}
            aria-label={createOpen ? copy.routines.cancel : copy.routines.toggleCreate}
            onClick={() => setCreateOpen((current) => !current)}
          >
            {createOpen ? <X className="size-4" /> : <Plus className="size-4" />}
          </Button>
        </div>

        {createOpen ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <form id={createFormId} className="space-y-4" onSubmit={handleCreate}>
                <label className="block text-sm">
                  <span className="block text-[hsl(var(--muted-foreground))]">{copy.routines.createLabel}</span>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2"
                    placeholder={copy.routines.createPlaceholder}
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={isSaving}>
                    {copy.routines.createAction}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    aria-controls={createFormId}
                    onClick={() => {
                      setName("");
                      setCreateOpen(false);
                    }}
                  >
                    {copy.routines.close}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {routines.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[hsl(var(--muted-foreground))]">{copy.routines.empty}</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
            {routines.map((routine) => (
              <RoutineWeekCard
                key={routine.id}
                routine={routine}
                editHref={`/routines/${routine.id}`}
                showStatus={false}
                headerAction={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    aria-label={copy.routines.deleteRoutineButton(routine.name)}
                    disabled={deletingRoutineId === routine.id}
                    onClick={() => {
                      setPendingDeleteRoutineId(routine.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </div>
      <AlertDialog open={pendingDeleteRoutine !== null} onOpenChange={(open) => !open && setPendingDeleteRoutineId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.routines.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.routines.deleteDescription(pendingDeleteRoutine?.name ?? undefined)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingRoutineId !== null}>{copy.routines.cancel}</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingDeleteRoutine || deletingRoutineId !== null}
              onClick={() => {
                if (!pendingDeleteRoutine) {
                  return;
                }

                void handleDelete(pendingDeleteRoutine.id);
              }}
            >
              {copy.routines.deleteAction}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
