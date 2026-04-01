import { useEffect } from "react";
import ExerciseLibraryList from "../components/organisms/library/ExerciseLibraryList";
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";

export default function ExercisesPage() {
  const { setExerciseLibraryMuscleGroupFilter } = useGainlyStore();
  const { copy } = useLanguage();

  useEffect(
    () => () => {
      setExerciseLibraryMuscleGroupFilter("all");
    },
    [setExerciseLibraryMuscleGroupFilter],
  );

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">{copy.exercises.eyebrow}</p>
        <h1 className="screen-title">{copy.exercises.title}</h1>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">{copy.exercises.description}</p>
      </header>
      <ExerciseLibraryList />
    </section>
  );
}
