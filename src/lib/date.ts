/** Tanggal dibuat (ada jam) → Jakarta. */
export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

/** Due date (tanpa jam) → UTC. */
export function formatDateUTC(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function toDateInputValue(date: Date | null) {
  return date?.toISOString().split("T")[0] ?? "";
}

export function toUTCDateFromInput(date: string | null | undefined) {
  if (date === null || date === undefined) {
    return date;
  }
  
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
}
