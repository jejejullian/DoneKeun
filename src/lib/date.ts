export function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
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
