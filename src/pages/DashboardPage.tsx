import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import WeeklyRoutineList from "../components/organisms/dashboard/WeeklyRoutineList";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Week 13</p>
        <h1 className="text-3xl font-semibold tracking-tight">Your training week</h1>
      </header>
      <WeekStrip />
      <WeeklyRoutineList />
    </section>
  );
}
