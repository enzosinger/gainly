import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onPreviousWeek}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{weekLabel}</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onNextWeek}
          disabled={!canGoNext}
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
