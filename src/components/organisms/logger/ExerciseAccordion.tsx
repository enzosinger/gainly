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
  const previousSet = item.sets.find(
    (set) => set.weightKg || set.reps || set.leftReps || set.rightReps || set.pairWeightKg || set.pairReps,
  );

  if (!previousSet) return "Previous --";
  if (previousSet.weightKg && previousSet.reps) return `Previous ${previousSet.weightKg} kg x ${previousSet.reps}`;
  if (previousSet.weightKg) return `Previous ${previousSet.weightKg} kg`;
  if (previousSet.reps) return `Previous x ${previousSet.reps}`;
  if (previousSet.leftReps || previousSet.rightReps) {
    return `Previous L ${previousSet.leftReps ?? "--"} / R ${previousSet.rightReps ?? "--"}`;
  }
  if (previousSet.pairWeightKg && previousSet.pairReps) {
    return `Previous pair ${previousSet.pairWeightKg} kg x ${previousSet.pairReps}`;
  }
  return "Previous --";
}

export default function ExerciseAccordion({ item, name, pairExerciseNamesById }: ExerciseAccordionProps) {
  const { expandedExerciseId, setExpandedExerciseId } = useGainlyStore();
  const expanded = expandedExerciseId === item.id;

  return (
    <section className="rounded-[26px] border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={() => setExpandedExerciseId(expanded ? null : item.id)}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
        aria-expanded={expanded}
      >
        <span className="text-base font-semibold">{name}</span>
        <ChevronDown className={expanded ? "size-5 rotate-180" : "size-5"} />
      </button>
      {expanded ? (
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          <p className="text-sm text-white/55">{getPreviousPerformance(item)}</p>
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
