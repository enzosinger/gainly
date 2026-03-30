import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useGainlyStore } from "../../../state/gainly-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

export default function ExerciseLibraryList() {
  const { exercises, deleteExercise } = useGainlyStore();
  const [pendingDeleteExerciseId, setPendingDeleteExerciseId] = useState<string | null>(null);
  const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(null);

  async function handleDelete(exerciseId: string) {
    if (deletingExerciseId) {
      return;
    }

    setDeletingExerciseId(exerciseId);

    try {
      await deleteExercise(exerciseId);
    } finally {
      setDeletingExerciseId(null);
    }
  }

  const pendingDeleteExercise = exercises.find((exercise) => exercise.id === pendingDeleteExerciseId) ?? null;

  return (
    <>
      <div className="grid gap-3">
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
              <div className="space-y-2">
                <p className="eyebrow">Exercise</p>
                <CardTitle className="text-base">{exercise.name}</CardTitle>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="capitalize">
                  {exercise.muscleGroup}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Delete ${exercise.name} exercise`}
                  disabled={deletingExerciseId === exercise.id}
                  onClick={() => setPendingDeleteExerciseId(exercise.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        ))}
      </div>
      <AlertDialog open={pendingDeleteExercise !== null} onOpenChange={(open) => !open && setPendingDeleteExerciseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete exercise?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteExercise
                ? `Delete ${pendingDeleteExercise.name}? This will remove it from your routines and workout history.`
                : "This will remove the exercise from your routines and workout history."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingExerciseId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingDeleteExercise || deletingExerciseId !== null}
              onClick={() => {
                if (!pendingDeleteExercise) {
                  return;
                }

                void handleDelete(pendingDeleteExercise.id);
              }}
            >
              Delete exercise
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
