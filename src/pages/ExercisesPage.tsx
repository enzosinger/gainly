import ExerciseLibraryList from "../components/organisms/library/ExerciseLibraryList";

export default function ExercisesPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Exercise Library</p>
        <h1 className="text-3xl font-semibold tracking-tight">Reusable movements</h1>
      </header>
      <ExerciseLibraryList />
    </section>
  );
}
