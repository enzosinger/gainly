import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGainlyStore } from "../../../state/gainly-store";
import RoutineWeekCard from "../../molecules/RoutineWeekCard";
import type { Routine } from "../../../types/domain";

type SortableRoutineCardProps = {
  routine: Routine;
};

function SortableRoutineCard({ routine }: SortableRoutineCardProps) {
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
      <RoutineWeekCard routine={routine} workoutHref={`/workout/${routine.id}`} />
    </div>
  );
}

export default function WeeklyRoutineList() {
  const { routines, reorderRoutines } = useGainlyStore();
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const ids = routines.map((routine) => routine.id);
        reorderRoutines(arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
      }}
    >
      <SortableContext items={routines.map((routine) => routine.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4 md:gap-5">
          {routines.map((routine) => (
            <SortableRoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
