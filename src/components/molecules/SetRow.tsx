import type { WorkoutSessionSet, WorkoutSetInput } from "../../types/domain";
import { useLanguage } from "../../i18n/LanguageProvider";
import { getTechniqueLabel } from "../../i18n/copy";
import { MovementFields, SetNumberField, TechniqueNote } from "./SetRowFields";
import { useWorkoutSetDraft } from "../../hooks/use-workout-set-draft";

type SetRowProps = {
  set: WorkoutSessionSet;
  index: number;
  previousSet?: WorkoutSessionSet;
  primaryExerciseName: string;
  pairExerciseName?: string;
  onCommit: (input: WorkoutSetInput) => Promise<void>;
};

function formatPerformance(weightKg?: number, reps?: number) {
  const parts = [];
  if (weightKg) parts.push(`${weightKg} kg`);
  if (reps) parts.push(`${reps} reps`);
  return parts.length > 0 ? parts.join(" · ") : null;
}


export default function SetRow({ set, index, previousSet, primaryExerciseName, pairExerciseName, onCommit }: SetRowProps) {
  const { copy, language } = useLanguage();
  const { draft, updateDraft } = useWorkoutSetDraft(set, onCommit);
  const technique = getTechniqueLabel(language, set.technique);
  const isSuperset = set.technique === "superset" && Boolean(pairExerciseName);

  function previousText(weightKg?: number, reps?: number) {
    const summary = formatPerformance(weightKg, reps);
    return summary ? copy.builder.previousWorkout(summary) : "--";
  }

  const previous = previousText(previousSet?.weightKg, previousSet?.reps);
  const showTechnique = set.technique !== "normal";

  return (
    <div className="py-3 text-sm text-[hsl(var(--foreground))]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <p className="shrink-0 font-medium text-[hsl(var(--muted-foreground))]">{copy.builder.setIndex(index + 1)}</p>
          {!isSuperset ? (
            <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">{previous}</p>
          ) : null}
        </div>
        {showTechnique ? (
          <p className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{technique}</p>
        ) : null}
      </div>

      {isSuperset ? (
        <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
          <MovementFields
            name={primaryExerciseName}
            previous={previousText(previousSet?.weightKg, previousSet?.reps)}
            weightValue={draft.weightKg}
            repsValue={draft.reps}
            weightPlaceholder={previousSet?.weightKg ? `${previousSet.weightKg}` : "kg"}
            repsPlaceholder={previousSet?.reps ? `${previousSet.reps}` : "reps"}
            onWeightChange={(value) => updateDraft("weightKg", value)}
            onRepsChange={(value) => updateDraft("reps", value)}
          />
          <MovementFields
            name={pairExerciseName ?? ""}
            previous={previousText(previousSet?.pairWeightKg, previousSet?.pairReps)}
            weightValue={draft.pairWeightKg}
            repsValue={draft.pairReps}
            weightPlaceholder={previousSet?.pairWeightKg ? `${previousSet.pairWeightKg}` : "kg"}
            repsPlaceholder={previousSet?.pairReps ? `${previousSet.pairReps}` : "reps"}
            onWeightChange={(value) => updateDraft("pairWeightKg", value)}
            onRepsChange={(value) => updateDraft("pairReps", value)}
          />
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-2">
          <SetNumberField
            label={copy.builder.weight}
            value={draft.weightKg}
            placeholder={previousSet?.weightKg ? `${previousSet.weightKg}` : "kg"}
            step="0.5"
            inputMode="decimal"
            onChange={(value) => updateDraft("weightKg", value)}
          />
          <SetNumberField
            label={copy.builder.reps}
            value={draft.reps}
            placeholder={previousSet?.reps ? `${previousSet.reps}` : "reps"}
            step="1"
            inputMode="numeric"
            onChange={(value) => updateDraft("reps", value)}
          />
        </div>
      )}
      <TechniqueNote set={set} />
    </div>
  );
}
