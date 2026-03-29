import { cn } from "../../../lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function WeekStrip() {
  return (
    <div className="panel-card grid grid-cols-7 gap-2 p-2">
      {weekDays.map((day) => (
        <div
          key={day}
          className={cn(
            "rounded-md px-2 py-2 text-center text-xs uppercase tracking-[0.14em]",
            day === "Fri"
              ? "bg-[hsl(var(--strong))] text-white"
              : "text-[hsl(var(--muted-foreground))]",
          )}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
