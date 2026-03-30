import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type WeekStripProps = {
  weekStart: number;
  weekLabel: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  canGoNext?: boolean;
  showDays?: boolean;
};

function formatDayLabel(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(timestamp);
}

export default function WeekStrip({
  weekStart,
  weekLabel,
  onPreviousWeek,
  onNextWeek,
  canGoNext = true,
  showDays = true,
}: WeekStripProps) {
  return (
    <div className="panel-card space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" size="sm" onClick={onPreviousWeek}>
          Previous week
        </Button>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{weekLabel}</p>
        <Button type="button" variant="outline" size="sm" onClick={onNextWeek} disabled={!canGoNext}>
          Next week
        </Button>
      </div>
      {showDays ? (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayTimestamp = weekStart + index * 24 * 60 * 60 * 1000;

            return (
              <div
                key={day}
                className={cn(
                  "rounded-md px-2 py-2 text-center text-xs uppercase tracking-[0.14em]",
                  index === 0
                    ? "bg-[hsl(var(--strong))] text-white"
                    : "text-[hsl(var(--muted-foreground))]",
                )}
              >
                <span className="block">{day}</span>
                <span className="mt-1 block text-[10px] tracking-[0.08em]">{formatDayLabel(dayTimestamp)}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
