import type { Doc, Id } from "./_generated/dataModel";

type RoutineExerciseForOrdering = Pick<Doc<"routineExercises">, "_id" | "publicId" | "position">;

export function buildRoutineExercisePositionUpdates(
  routineExercises: RoutineExerciseForOrdering[],
  requestedIds: string[],
): Array<{ routineExerciseId: Id<"routineExercises">; position: number }> {
  if (routineExercises.length !== requestedIds.length) {
    throw new Error("Routine exercise order must include every exercise.");
  }

  const rowsByPublicId = new Map(routineExercises.map((row) => [row.publicId, row]));
  const seenIds = new Set<string>();

  return requestedIds.map((publicId, position) => {
    if (seenIds.has(publicId)) {
      throw new Error("Routine exercise order cannot contain duplicates.");
    }

    const row = rowsByPublicId.get(publicId);
    if (!row) {
      throw new Error("Routine exercise order contains an unknown exercise.");
    }

    seenIds.add(publicId);
    return {
      routineExerciseId: row._id,
      position,
    };
  });
}
