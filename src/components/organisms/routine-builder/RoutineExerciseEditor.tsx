import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";

export default function RoutineExerciseEditor({
  exercise,
  item,
  onSelectTechnique,
}: {
  exercise: Exercise;
  item: RoutineExercise;
  onSelectTechnique: (routineExerciseId: string, technique: "backoff" | "cluster" | "superset") => void;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
          <p className="text-sm text-white/55">
            {exercise.muscleGroup} · {exercise.unilateral ? "unilateral" : "bilateral"}
          </p>
        </div>
        <TechniqueMenu onSelect={(technique) => onSelectTechnique(item.id, technique)} />
      </div>
      <div className="mt-4 space-y-2">
        {item.sets.map((set, index) => (
          <div key={set.id} className="rounded-2xl bg-white/[0.04] px-3 py-3 text-sm">
            Set {index + 1} · {set.technique}
          </div>
        ))}
      </div>
    </article>
  );
}
