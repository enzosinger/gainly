import { ChevronDown } from "lucide-react";
import { useGainlyStore } from "../../../state/gainly-store";
import type { RoutineExercise } from "../../../types/domain";
import SetRow from "../../molecules/SetRow";
import TechniqueBadgeRow from "./TechniqueBadgeRow";

type ExerciseAccordionProps = {
  item: RoutineExercise;
  name: string;
  pairExerciseNamesById: Record<string, string>;
};

function getPreviousPerformance(item: RoutineExercise) {
  const previousSet = item.sets.find((set) => set.weightKg || set.reps || set.pairWeightKg || set.pairReps);

  if (!previousSet) return "Previous --";
  if (previousSet.weightKg && previousSet.reps) return `Previous ${previousSet.weightKg} kg x ${previousSet.reps}`;
  if (previousSet.weightKg) return `Previous ${previousSet.weightKg} kg`;
  if (previousSet.reps) return `Previous x ${previousSet.reps}`;
  if (previousSet.pairWeightKg && previousSet.pairReps) {
    return `Previous pair ${previousSet.pairWeightKg} kg x ${previousSet.pairReps}`;
  }
  return "Previous --";
}

export default function ExerciseAccordion({ item, name, pairExerciseNamesById }: ExerciseAccordionProps) {
  const { expandedExerciseId, setExpandedExerciseId } = useGainlyStore();
  const expanded = expandedExerciseId === item.id;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setExpandedExerciseId(expanded ? null : item.id)}
        className="flex w-full items-center justify-between px-4 py-4 text-left text-zinc-950"
        aria-expanded={expanded}
      >
        <span className="text-base font-semibold">{name}</span>
        <ChevronDown className={expanded ? "size-5 rotate-180 text-zinc-500" : "size-5 text-zinc-500"} />
      </button>
      {expanded ? (
        <div className="space-y-3 border-t border-zinc-200 px-4 py-4">
          <p className="text-sm text-zinc-500">{getPreviousPerformance(item)}</p>
          <TechniqueBadgeRow sets={item.sets} />
          {item.sets.map((set, index) => (
            <SetRow
              key={set.id}
              set={set}
              index={index}
              pairExerciseName={set.pairExerciseId ? pairExerciseNamesById[set.pairExerciseId] : undefined}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
