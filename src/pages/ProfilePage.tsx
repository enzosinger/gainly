import { useGainlyStore } from "../state/gainly-store";

export default function ProfilePage() {
  const { routines, exercises } = useGainlyStore();

  const totalExercises = routines.reduce((total, routine) => total + routine.exercises.length, 0);
  const weeklySets = routines.reduce(
    (total, routine) =>
      total + routine.exercises.reduce((exerciseTotal, item) => exerciseTotal + item.sets.length, 0),
    0,
  );

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Athlete profile</p>
        <h1 className="screen-title">Profile</h1>
        <p className="max-w-2xl text-sm text-white/60 md:text-base">
          Maintain a clear baseline of your current training footprint and weekly workload capacity.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="panel-card p-4 md:p-5">
          <p className="eyebrow">Routines</p>
          <p className="mt-3 text-3xl font-semibold">{routines.length}</p>
        </article>
        <article className="panel-card p-4 md:p-5">
          <p className="eyebrow">Exercise library</p>
          <p className="mt-3 text-3xl font-semibold">{exercises.length}</p>
        </article>
        <article className="panel-card p-4 md:p-5">
          <p className="eyebrow">Weekly sets</p>
          <p className="mt-3 text-3xl font-semibold">{weeklySets}</p>
        </article>
      </div>

      <article className="panel-card p-5 md:p-6">
        <p className="eyebrow">Readiness note</p>
        <p className="mt-3 text-lg font-medium tracking-tight">Total planned exercises: {totalExercises}</p>
        <p className="mt-2 text-sm text-white/60">
          Keep volume stable for 2-3 weeks before increasing load to preserve technique quality.
        </p>
      </article>
    </section>
  );
}
