import { Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = routine.isActive !== false;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div ref={menuRef} className="pointer-events-auto relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={copy.routines.routineActionsButton}
        onClick={() => setOpen((current) => !current)}
      >
        <Ellipsis className="size-4" />
      </Button>
      {open ? (
        <div
          role="menu"
          className="panel-card absolute right-0 z-20 mt-2 w-fit min-w-28 max-w-[calc(100vw-2rem)] space-y-1 rounded-2xl p-2"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--panel-inset))] disabled:pointer-events-none disabled:opacity-50"
            disabled={duplicatingRoutineId === routine.id}
            onClick={() => {
              onDuplicate(routine.id);
              setOpen(false);
            }}
          >
            {copy.routines.duplicateRoutineButton}
          </button>
          <button
            type="button"
            role="menuitem"
            className="block w-full whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--panel-inset))] disabled:pointer-events-none disabled:opacity-50"
            disabled={togglingRoutineId === routine.id}
            onClick={() => {
              onToggleActive(routine.id, !isActive);
              setOpen(false);
            }}
          >
            {isActive
              ? copy.routines.deactivateRoutineButton
              : copy.routines.activateRoutineButton}
          </button>
          <button
            type="button"
            role="menuitem"
            className="block w-full whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--panel-inset))] disabled:pointer-events-none disabled:opacity-50"
            disabled={deletingRoutineId === routine.id}
            onClick={() => {
              onDelete(routine.id);
              setOpen(false);
            }}
          >
            {copy.routines.deleteRoutineButton}
          </button>
        </div>
      ) : null}
    </div>
  );
}
