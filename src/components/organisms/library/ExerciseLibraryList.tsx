import { useGainlyStore } from "../../../state/gainly-store";

export default function ExerciseLibraryList() {
  const { exercises } = useGainlyStore();

  return (
    <div className="grid gap-3">
      {exercises.map((exercise) => (
        <article key={exercise.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold">{exercise.name}</h3>
          <p className="mt-2 text-sm text-white/55">
            {exercise.muscleGroup} · {exercise.unilateral ? "unilateral" : "bilateral"}
          </p>
        </article>
      ))}
    </div>
  );
}
