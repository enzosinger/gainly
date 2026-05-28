import type { Routine } from "../types/domain";

function isActiveRoutine(routine: Routine) {
  return routine.isActive !== false;
}

function orderRoutinesByFullIds(routines: Routine[], nextIds: string[]) {
  const routinesById = new Map(routines.map((routine) => [routine.id, routine]));
  const seenIds = new Set<string>();
  const reordered = nextIds
    .map((id) => routinesById.get(id))
    .filter((routine): routine is Routine => routine !== undefined)
    .filter((routine) => {
      if (seenIds.has(routine.id)) {
        return false;
      }
      seenIds.add(routine.id);
      return true;
    });

  return [...reordered, ...routines.filter((routine) => !seenIds.has(routine.id))];
}

export function orderRoutinesByActiveIds(routines: Routine[], nextActiveIds: string[]) {
  const activeIds = new Set(routines.filter(isActiveRoutine).map((routine) => routine.id));
  const requestedIds = new Set<string>();
  const requestedActiveRoutines = orderRoutinesByFullIds(routines, nextActiveIds).filter((routine) => {
    if (!activeIds.has(routine.id) || requestedIds.has(routine.id)) {
      return false;
    }
    requestedIds.add(routine.id);
    return true;
  });
  const missingActiveRoutines = routines.filter((routine) => isActiveRoutine(routine) && !requestedIds.has(routine.id));
  const nextActiveRoutines = [...requestedActiveRoutines, ...missingActiveRoutines];
  const nextRoutines = [...routines];
  let nextActiveIndex = 0;

  routines.forEach((routine, index) => {
    if (!isActiveRoutine(routine)) {
      return;
    }

    const nextRoutine = nextActiveRoutines[nextActiveIndex];
    if (nextRoutine) {
      nextRoutines[index] = nextRoutine;
      nextActiveIndex += 1;
    }
  });

  return nextRoutines;
}

export function orderRoutinesByIds(routines: Routine[], nextIds: string[]) {
  return nextIds.length >= routines.length
    ? orderRoutinesByFullIds(routines, nextIds)
    : orderRoutinesByActiveIds(routines, nextIds);
}
