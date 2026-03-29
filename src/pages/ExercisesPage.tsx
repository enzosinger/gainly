import ExerciseLibraryList from "../components/organisms/library/ExerciseLibraryList";

export default function ExercisesPage() {
  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Exercise library</p>
        <h1 className="screen-title">Exercises</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Keep the shared movement catalog tidy so the builder and workout flow speak the same language.
        </p>
      </header>
      <ExerciseLibraryList />
    </section>
  );
}
