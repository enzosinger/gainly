import { useGainlyStore } from "../../../state/gainly-store";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

export default function ExerciseLibraryList() {
  const { exercises } = useGainlyStore();

  return (
    <div className="grid gap-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
            <div className="space-y-2">
              <p className="eyebrow">Exercise</p>
              <CardTitle className="text-base">{exercise.name}</CardTitle>
              <CardDescription>Ready to slot into a routine or a focused workout block.</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {exercise.muscleGroup}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="panel-inset rounded-2xl px-3 py-3 text-sm text-[hsl(var(--muted-foreground))]">
              Primary muscle group: <span className="capitalize text-[hsl(var(--foreground))]">{exercise.muscleGroup}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
