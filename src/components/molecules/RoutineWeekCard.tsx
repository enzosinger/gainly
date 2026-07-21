import { Eye, Pencil, Play } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Routine, RoutineWeekSummary } from "../../types/domain";
import StatusGlyph from "../atoms/StatusGlyph";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useLanguage } from "../../i18n/LanguageProvider";

type RoutineWeekCardProps = {
  routine: Routine;
  cardHref?: string;
  workoutHref?: string;
  editHref?: string;
  summary?: RoutineWeekSummary;
  showStatus?: boolean;
  headerAction?: ReactNode;
  titleContent?: ReactNode;
};

export default function RoutineWeekCard({
  routine,
  cardHref,
  workoutHref,
  editHref,
  summary,
  showStatus = true,
  headerAction,
  titleContent,
}: RoutineWeekCardProps) {
  const { copy } = useLanguage();
  const completed = summary?.completed ?? routine.completed;
  const deltaPercent = summary?.deltaPercent ?? routine.deltaPercent;
  const hasHistory = summary?.hasHistory ?? routine.hasProgressHistory ?? true;
  const workoutLabel = completed ? copy.routines.viewWorkout : copy.routines.logWorkout(routine.name);
  const actionCount = Number(Boolean(workoutHref)) + Number(Boolean(editHref));
  const hasBodyActions = actionCount > 0;
  const actionColumnClassName =
    actionCount > 1
      ? "grid min-h-[8.5rem] w-[calc((8.5rem-0.75rem)/2)] shrink-0 auto-rows-fr gap-3"
      : "flex min-h-[8.5rem] w-[8.5rem] shrink-0 items-center justify-center";
  const actionLinkClassName = actionCount > 1 ? "pointer-events-auto block h-full w-full" : "pointer-events-auto block h-[8.5rem] w-[8.5rem]";
  const actionButtonClassName = actionCount > 1 ? "h-full w-full rounded-2xl" : "h-[8.5rem] w-[8.5rem] rounded-2xl";
  const progressPanelClassName = hasBodyActions
    ? "panel-inset flex min-h-[8.5rem] flex-1 flex-col items-center justify-center rounded-2xl px-4 py-4 text-center text-[hsl(var(--muted-foreground))] md:items-start md:text-left"
    : "panel-inset flex min-h-[6.25rem] flex-1 flex-col items-center justify-center rounded-2xl px-4 py-4 text-center text-[hsl(var(--muted-foreground))] sm:min-h-[6.75rem] md:items-start md:text-left";

  return (
    <Card
      className={
        cardHref
          ? "relative cursor-pointer overflow-hidden transition-colors hover:bg-[hsl(var(--panel-inset))]"
          : "overflow-hidden"
      }
    >
      {cardHref ? (
        <Link
          to={cardHref}
          className="absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
          aria-label={copy.routines.editRoutine}
        />
      ) : null}
      <CardContent className={cardHref ? "pointer-events-none relative z-10 p-5 md:p-6" : "p-5 md:p-6"}>
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            {titleContent ?? <CardTitle className="text-2xl leading-tight md:text-[2rem]">{routine.name}</CardTitle>}
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2">
            {headerAction}
            {showStatus ? <StatusGlyph completed={completed} /> : null}
          </div>
        </div>

        <div className="mt-5 flex items-stretch justify-between gap-4">
          <div className={progressPanelClassName}>
            <span className="text-[11px] uppercase tracking-[0.18em]">{copy.routines.previousDelta}</span>
            {hasHistory ? (
              <span className={deltaPercent >= 0 ? "mt-2 text-3xl font-semibold text-[hsl(var(--foreground))]" : "mt-2 text-3xl font-semibold text-[hsl(var(--muted-foreground))]"}>
                {deltaPercent >= 0 ? "+" : ""}
                {deltaPercent.toFixed(1)}%
              </span>
            ) : (
              <span className="mt-2 text-3xl font-semibold text-[hsl(var(--foreground))]">-%</span>
            )}
          </div>

          {hasBodyActions ? (
            <div className={actionColumnClassName}>
              {workoutHref ? (
                <Link
                  to={workoutHref}
                  className={actionLinkClassName}
                  aria-label={workoutLabel}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Button variant="outline" size="icon" className={actionButtonClassName}>
                    {completed ? <Eye className="size-4" /> : <Play className="size-4 fill-current" />}
                  </Button>
                </Link>
              ) : null}
              {editHref ? (
                <Link
                  to={editHref}
                  className={actionLinkClassName}
                  aria-label={copy.routines.editRoutine}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Button variant="secondary" size="icon" className={actionButtonClassName}>
                    <Pencil className="size-4" />
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
