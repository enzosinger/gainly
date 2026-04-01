import { Trash2, X, Plus } from "lucide-react";
import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardDescription, CardTitle } from "../../ui/card";

export default function RoutineExerciseEditor({
  exercise,
  item,
  index,
  onAddSet,
  onRemoveSet,
  onRemove,
  onSelectTechnique,
}: {
  exercise: Exercise;
  item: RoutineExercise;
  index: number;
  onAddSet: (routineExerciseId: string) => void;
  onRemoveSet: (routineExerciseId: string, setId: string) => void;
  onRemove: (routineExerciseId: string) => void;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster" | "superset") => void;
}) {
  return (
    <Card>
      <div className="space-y-4 p-6">
        <p className="eyebrow">Exercise {index + 1}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <CardTitle className="text-base font-semibold sm:text-[1.1rem]">
                {exercise.name}
              </CardTitle>
              <Badge variant="outline" className="h-fit capitalize sm:hidden">
                {exercise.muscleGroup}
              </Badge>
            </div>
            <CardDescription className="max-w-xl text-sm leading-6">
              {exercise.description?.trim() || "No description added yet."}
            </CardDescription>
          </div>

          <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
            <Badge variant="outline" className="hidden capitalize sm:inline-flex">
              {exercise.muscleGroup}
            </Badge>

            <div className="flex flex-row items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => onAddSet(item.id)}
                aria-label="Add set"
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
                aria-label="Remove exercise"
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
              <span>
                Set {setIndex + 1} · {set.technique}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveSet(item.id, set.id)}
                aria-label="Remove set"
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
