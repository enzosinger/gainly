import { Link } from "react-router-dom";
import type { Routine, RoutineWeekSummary } from "../../types/domain";
import StatusGlyph from "../atoms/StatusGlyph";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type RoutineWeekCardProps = {
  routine: Routine;
  workoutHref?: string;
  editHref?: string;
  summary?: RoutineWeekSummary;
  showStatus?: boolean;
};

export default function RoutineWeekCard({
  routine,
  workoutHref,
  editHref,
  summary,
  showStatus = true,
}: RoutineWeekCardProps) {
  const completed = summary?.completed ?? routine.completed;
  const deltaPercent = summary?.deltaPercent ?? routine.deltaPercent;
  const hasHistory = summary?.hasHistory ?? routine.hasProgressHistory ?? true;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="mt-2 text-xl">{routine.name}</CardTitle>
        </div>
        {showStatus ? <StatusGlyph completed={completed} /> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="panel-inset flex items-center justify-between px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">
          <span>Previous delta</span>
          {hasHistory ? (
            <span className={deltaPercent >= 0 ? "text-[hsl(var(--foreground))]" : undefined}>
              {deltaPercent >= 0 ? "+" : ""}
              {deltaPercent.toFixed(1)}%
            </span>
          ) : (
            <span>No history</span>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {workoutHref ? (
            <Link
              to={workoutHref}
              className="block flex-1"
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
          {editHref ? (
            <Link
              to={editHref}
              className="block flex-1"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <Button variant="secondary" className="w-full">
                Edit routine
              </Button>
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
