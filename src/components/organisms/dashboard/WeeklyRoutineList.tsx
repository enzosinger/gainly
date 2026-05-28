import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGainlyStore } from "../../../state/gainly-store";
import { orderRoutinesByActiveIds } from "../../../lib/routine-ordering";
import RoutineWeekCard from "../../molecules/RoutineWeekCard";
import type { Routine, RoutineWeekSummary } from "../../../types/domain";

type SortableRoutineCardProps = {
  routine: Routine;
  weekStart: number;
  summary?: RoutineWeekSummary;
};

function SortableRoutineCard({ routine, weekStart, summary }: SortableRoutineCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: routine.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <RoutineWeekCard routine={routine} summary={summary} workoutHref={`/workout/${routine.id}?weekStart=${weekStart}`} />
    </div>
  );
}

type WeeklyRoutineListProps = {
  summariesByRoutineId?: Map<string, RoutineWeekSummary>;
  weekStart: number;
};

export default function WeeklyRoutineList({ summariesByRoutineId, weekStart }: WeeklyRoutineListProps) {
  const { routines, reorderRoutines } = useGainlyStore();
  const activeRoutines = routines.filter((routine) => routine.isActive !== false);
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const ids = activeRoutines.map((routine) => routine.id);
        const nextActiveIds = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
        reorderRoutines(orderRoutinesByActiveIds(routines, nextActiveIds).map((routine) => routine.id));
      }}
    >
      <SortableContext items={activeRoutines.map((routine) => routine.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4 md:gap-5">
          {activeRoutines.map((routine) => (
            <SortableRoutineCard key={routine.id} routine={routine} weekStart={weekStart} summary={summariesByRoutineId?.get(routine.id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
