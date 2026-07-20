import { CheckCircle2, Clock3, Dumbbell, TrendingUp } from "lucide-react";
import { cn } from "../../../lib/utils";
import { getMuscleGroupLabel } from "../../../i18n/copy";
import { useLanguage } from "../../../i18n/LanguageProvider";
import type { PlannedWeeklyVolumeEntry, PlannedWeeklyVolumeStatus } from "../../../lib/profile-weekly-volume";
import type { DashboardWeekStats } from "../../../lib/dashboard-week";
import { Card, CardContent } from "../../ui/card";

type WeeklyInsightsPanelProps = {
  routineCount: number;
  stats: DashboardWeekStats;
  plannedVolume: PlannedWeeklyVolumeEntry[];
  className?: string;
};

function formatDelta(deltaPercent: number | null, fallback: string) {
  if (deltaPercent === null) return fallback;
  return `${deltaPercent >= 0 ? "+" : ""}${deltaPercent.toFixed(1)}%`;
}

const statusToneClasses: Record<PlannedWeeklyVolumeStatus, string> = {
  low: "border-[hsl(var(--border))] bg-[hsl(var(--panel-inset))] text-[hsl(var(--muted-foreground))]",
  moderate: "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--foreground))]",
  high: "border-[hsl(var(--strong))] bg-[hsl(var(--strong))] text-[hsl(var(--strong-foreground))]",
};

export default function WeeklyInsightsPanel({
  routineCount,
  stats,
  plannedVolume,
  className,
}: WeeklyInsightsPanelProps) {
  const { copy, language } = useLanguage();
  const totalPlannedSets = plannedVolume.reduce((total, entry) => total + entry.plannedSets, 0);
  const visibleVolume = plannedVolume
    .filter((entry) => entry.plannedSets > 0)
    .sort((left, right) => right.plannedSets - left.plannedSets)
    .slice(0, 5);
  const maxSets = Math.max(...visibleVolume.map((entry) => entry.plannedSets), 1);
  const metrics = [
    {
      label: copy.dashboard.completedMetric,
      value: `${stats.completedCount}/${routineCount}`,
      icon: CheckCircle2,
    },
    {
      label: copy.dashboard.pendingMetric,
      value: String(stats.pendingCount),
      icon: Clock3,
    },
    {
      label: copy.dashboard.averageProgressMetric,
      value: formatDelta(stats.averageDeltaPercent, copy.dashboard.noProgress),
      icon: TrendingUp,
    },
    {
      label: copy.dashboard.plannedSetsMetric,
      value: String(totalPlannedSets),
      icon: Dumbbell,
    },
  ];

  return (
    <aside className={className}>
      <Card>
        <CardContent className="space-y-5 p-4 md:p-5">
          <div className="space-y-1">
            <p className="eyebrow">{copy.dashboard.summaryTitle}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.dashboard.plannedVolumeTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="panel-inset rounded-xl px-3 py-3">
                <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                  <metric.icon className="size-4" />
                  <span className="text-xs">{metric.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-[hsl(var(--foreground))]">{metric.value}</p>
              </div>
            ))}
          </div>

          {visibleVolume.length > 0 ? (
            <div className="space-y-3">
              {visibleVolume.map((entry) => (
                <div key={entry.muscleGroup} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[hsl(var(--foreground))]">
                      {getMuscleGroupLabel(language, entry.muscleGroup)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[hsl(var(--muted-foreground))]">{entry.plannedSets}</span>
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium",
                          statusToneClasses[entry.status],
                        )}
                      >
                        {copy.profile.weeklyVolume.status[entry.status]}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--panel-inset))]">
                    <div
                      className="h-full rounded-full bg-[hsl(var(--strong))]"
                      style={{ width: `${Math.max((entry.plannedSets / maxSets) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </aside>
  );
}
