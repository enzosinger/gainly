import type { FormEvent } from "react";
import RoutineWeekCard from "../../molecules/RoutineWeekCard";
import type { Routine } from "../../../types/domain";
import RoutineCardActions from "./RoutineCardActions";
import RoutineNameEditor from "./RoutineNameEditor";

type RoutineCardGridProps = {
  routines: Routine[];
  editingRoutineId: string | null;
  editingName: string;
  savingRenameRoutineId: string | null;
  deletingRoutineId: string | null;
  duplicatingRoutineId: string | null;
  togglingRoutineId: string | null;
  onBeginRename: (routine: Routine) => void;
  onCancelRename: () => void;
  onDraftNameChange: (name: string) => void;
  onRenameSubmit: (event: FormEvent<HTMLFormElement>, routine: Routine) => void;
  onDuplicate: (routineId: string) => void;
  onToggleActive: (routineId: string, isActive: boolean) => void;
  onDelete: (routineId: string) => void;
};

export default function RoutineCardGrid({
  routines,
  editingRoutineId,
  editingName,
  savingRenameRoutineId,
  deletingRoutineId,
  duplicatingRoutineId,
  togglingRoutineId,
  onBeginRename,
  onCancelRename,
  onDraftNameChange,
  onRenameSubmit,
  onDuplicate,
  onToggleActive,
  onDelete,
}: RoutineCardGridProps) {
  return (
    <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
      {routines.map((routine) => (
        <RoutineWeekCard
          key={routine.id}
          routine={routine}
          editHref={`/routines/${routine.id}`}
          showStatus={false}
          titleContent={
            <RoutineNameEditor
              routine={routine}
              isEditing={editingRoutineId === routine.id}
              draftName={editingName}
              isSaving={savingRenameRoutineId === routine.id}
              onBeginEdit={onBeginRename}
              onCancelEdit={onCancelRename}
              onDraftNameChange={onDraftNameChange}
              onSubmit={(event, currentRoutine) => {
                onRenameSubmit(event, currentRoutine);
              }}
            />
          }
          headerAction={
            <RoutineCardActions
              routine={routine}
              deletingRoutineId={deletingRoutineId}
              duplicatingRoutineId={duplicatingRoutineId}
              togglingRoutineId={togglingRoutineId}
              onDuplicate={onDuplicate}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          }
        />
      ))}
    </div>
  );
}
