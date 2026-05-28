import type { Doc, Id } from "./_generated/dataModel";

type RoutineForOrdering = Pick<Doc<"routines">, "_id" | "position" | "isActive">;

function sortByPosition(routines: RoutineForOrdering[]) {
  return [...routines].sort((left, right) => left.position - right.position);
}

function isActiveRoutine(routine: RoutineForOrdering) {
  return routine.isActive !== false;
}

export function buildRoutineOrderIds(
  routines: RoutineForOrdering[],
  requestedIds: Array<Id<"routines">>,
) {
  const sortedRoutines = sortByPosition(routines);
  const routinesById = new Map(sortedRoutines.map((routine) => [routine._id, routine]));
  const seenIds = new Set<Id<"routines">>();
  const requestedRoutines = requestedIds.map((routineId) => {
    const routine = routinesById.get(routineId);

    if (!routine) {
      throw new Error("Routine not found.");
    }

    if (seenIds.has(routineId)) {
      throw new Error("Routine order contains duplicate routines.");
    }

    seenIds.add(routineId);
    return routine;
  });

  if (requestedRoutines.length === sortedRoutines.length) {
    return requestedRoutines.map((routine) => routine._id);
  }

  const allRequestedRoutinesAreActive = requestedRoutines.every(isActiveRoutine);

  if (!allRequestedRoutinesAreActive) {
    return [
      ...requestedRoutines.map((routine) => routine._id),
      ...sortedRoutines.filter((routine) => !seenIds.has(routine._id)).map((routine) => routine._id),
    ];
  }

  const missingActiveRoutines = sortedRoutines.filter(
    (routine) => isActiveRoutine(routine) && !seenIds.has(routine._id),
  );
  const nextActiveRoutines = [...requestedRoutines, ...missingActiveRoutines];
  const nextRoutines = [...sortedRoutines];
  let nextActiveIndex = 0;

  sortedRoutines.forEach((routine, index) => {
    if (!isActiveRoutine(routine)) {
      return;
    }

    const nextRoutine = nextActiveRoutines[nextActiveIndex];
    if (nextRoutine) {
      nextRoutines[index] = nextRoutine;
      nextActiveIndex += 1;
    }
  });

  return nextRoutines.map((routine) => routine._id);
}

export function buildRoutinePositionUpdates(
  routines: RoutineForOrdering[],
  requestedIds: Array<Id<"routines">>,
) {
  return buildRoutineOrderIds(routines, requestedIds).map((routineId, position) => ({
    routineId,
    position,
  }));
}
