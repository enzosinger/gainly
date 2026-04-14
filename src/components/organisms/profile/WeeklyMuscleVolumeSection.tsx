import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { cn } from "../../../lib/utils";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { getMuscleGroupLabel } from "../../../i18n/copy";
import type { PlannedWeeklyVolumeEntry, PlannedWeeklyVolumeStatus } from "../../../lib/profile-weekly-volume";

type WeeklyMuscleVolumeSectionProps = {
  entries: PlannedWeeklyVolumeEntry[];
};

const statusToneClasses: Record<PlannedWeeklyVolumeStatus, string> = {
  low: "border-[hsl(var(--border))] bg-[hsl(var(--panel-inset))] text-[hsl(var(--muted-foreground))]",
  moderate: "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--foreground))] shadow-sm",
  high: "border-[hsl(var(--strong))] bg-[hsl(var(--strong))] text-[hsl(var(--strong-foreground))] shadow-sm",
};

const statusDotClasses: Record<PlannedWeeklyVolumeStatus, string> = {
  low: "bg-[hsl(var(--muted-foreground))]",
  moderate: "bg-[hsl(var(--foreground))]",
  high: "bg-[hsl(var(--strong-foreground))]",
};

function VolumeStatusPill({ label, status }: { label: string; status: PlannedWeeklyVolumeStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        statusToneClasses[status],
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", statusDotClasses[status])} />
      {label}
    </span>
  );
}

export default function WeeklyMuscleVolumeSection({ entries }: WeeklyMuscleVolumeSectionProps) {
  const { copy, language } = useLanguage();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{copy.profile.weeklyVolume.title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {entries.map((entry) => (
          <Card key={entry.muscleGroup}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base">{getMuscleGroupLabel(language, entry.muscleGroup)}</CardTitle>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {copy.profile.weeklyVolume.plannedSets}
                  </p>
                </div>
                <VolumeStatusPill label={copy.profile.weeklyVolume.status[entry.status]} status={entry.status} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{entry.plannedSets}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
