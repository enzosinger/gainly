import ExerciseLibraryList from "../components/organisms/library/ExerciseLibraryList";

export default function ExercisesPage() {
  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Exercise Library</p>
        <h1 className="screen-title">Exercises</h1>
      </header>
      <ExerciseLibraryList />
    </section>
  );
}
