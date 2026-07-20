import { useMemo } from "react";
import { useQuery } from "convex/react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { getMondayWeekStart, getWeekWindow, shiftWeekWindowStart } from "../lib/week";
import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import WeeklyRoutineList from "../components/organisms/dashboard/WeeklyRoutineList";
import WeeklyInsightsPanel from "../components/organisms/dashboard/WeeklyInsightsPanel";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";
import { buildDashboardWeekStats } from "../lib/dashboard-week";
import { buildPlannedWeeklyVolume } from "../lib/profile-weekly-volume";

export default function DashboardPage() {
  const { routines, exercises, isLoading } = useGainlyStore();
  const activeRoutines = useMemo(() => routines.filter((routine) => routine.isActive !== false), [routines]);
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
  });
  const summariesByRoutineId = useMemo(
    () => new Map((weeklySummaries ?? []).map((summary) => [summary.routineId, summary])),
    [weeklySummaries],
  );
  const weekStats = useMemo(
    () => buildDashboardWeekStats(activeRoutines, summariesByRoutineId),
    [activeRoutines, summariesByRoutineId],
  );
  const plannedVolume = useMemo(() => buildPlannedWeeklyVolume(activeRoutines, exercises), [activeRoutines, exercises]);

  if (isLoading || weeklySummaries === undefined) {
    return (
      <section className="mx-auto max-w-[1180px] space-y-5 md:space-y-6" aria-busy="true">
        <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="space-y-3">
            <p className="eyebrow">{copy.dashboard.eyebrow}</p>
            <h1 className="screen-title">{copy.dashboard.title}</h1>
          </div>
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
        </header>
        <Card role="status" aria-label={copy.app.loading}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1180px] space-y-5 md:space-y-6">
      <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="space-y-3">
          <p className="eyebrow">{copy.dashboard.eyebrow}</p>
          <h1 className="screen-title">{copy.dashboard.title}</h1>
        </div>
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
      </header>
      {activeRoutines.length === 0 ? (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                {routines.length === 0 ? copy.dashboard.emptyTitle : copy.dashboard.inactiveTitle}
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {routines.length === 0 ? copy.dashboard.emptyBody : copy.dashboard.inactiveBody}
              </p>
            </div>
            <Link to="/routines" className="inline-flex">
              <Button variant="outline">{copy.dashboard.emptyAction}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <WeeklyRoutineList summariesByRoutineId={summariesByRoutineId} weekStart={weekWindow.start} />
          <WeeklyInsightsPanel
            routineCount={activeRoutines.length}
            stats={weekStats}
            plannedVolume={plannedVolume}
          />
        </div>
      )}
    </section>
  );
}
