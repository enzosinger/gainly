import { Copy, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { useLanguage } from "../../../i18n/LanguageProvider";
import type { Routine } from "../../../types/domain";

type RoutineCardActionsProps = {
  routine: Routine;
  deletingRoutineId: string | null;
  duplicatingRoutineId: string | null;
  togglingRoutineId: string | null;
  onDuplicate: (routineId: string) => void;
  onToggleActive: (routineId: string, isActive: boolean) => void;
  onDelete: (routineId: string) => void;
};

export default function RoutineCardActions({
  routine,
  deletingRoutineId,
  duplicatingRoutineId,
  togglingRoutineId,
  onDuplicate,
  onToggleActive,
  onDelete,
}: RoutineCardActionsProps) {
  const { copy } = useLanguage();
  const isActive = routine.isActive !== false;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {!isActive ? (
        <span className="rounded-full border border-[hsl(var(--border))] px-2 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]">
          {copy.routines.inactiveLabel}
        </span>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full"
        aria-label={copy.routines.duplicateRoutineButton(routine.name)}
        disabled={duplicatingRoutineId === routine.id}
        onClick={() => onDuplicate(routine.id)}
      >
        <Copy className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full"
        aria-label={
          isActive
            ? copy.routines.deactivateRoutineButton(routine.name)
            : copy.routines.activateRoutineButton(routine.name)
        }
        disabled={togglingRoutineId === routine.id}
        onClick={() => onToggleActive(routine.id, !isActive)}
      >
        {isActive ? <PauseCircle className="size-4" /> : <PlayCircle className="size-4" />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full"
        aria-label={copy.routines.deleteRoutineButton(routine.name)}
        disabled={deletingRoutineId === routine.id}
        onClick={() => onDelete(routine.id)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
