import { FormEvent, useId, useState } from "react";
import { Trash2 } from "lucide-react";
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
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";

export default function RoutinesPage() {
  const { routines, createRoutine, deleteRoutine } = useGainlyStore();
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
            size="sm"
            aria-controls={createFormId}
            aria-expanded={createOpen}
            onClick={() => setCreateOpen((current) => !current)}
          >
            {createOpen ? copy.routines.cancel : copy.routines.toggleCreate}
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
              <div key={routine.id} className="relative">
                <div className="absolute right-3 top-3 z-10">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={copy.routines.deleteRoutineButton(routine.name)}
                    disabled={deletingRoutineId === routine.id}
                    onClick={() => {
                      setPendingDeleteRoutineId(routine.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <RoutineWeekCard routine={routine} editHref={`/routines/${routine.id}`} showStatus={false} />
              </div>
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
