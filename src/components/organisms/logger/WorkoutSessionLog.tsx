import type { WorkoutSetInput } from "../../../types/domain";
import type { WorkoutExerciseEntry } from "../../../lib/workout-logger";
import { Button } from "../../ui/button";
import ExerciseLogPanel from "./ExerciseLogPanel";
import WorkoutExerciseList from "./WorkoutExerciseList";

type WorkoutSessionLogProps = {
  workoutExercises: WorkoutExerciseEntry[];
  selectedWorkoutExercise: WorkoutExerciseEntry | null;
  selectedId?: string | null;
  pairExerciseNamesById: Record<string, string>;
  sessionStatusText: string;
  completeLabel: string;
  workflowMessage?: string | null;
  onSelectExercise: (id: string) => void;
  onCommitSet: (setId: string, input: WorkoutSetInput) => Promise<void>;
  onComplete: () => void;
};

export default function WorkoutSessionLog({
  workoutExercises,
  selectedWorkoutExercise,
  selectedId,
  pairExerciseNamesById,
  sessionStatusText,
  completeLabel,
  workflowMessage,
  onSelectExercise,
  onCommitSet,
  onComplete,
}: WorkoutSessionLogProps) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <WorkoutExerciseList
          items={workoutExercises.map((exercise) => ({
            id: exercise.item.id,
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            setCount: exercise.currentExercise.sets.length,
          }))}
          selectedId={selectedId}
          onSelect={onSelectExercise}
        />
        {selectedWorkoutExercise ? (
          <ExerciseLogPanel
            item={selectedWorkoutExercise.item}
            name={selectedWorkoutExercise.name}
            primaryExerciseName={selectedWorkoutExercise.primaryExerciseName}
            muscleGroup={selectedWorkoutExercise.muscleGroup}
            description={selectedWorkoutExercise.description}
            currentExercise={selectedWorkoutExercise.currentExercise}
            previousExercise={selectedWorkoutExercise.previousExercise}
            pairExerciseNamesById={pairExerciseNamesById}
            onCommitSet={onCommitSet}
          />
        ) : null}
      </div>
      {workflowMessage ? (
        <div className="panel-inset border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
          {workflowMessage}
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{sessionStatusText}</p>
        <Button className="sm:w-auto" onClick={onComplete}>
          {completeLabel}
        </Button>
      </div>
    </>
  );
}
