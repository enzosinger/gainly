import { useMemo } from "react";
import { useQuery } from "convex/react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { getMondayWeekStart, getWeekWindow, shiftWeekWindowStart } from "../lib/week";
import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import WeeklyRoutineList from "../components/organisms/dashboard/WeeklyRoutineList";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";

export default function DashboardPage() {
  const { routines } = useGainlyStore();
  const { copy, locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentWeekStart = getMondayWeekStart(Date.now());
  const requestedWeekStart = searchParams.get("weekStart");
  const parsedWeekStart = requestedWeekStart ? Number(requestedWeekStart) : NaN;
  const selectedWeekStart = Number.isFinite(parsedWeekStart)
    ? getMondayWeekStart(parsedWeekStart)
    : currentWeekStart;
  const weekWindow = getWeekWindow(selectedWeekStart, locale);
  const weeklySummaries = useQuery(api.workouts.weeklyRoutineSummaries, {
    weekStart: weekWindow.start,
  }) ?? [];
  const summariesByRoutineId = useMemo(
    () => new Map(weeklySummaries.map((summary) => [summary.routineId, summary])),
    [weeklySummaries],
  );

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">{copy.dashboard.eyebrow}</p>
        <h1 className="screen-title">{copy.dashboard.title}</h1>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">{copy.dashboard.description}</p>
      </header>
      <WeekStrip
        weekLabel={weekWindow.label}
        onPreviousWeek={() => {
          setSearchParams({ weekStart: String(shiftWeekWindowStart(weekWindow.start, -1)) });
        }}
        onNextWeek={() => {
          setSearchParams({ weekStart: String(shiftWeekWindowStart(weekWindow.start, 1)) });
        }}
        canGoNext={weekWindow.start < currentWeekStart}
      />
      {routines.length === 0 ? (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{copy.dashboard.emptyTitle}</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.dashboard.emptyBody}</p>
            </div>
            <Link to="/routines" className="inline-flex">
              <Button variant="outline">{copy.dashboard.emptyAction}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <WeeklyRoutineList summariesByRoutineId={summariesByRoutineId} weekStart={weekWindow.start} />
      )}
    </section>
  );
}
