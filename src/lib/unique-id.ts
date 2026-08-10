export function uniqueId(baseId: string, existingIds: Iterable<string>, separator = "-"): string {
  const existing = new Set(existingIds);
  if (!existing.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  let nextId = `${baseId}${separator}${suffix}`;
  while (existing.has(nextId)) {
    suffix += 1;
    nextId = `${baseId}${separator}${suffix}`;
  }
  return nextId;
}
