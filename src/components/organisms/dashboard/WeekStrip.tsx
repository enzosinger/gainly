import { Button } from "../../ui/button";

type WeekStripProps = {
  weekLabel: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  canGoNext?: boolean;
};


export default function WeekStrip({
  weekLabel,
  onPreviousWeek,
  onNextWeek,
  canGoNext = true,
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
    </div>
  );
}
