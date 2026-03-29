const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function WeekStrip() {
  return (
    <div className="grid grid-cols-7 gap-2 rounded-xl border border-zinc-200 bg-white p-2">
      {weekDays.map((day) => (
        <div
          key={day}
          className={`rounded-md px-2 py-2 text-center text-xs uppercase tracking-[0.14em] ${
            day === "Fri" ? "bg-zinc-950 text-white" : "text-zinc-400"
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
