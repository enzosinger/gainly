import type { MuscleGroup } from "../../../types/domain";
import { cn } from "../../../lib/utils";
import { getMuscleGroupLabel } from "../../../i18n/copy";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { Badge } from "../../ui/badge";

export type WorkoutExercisePreview = {
  id: string;
  name: string;
  muscleGroup?: MuscleGroup;
  setCount: number;
};

type WorkoutExerciseListProps = {
  items: WorkoutExercisePreview[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

export default function WorkoutExerciseList({ items, selectedId, onSelect }: WorkoutExerciseListProps) {
  const { copy, language } = useLanguage();

  return (
    <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start" aria-label={copy.workout.exerciseListTitle}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
        {copy.workout.exerciseListTitle}
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const selected = item.id === selectedId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "min-w-[13rem] rounded-lg border px-3 py-3 text-left transition lg:min-w-0",
                selected
                  ? "border-white bg-white text-black"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--muted-foreground))]",
              )}
              aria-pressed={selected}
              aria-label={copy.workout.selectExercise(item.name)}
            >
              <span className="block truncate text-sm font-semibold">{item.name}</span>
              <span
                className={cn(
                  "mt-2 flex items-center justify-between gap-2 text-xs",
                  selected ? "text-zinc-600" : "text-[hsl(var(--muted-foreground))]",
                )}
              >
                {item.muscleGroup ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 max-w-[8rem] truncate px-2 text-[0.7rem]",
                      selected && "border-zinc-200 bg-zinc-100 text-black",
                    )}
                  >
                    {getMuscleGroupLabel(language, item.muscleGroup)}
                  </Badge>
                ) : (
                  <span />
                )}
                <span className="shrink-0">{copy.workout.exerciseSets(item.setCount)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
