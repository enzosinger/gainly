import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ExercisePicker from "../components/organisms/routine-builder/ExercisePicker";
import RoutineExerciseEditor from "../components/organisms/routine-builder/RoutineExerciseEditor";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { useGainlyStore } from "../state/gainly-store";
import { useLanguage } from "../i18n/LanguageProvider";

export default function RoutineDetailPage() {
  const {
    routines,
    exercises,
    isLoading,
    addSetToRoutineExercise,
    removeSetFromRoutineExercise,
    removeExerciseFromRoutine,
    addTechniqueToRoutineExercise,
    updateRoutineExerciseRepRange,
    updateRoutineExerciseWarmupSets,
    updateRoutineExerciseFeederSets,
  } = useGainlyStore();
  const { copy } = useLanguage();
  const { routineId } = useParams();
  const navigate = useNavigate();
  const routine = useMemo(() => routines.find((item) => item.id === routineId) ?? null, [routineId, routines]);
  const exercisesById = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), [exercises]);

  if (isLoading) {
    return (
      <section className="space-y-6 md:space-y-8" aria-busy="true">
        <header className="space-y-4">
          <div className="space-y-2">
            <p className="eyebrow">{copy.routineDetail.eyebrow}</p>
            <h1 className="screen-title">{copy.app.loading}</h1>
            <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
              {copy.routineDetail.description}
            </p>
          </div>
          <Skeleton className="h-11 w-full max-w-xs rounded-md" />
        </header>

        <div className="space-y-4">
          <Card role="status" aria-label={copy.app.loading}>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-4 w-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!routine) {
    return (
      <section className="space-y-4">
        <header className="space-y-2">
          <p className="eyebrow">{copy.routineDetail.eyebrow}</p>
          <h1 className="screen-title">{copy.routineDetail.notFoundTitle}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{copy.routineDetail.notFoundDescription}</p>
        </header>
        <Link to="/routines">
          <Button variant="outline">{copy.routines.backToRoutines}</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="screen-title">
              {routine.name} {copy.routineDetail.titleSuffix}
            </h1>
          </div>
          <label className="block w-full max-w-xs text-sm font-medium text-[hsl(var(--foreground))]">
            <span className="mb-2 block">{copy.routineDetail.routineLabel}</span>
            <Select value={routine.id} onChange={(event) => navigate(`/routines/${event.target.value}`)}>
              {routines.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">{copy.routineDetail.description}</p>
      </header>

      <div className="space-y-4">
        <ExercisePicker routineId={routine.id} />
        <div className="space-y-3">
          {routine.exercises.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-[hsl(var(--muted-foreground))]">{copy.routineDetail.emptyState}</CardContent>
            </Card>
          ) : null}
          {routine.exercises.map((item, index) => {
            const exercise = exercisesById.get(item.exerciseId);
            const pairExerciseId = item.sets.find((set) => {
              return set.technique === "superset" && Boolean(set.pairExerciseId);
            })?.pairExerciseId;
            const pairExerciseName = pairExerciseId ? exercisesById.get(pairExerciseId)?.name : undefined;

            if (!exercise) {
              return null;
            }

            return (
              <RoutineExerciseEditor
                key={item.id}
                index={index}
                exercise={exercise}
                pairExerciseName={pairExerciseName}
                item={item}
                onAddSet={(routineExerciseId) => addSetToRoutineExercise(routine.id, routineExerciseId)}
                onRemoveSet={(routineExerciseId, setId) =>
                  removeSetFromRoutineExercise(routine.id, routineExerciseId, setId)
                }
                onRemove={(routineExerciseId) => removeExerciseFromRoutine(routine.id, routineExerciseId)}
                onSelectTechnique={(routineExerciseId, technique) =>
                  addTechniqueToRoutineExercise(routine.id, routineExerciseId, technique)
                }
                onUpdateRepRange={(routineExerciseId, repRange) =>
                  updateRoutineExerciseRepRange(routine.id, routineExerciseId, repRange)
                }
                onUpdateWS={(routineExerciseId, count) =>
                  updateRoutineExerciseWarmupSets(routine.id, routineExerciseId, count)
                }
                onUpdateFS={(routineExerciseId, count) =>
                  updateRoutineExerciseFeederSets(routine.id, routineExerciseId, count)
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
