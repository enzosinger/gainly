import { Trash2, X, Plus } from "lucide-react";
import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Select } from "../../ui/select";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { getMuscleGroupLabel, getTechniqueLabel } from "../../../i18n/copy";

export default function RoutineExerciseEditor({
  exercise,
  item,
  index,
  onAddSet,
  onRemoveSet,
  onRemove,
  onSelectTechnique,
  onUpdateWS,
  onUpdateFS,
}: {
  exercise: Exercise;
  item: RoutineExercise;
  index: number;
  onAddSet: (routineExerciseId: string) => void;
  onRemoveSet: (routineExerciseId: string, setId: string) => void;
  onRemove: (routineExerciseId: string) => void;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster" | "superset") => void;
  onUpdateWS: (routineExerciseId: string, count: number) => void;
  onUpdateFS: (routineExerciseId: string, count: number) => void;
}) {
  const { copy, language } = useLanguage();

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
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <CardTitle className="text-base font-semibold sm:text-[1.1rem]">
                {exercise.name}
              </CardTitle>
            </div>
            <CardDescription className="max-w-xl text-sm leading-6">
              {exercise.description?.trim() || copy.builder.noDescription}
            </CardDescription>
          </div>

          <div className="flex w-full flex-row items-end justify-between sm:w-auto sm:flex-col sm:items-end sm:gap-3">
            {/* WS/FS Group */}
            <div className="flex flex-row items-end gap-3">
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

            {/* Actions Group */}
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
