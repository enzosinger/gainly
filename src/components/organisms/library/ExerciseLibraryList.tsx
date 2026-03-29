import { useGainlyStore } from "../../../state/gainly-store";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function ExerciseLibraryList() {
  const { exercises } = useGainlyStore();

  return (
    <div className="grid gap-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="capitalize">
              {exercise.muscleGroup}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
