import { Eye, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { getRoutineTrainingCounts } from "../../../lib/dashboard-week";
import { useLanguage } from "../../../i18n/LanguageProvider";
import type { Routine, RoutineWeekSummary } from "../../../types/domain";
import StatusGlyph from "../../atoms/StatusGlyph";

type WeeklyRoutineRowProps = {
  routine: Routine;
  summary?: RoutineWeekSummary;
  weekStart: number;
};

function formatDelta(deltaPercent: number | null, fallback: string) {
  if (deltaPercent === null) return fallback;
  return `${deltaPercent >= 0 ? "+" : ""}${deltaPercent.toFixed(1)}%`;
}

export default function WeeklyRoutineRow({ routine, summary, weekStart }: WeeklyRoutineRowProps) {
  const { copy } = useLanguage();
  const completed = summary?.completed ?? routine.completed;
  const hasHistory = summary?.hasHistory ?? routine.hasProgressHistory ?? true;
  const { exerciseCount, setCount } = getRoutineTrainingCounts(routine);
  const workoutLabel = completed ? copy.routines.viewWorkout : copy.routines.logWorkout(routine.name);

  return (
    <article className="panel-card grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <StatusGlyph completed={completed} />

        <div className="min-w-0 space-y-2">
          <h3 className="truncate text-xl font-semibold leading-tight tracking-tight text-[hsl(var(--foreground))]">
            {routine.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[hsl(var(--muted-foreground))]">
            <span>{copy.dashboard.routineMeta(exerciseCount, setCount)}</span>
            <span>{completed ? copy.dashboard.completedLabel : copy.dashboard.pendingLabel}</span>
            <span>{formatDelta(hasHistory ? summary?.deltaPercent ?? routine.deltaPercent : null, copy.dashboard.noProgress)}</span>
          </div>
        </div>
      </div>

      <Link
        to={`/workout/${routine.id}?weekStart=${weekStart}`}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--panel-inset))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 sm:w-32"
        aria-label={workoutLabel}
      >
        {completed ? <Eye className="size-4" /> : <Play className="size-4 fill-current" />}
        <span>{completed ? copy.routines.viewWorkout : copy.dashboard.startAction}</span>
      </Link>
    </article>
  );
}
