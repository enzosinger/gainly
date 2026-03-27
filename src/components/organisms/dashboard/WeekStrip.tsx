const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function WeekStrip() {
  return (
    <div className="grid grid-cols-7 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
      {weekDays.map((day) => (
        <div
          key={day}
          className={`rounded-xl px-2 py-2 text-center text-xs uppercase tracking-[0.14em] ${
            day === "Fri" ? "bg-white/10 text-white" : "text-white/45"
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
