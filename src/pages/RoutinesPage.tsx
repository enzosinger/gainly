import { FormEvent, useId, useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoutineCardGrid from "../components/organisms/routines/RoutineCardGrid";
import CreateRoutineCard from "../components/organisms/routines/CreateRoutineCard";
import RoutineDeleteDialog from "../components/organisms/routines/RoutineDeleteDialog";
import RoutinesLoadingState from "../components/organisms/routines/RoutinesLoadingState";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";
import { useRoutineNameEditing } from "../hooks/use-routine-name-editing";
import type { Routine } from "../types/domain";

export default function RoutinesPage() {
  const { routines, createRoutine, duplicateRoutine, renameRoutine, setRoutineActive, deleteRoutine, isLoading } = useGainlyStore();
  const { copy } = useLanguage();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeleteRoutineId, setPendingDeleteRoutineId] = useState<string | null>(null);
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const [duplicatingRoutineId, setDuplicatingRoutineId] = useState<string | null>(null);
  const [togglingRoutineId, setTogglingRoutineId] = useState<string | null>(null);
  const createFormId = useId();
  const {
    editingRoutineId,
    editingName,
    savingRenameRoutineId,
    beginRename: openRename,
    cancelRename,
    setEditingName,
    handleRename,
  } = useRoutineNameEditing(renameRoutine);

  function beginRename(routine: Routine) {
    setCreateOpen(false);
    openRename(routine);
  }

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
    if (editingRoutineId === routineId) {
      cancelRename();
    }

    try {
      await deleteRoutine(routineId);
    } finally {
      setDeletingRoutineId(null);
    }
  }

  async function handleDuplicate(routineId: string) {
    if (duplicatingRoutineId) {
      return;
    }
    setDuplicatingRoutineId(routineId);

    try {
      const duplicatedRoutine = await duplicateRoutine(routineId);
      beginRename(duplicatedRoutine);
    } finally {
      setDuplicatingRoutineId(null);
    }
  }

  async function handleSetActive(routineId: string, isActive: boolean) {
    if (togglingRoutineId) {
      return;
    }
    setTogglingRoutineId(routineId);

    try {
      await setRoutineActive(routineId, isActive);
    } finally {
      setTogglingRoutineId(null);
    }
  }

  const pendingDeleteRoutine = routines.find((routine) => routine.id === pendingDeleteRoutineId) ?? null;

  if (isLoading) {
    return <RoutinesLoadingState />;
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
          <CreateRoutineCard
            formId={createFormId}
            name={name}
            isSaving={isSaving}
            onNameChange={setName}
            onSubmit={handleCreate}
            onClose={() => {
              setName("");
              setCreateOpen(false);
            }}
          />
        ) : null}

        {routines.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[hsl(var(--muted-foreground))]">{copy.routines.empty}</CardContent>
          </Card>
        ) : (
          <RoutineCardGrid
            routines={routines}
            editingRoutineId={editingRoutineId}
            editingName={editingName}
            savingRenameRoutineId={savingRenameRoutineId}
            deletingRoutineId={deletingRoutineId}
            duplicatingRoutineId={duplicatingRoutineId}
            togglingRoutineId={togglingRoutineId}
            onBeginRename={beginRename}
            onCancelRename={cancelRename}
            onDraftNameChange={setEditingName}
            onRenameSubmit={(event, routine) => {
              void handleRename(event, routine);
            }}
            onDuplicate={(routineId) => {
              void handleDuplicate(routineId);
            }}
            onToggleActive={(routineId, isActive) => {
              void handleSetActive(routineId, isActive);
            }}
            onDelete={setPendingDeleteRoutineId}
          />
        )}
      </div>
      <RoutineDeleteDialog
        routine={pendingDeleteRoutine}
        deletingRoutineId={deletingRoutineId}
        onClose={() => setPendingDeleteRoutineId(null)}
        onDelete={(routineId) => {
          void handleDelete(routineId);
        }}
      />
    </section>
  );
}
