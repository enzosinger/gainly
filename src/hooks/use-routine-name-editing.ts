import { FormEvent, useState } from "react";
import type { Routine } from "../types/domain";

type RenameRoutine = (routineId: string, name: string) => Promise<Routine>;

export function useRoutineNameEditing(renameRoutine: RenameRoutine) {
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingRenameRoutineId, setSavingRenameRoutineId] = useState<string | null>(null);

  function beginRename(routine: Routine) {
    setEditingRoutineId(routine.id);
    setEditingName(routine.name);
  }

  function cancelRename() {
    setEditingRoutineId(null);
    setEditingName("");
  }

  async function handleRename(event: FormEvent<HTMLFormElement>, routine: Routine) {
    event.preventDefault();
    const trimmedName = editingName.trim();

    if (!trimmedName || savingRenameRoutineId) {
      return;
    }

    setSavingRenameRoutineId(routine.id);

    try {
      await renameRoutine(routine.id, trimmedName);
      cancelRename();
    } finally {
      setSavingRenameRoutineId(null);
    }
  }

  return {
    editingRoutineId,
    editingName,
    savingRenameRoutineId,
    beginRename,
    cancelRename,
    setEditingName,
    handleRename,
  };
}
