import type { Routine } from "../../types/domain";
import StatusGlyph from "../atoms/StatusGlyph";

type RoutineWeekCardProps = {
  routine: Routine;
};

export default function RoutineWeekCard({ routine }: RoutineWeekCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{routine.weekday}</p>
          <h3 className="mt-2 text-xl font-semibold">{routine.name}</h3>
        </div>
        <StatusGlyph completed={routine.completed} upcoming={!routine.completed} />
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/[0.03] px-3 py-2 text-sm text-white/70">
        <span>Previous delta</span>
        <span className={routine.deltaPercent >= 0 ? "text-[hsl(var(--accent))]" : "text-rose-300"}>
          {routine.deltaPercent >= 0 ? "+" : ""}
          {routine.deltaPercent.toFixed(1)}%
        </span>
      </div>
    </article>
  );
}
