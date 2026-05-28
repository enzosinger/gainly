import type { Routine } from "../../../types/domain";
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
import { useLanguage } from "../../../i18n/LanguageProvider";

type RoutineDeleteDialogProps = {
  routine: Routine | null;
  deletingRoutineId: string | null;
  onClose: () => void;
  onDelete: (routineId: string) => void;
};

export default function RoutineDeleteDialog({
  routine,
  deletingRoutineId,
  onClose,
  onDelete,
}: RoutineDeleteDialogProps) {
  const { copy } = useLanguage();

  return (
    <AlertDialog open={routine !== null} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.routines.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{copy.routines.deleteDescription(routine?.name ?? undefined)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletingRoutineId !== null}>{copy.routines.cancel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={!routine || deletingRoutineId !== null}
            onClick={() => {
              if (routine) {
                onDelete(routine.id);
              }
            }}
          >
            {copy.routines.deleteAction}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
