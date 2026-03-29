import { Link } from "react-router-dom";
import type { Routine } from "../../types/domain";
import StatusGlyph from "../atoms/StatusGlyph";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type RoutineWeekCardProps = {
  routine: Routine;
  workoutHref?: string;
};

export default function RoutineWeekCard({ routine, workoutHref }: RoutineWeekCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <p className="eyebrow">{routine.weekday}</p>
          <CardTitle className="mt-2 text-xl">{routine.name}</CardTitle>
        </div>
        <StatusGlyph completed={routine.completed} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="panel-inset flex items-center justify-between px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">
          <span>Previous delta</span>
          <span className={routine.deltaPercent >= 0 ? "text-[hsl(var(--foreground))]" : undefined}>
            {routine.deltaPercent >= 0 ? "+" : ""}
            {routine.deltaPercent.toFixed(1)}%
          </span>
        </div>
        {workoutHref ? (
          <Link
            to={workoutHref}
            className="block"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Button variant="outline" className="w-full">
              Log {routine.name} workout
            </Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
