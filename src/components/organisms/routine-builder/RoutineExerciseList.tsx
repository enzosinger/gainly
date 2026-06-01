import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Exercise, Routine, RoutineExercise, TechniqueType } from "../../../types/domain";
import { useLanguage } from "../../../i18n/LanguageProvider";
import RoutineExerciseEditor from "./RoutineExerciseEditor";

type RoutineExerciseListProps = {
  routine: Routine;
  exercisesById: Map<string, Exercise>;
  onReorder: (routineId: string, nextExerciseIds: string[]) => void;
  onAddSet: (routineExerciseId: string) => void;
  onRemoveSet: (routineExerciseId: string, setId: string) => void;
  onRemove: (routineExerciseId: string) => void;
  onSelectTechnique: (routineExerciseId: string, technique: Exclude<TechniqueType, "normal" | "superset">) => void;
  onUpdateRepRange: (routineExerciseId: string, repRange: { min?: number; max?: number }) => void;
  onUpdateWS: (routineExerciseId: string, count: number) => void;
  onUpdateFS: (routineExerciseId: string, count: number) => void;
};

type SortableRoutineExerciseProps = Omit<RoutineExerciseListProps, "routine" | "onReorder"> & {
  item: RoutineExercise;
  index: number;
  exercise: Exercise;
};

function SortableRoutineExercise({
  item,
  index,
  exercise,
  exercisesById,
  ...actions
}: SortableRoutineExerciseProps) {
  const { copy } = useLanguage();
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const pairExerciseId = item.sets.find((set) => set.technique === "superset" && Boolean(set.pairExerciseId))?.pairExerciseId;
  const pairExerciseName = pairExerciseId ? exercisesById.get(pairExerciseId)?.name : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`cursor-grab rounded-2xl active:cursor-grabbing ${isDragging ? "opacity-70" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      aria-label={copy.builder.reorderExercise(index + 1)}
      {...listeners}
    >
      <RoutineExerciseEditor
        index={index}
        exercise={exercise}
        pairExerciseName={pairExerciseName}
        item={item}
        {...actions}
      />
    </div>
  );
}

export default function RoutineExerciseList({ routine, exercisesById, onReorder, ...actions }: RoutineExerciseListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const exerciseIds = routine.exercises.map((item) => item.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;

        const activeId = String(active.id);
        const overId = String(over.id);
        const activeIndex = exerciseIds.indexOf(activeId);
        const overIndex = exerciseIds.indexOf(overId);

        if (activeIndex < 0 || overIndex < 0) return;

        onReorder(routine.id, arrayMove(exerciseIds, activeIndex, overIndex));
      }}
    >
      <SortableContext items={exerciseIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {routine.exercises.map((item, index) => {
            const exercise = exercisesById.get(item.exerciseId);
            if (!exercise) return null;

            return (
              <SortableRoutineExercise
                key={item.id}
                item={item}
                index={index}
                exercise={exercise}
                exercisesById={exercisesById}
                {...actions}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
