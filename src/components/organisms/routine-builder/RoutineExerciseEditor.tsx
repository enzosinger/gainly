import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardDescription, CardTitle } from "../../ui/card";

export default function RoutineExerciseEditor({
  exercise,
  item,
  onAddSet,
  onRemove,
  onSelectTechnique,
}: {
  exercise: Exercise;
  item: RoutineExercise;
  onAddSet: (routineExerciseId: string) => void;
  onRemove: (routineExerciseId: string) => void;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster" | "superset") => void;
}) {
  return (
    <Card>
      <div className="space-y-4 p-6">
        <p className="eyebrow">Routine exercise</p>
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
              <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
                Remove exercise
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {item.sets.map((set, index) => (
            <div
              key={set.id}
              className="panel-inset rounded-2xl px-3 py-3 text-sm text-[hsl(var(--muted-foreground))]"
            >
              Set {index + 1} · {set.technique}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
