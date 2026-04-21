import { Trash2, X, Plus } from "lucide-react";
import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { getMuscleGroupLabel, getTechniqueLabel } from "../../../i18n/copy";

export default function RoutineExerciseEditor({
  exercise,
  pairExerciseName,
  item,
  index,
  onAddSet,
  onRemoveSet,
  onRemove,
  onSelectTechnique,
  onUpdateRepRange,
  onUpdateWS,
  onUpdateFS,
}: {
  exercise: Exercise;
  pairExerciseName?: string;
  item: RoutineExercise;
  index: number;
  onAddSet: (routineExerciseId: string) => void;
  onRemoveSet: (routineExerciseId: string, setId: string) => void;
  onRemove: (routineExerciseId: string) => void;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster") => void;
  onUpdateRepRange: (routineExerciseId: string, repRange: { min?: number; max?: number }) => void;
  onUpdateWS: (routineExerciseId: string, count: number) => void;
  onUpdateFS: (routineExerciseId: string, count: number) => void;
}) {
  const { copy, language } = useLanguage();
  const displayName = pairExerciseName ? `${exercise.name} + ${pairExerciseName}` : exercise.name;

  return (
    <Card>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{copy.builder.exerciseIndex(index + 1)}</p>
          <Badge variant="outline" className="h-fit capitalize">
            {getMuscleGroupLabel(language, exercise.muscleGroup)}
          </Badge>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="flex items-start justify-between gap-4 sm:flex-1 sm:block">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <CardTitle className="text-base font-semibold sm:text-[1.1rem]">{displayName}</CardTitle>
              </div>
              <CardDescription className="max-w-xl text-sm leading-6">
                {exercise.description?.trim() || copy.builder.noDescription}
              </CardDescription>
            </div>
            <div className="sm:hidden">
              <RepRangeFields item={item} onUpdate={(repRange) => onUpdateRepRange(item.id, repRange)} />
            </div>
          </div>

          <div className="flex w-full flex-row items-end justify-between sm:w-auto sm:flex-row sm:items-end sm:justify-end sm:gap-6">
            <div className="flex flex-row items-end gap-3">
              <div className="hidden sm:block">
                <RepRangeFields item={item} onUpdate={(repRange) => onUpdateRepRange(item.id, repRange)} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {copy.builder.warmupSets}
                </span>
                <Select
                  className="h-10 w-14 rounded-xl px-2 py-0 text-xs"
                  value={item.warmupSets ?? 0}
                  onChange={(e) => onUpdateWS(item.id, Number(e.target.value))}
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {copy.builder.feederSets}
                </span>
                <Select
                  className="h-10 w-14 rounded-xl px-2 py-0 text-xs"
                  value={item.feederSets ?? 0}
                  onChange={(e) => onUpdateFS(item.id, Number(e.target.value))}
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-row items-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => onAddSet(item.id)}
                aria-label={copy.builder.addSet}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <TechniqueMenu onSelect={(technique) => onSelectTechnique(item.id, technique)} />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]"
                onClick={() => onRemove(item.id)}
                aria-label={copy.builder.removeExercise}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {item.sets.map((set, setIndex) => (
            <div
              key={set.id}
              className="panel-inset flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-[hsl(var(--muted-foreground))]"
            >
              <span>{copy.builder.setTechnique(setIndex + 1, getTechniqueLabel(language, set.technique))}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveSet(item.id, set.id)}
                aria-label={copy.builder.removeSet}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function RepRangeFields({ item, onUpdate }: {
  item: RoutineExercise;
  onUpdate: (repRange: { min?: number; max?: number }) => void;
}) {
  const { copy } = useLanguage();

  function parseValue(value: string) {
    if (!value.trim()) {
      return undefined;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
  }

  return (
    <div className="flex flex-col items-end gap-1 self-end sm:items-start sm:self-start">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        {copy.builder.repRange}
      </span>
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          value={item.repRangeMin ?? ""}
          onChange={(event) => onUpdate({ min: parseValue(event.target.value), max: item.repRangeMax })}
          aria-label={copy.builder.repRangeMin}
          className="h-10 w-14 rounded-xl px-2 py-0 text-center text-xs"
        />
        <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">-</span>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          value={item.repRangeMax ?? ""}
          onChange={(event) => onUpdate({ min: item.repRangeMin, max: parseValue(event.target.value) })}
          aria-label={copy.builder.repRangeMax}
          className="h-10 w-14 rounded-xl px-2 py-0 text-center text-xs"
        />
      </div>
    </div>
  );
}
