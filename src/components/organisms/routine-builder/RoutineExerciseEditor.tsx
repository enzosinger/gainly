import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

export default function RoutineExerciseEditor({
  exercise,
  item,
  onSelectTechnique,
}: {
  exercise: Exercise;
  item: RoutineExercise;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster" | "superset") => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
        <div className="space-y-2">
          <p className="eyebrow">Routine exercise</p>
          <CardTitle className="text-base">{exercise.name}</CardTitle>
          <CardDescription>Start with normal sets, then add advanced work only when needed.</CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className="capitalize">
            {exercise.muscleGroup}
          </Badge>
          <TechniqueMenu onSelect={(technique) => onSelectTechnique(item.id, technique)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {item.sets.map((set, index) => (
          <div
            key={set.id}
            className="panel-inset rounded-2xl px-3 py-3 text-sm text-[hsl(var(--muted-foreground))]"
          >
            Set {index + 1} · {set.technique}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
