import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

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
          <CardTitle className="text-base">{exercise.name}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {exercise.muscleGroup}
          </Badge>
        </div>
        <TechniqueMenu onSelect={(technique) => onSelectTechnique(item.id, technique)} />
      </CardHeader>
      <CardContent className="space-y-2">
        {item.sets.map((set, index) => (
          <div key={set.id} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700">
            Set {index + 1} · {set.technique}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
