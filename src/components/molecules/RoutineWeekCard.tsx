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
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">{routine.weekday}</p>
          <CardTitle className="mt-2 text-xl">{routine.name}</CardTitle>
        </div>
        <StatusGlyph completed={routine.completed} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
          <span>Previous delta</span>
          <span className={routine.deltaPercent >= 0 ? "text-zinc-950" : "text-zinc-500"}>
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
