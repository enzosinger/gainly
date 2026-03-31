import { Trash2, X } from "lucide-react";
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
        <div className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-base">{exercise.name}</CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6">
              {exercise.description?.trim() || "No description added yet."}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge variant="outline" className="capitalize">
              {exercise.muscleGroup}
            </Badge>
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onAddSet(item.id)}>
                Add set
              </Button>
              <TechniqueMenu onSelect={(technique) => onSelectTechnique(item.id, technique)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
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
