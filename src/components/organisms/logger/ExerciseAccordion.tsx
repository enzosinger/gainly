import { ChevronDown } from "lucide-react";
import { useGainlyStore } from "../../../state/gainly-store";
import type { RoutineExercise, WorkoutSessionExercise } from "../../../types/domain";
import SetRow from "../../molecules/SetRow";
import TechniqueBadgeRow from "./TechniqueBadgeRow";

type ExerciseAccordionProps = {
  item: RoutineExercise;
  name: string;
  currentExercise: WorkoutSessionExercise;
  previousExercise?: WorkoutSessionExercise | null;
  pairExerciseNamesById: Record<string, string>;
  onCommitSet: (
    setId: string,
    input: {
      weightKg: number | null;
      reps: number | null;
      pairWeightKg: number | null;
      pairReps: number | null;
    },
  ) => void;
};

function getPreviousPerformance(previousExercise?: WorkoutSessionExercise | null) {
  const previousSet = previousExercise?.sets.find((set) => set.weightKg || set.reps || set.pairWeightKg || set.pairReps);

  if (!previousSet) return "Previous --";
  if (previousSet.weightKg && previousSet.reps) return `Previous ${previousSet.weightKg} kg x ${previousSet.reps}`;
  if (previousSet.weightKg) return `Previous ${previousSet.weightKg} kg`;
  if (previousSet.reps) return `Previous x ${previousSet.reps}`;
  if (previousSet.pairWeightKg && previousSet.pairReps) {
    return `Previous pair ${previousSet.pairWeightKg} kg x ${previousSet.pairReps}`;
  }
  return "Previous --";
}

export default function ExerciseAccordion({
  item,
  name,
  currentExercise,
  previousExercise,
  pairExerciseNamesById,
  onCommitSet,
}: ExerciseAccordionProps) {
  const { expandedExerciseId, setExpandedExerciseId } = useGainlyStore();
  const expanded = expandedExerciseId === item.id;

  return (
    <section className="panel-card">
      <button
        type="button"
        onClick={() => setExpandedExerciseId(expanded ? null : item.id)}
        className="flex w-full items-center justify-between px-4 py-4 text-left text-[hsl(var(--foreground))]"
        aria-expanded={expanded}
      >
        <span className="text-base font-semibold">{name}</span>
        <ChevronDown
          className={
            expanded
              ? "size-5 rotate-180 text-[hsl(var(--muted-foreground))]"
              : "size-5 text-[hsl(var(--muted-foreground))]"
          }
        />
      </button>
      {expanded ? (
        <div className="space-y-3 border-t border-[hsl(var(--border))] px-4 py-4">
          <div className="panel-inset px-3 py-2">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{getPreviousPerformance(previousExercise)}</p>
          </div>
          <TechniqueBadgeRow sets={currentExercise.sets} />
          {currentExercise.sets.map((set, index) => {
            const previousSet = previousExercise?.sets.find((candidate) => candidate.templateSetId === set.templateSetId);

            return (
              <SetRow
                key={set.id}
                set={set}
                index={index}
                previousSet={previousSet}
                pairExerciseName={set.pairExerciseId ? pairExerciseNamesById[set.pairExerciseId] : undefined}
                onCommit={(input) => onCommitSet(set.id, input)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
