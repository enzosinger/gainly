import type { MuscleGroup, RoutineExercise, WorkoutSessionExercise, WorkoutSetInput } from "../../../types/domain";
import { getMuscleGroupLabel } from "../../../i18n/copy";
import { useLanguage } from "../../../i18n/LanguageProvider";
import SetRow from "../../molecules/SetRow";
import { Badge } from "../../ui/badge";

type ExerciseLogPanelProps = {
  item: RoutineExercise;
  name: string;
  primaryExerciseName: string;
  description?: string | null;
  muscleGroup?: MuscleGroup;
  currentExercise: WorkoutSessionExercise;
  previousExercise?: WorkoutSessionExercise | null;
  pairExerciseNamesById: Record<string, string>;
  onCommitSet: (setId: string, input: WorkoutSetInput) => Promise<void>;
};

export default function ExerciseLogPanel({
  item,
  name,
  primaryExerciseName,
  description,
  muscleGroup,
  currentExercise,
  previousExercise,
  pairExerciseNamesById,
  onCommitSet,
}: ExerciseLogPanelProps) {
  const { copy, language } = useLanguage();
  const repRangeMin = currentExercise.repRangeMin ?? item.repRangeMin;
  const repRangeMax = currentExercise.repRangeMax ?? item.repRangeMax;
  const repRangeText =
    repRangeMin !== undefined && repRangeMax !== undefined
      ? `${repRangeMin}-${repRangeMax}`
      : null;
  const exerciseMeta = [
    repRangeText ? `${copy.builder.repRange}: ${repRangeText}` : null,
    `${copy.builder.warmupSets}: ${currentExercise.warmupSets ?? 0}`,
    `${copy.builder.feederSets}: ${currentExercise.feederSets ?? 0}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="panel-card min-w-0">
      <div className="border-b border-[hsl(var(--border))] px-4 py-4">
        <div className="min-w-0 space-y-2">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <h2 className="min-w-0 truncate text-xl font-semibold text-[hsl(var(--foreground))]">{name}</h2>
            {muscleGroup ? (
              <Badge variant="outline" className="w-fit shrink-0">
                {getMuscleGroupLabel(language, muscleGroup)}
              </Badge>
            ) : null}
          </div>
          {description?.trim() ? (
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description.trim()}</p>
          ) : null}
          <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{exerciseMeta}</p>
        </div>
      </div>
      <div className="divide-y divide-[hsl(var(--border))] px-4 py-1">
        {currentExercise.sets.map((set, index) => {
          const previousSet = previousExercise?.sets.find((candidate) => candidate.templateSetId === set.templateSetId);

          return (
            <SetRow
              key={set.id}
              set={set}
              index={index}
              previousSet={previousSet}
              primaryExerciseName={primaryExerciseName}
              pairExerciseName={set.pairExerciseId ? pairExerciseNamesById[set.pairExerciseId] : undefined}
              onCommit={(input) => onCommitSet(set.id, input)}
            />
          );
        })}
      </div>
    </section>
  );
}
