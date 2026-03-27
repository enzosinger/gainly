import WeekStrip from "../components/organisms/dashboard/WeekStrip";
import WeeklyRoutineList from "../components/organisms/dashboard/WeeklyRoutineList";

export default function DashboardPage() {
  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">Week 13</p>
        <h1 className="screen-title">Your training week</h1>
        <p className="max-w-2xl text-sm text-white/60 md:text-base">
          Keep momentum across every lift with a single analytical view of readiness and load progression.
        </p>
      </header>
      <WeekStrip />
      <WeeklyRoutineList />
    </section>
  );
}
