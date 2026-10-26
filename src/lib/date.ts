// TAMPILAN (format untuk ditampilkan di UI)
// Tanggal dibuat (ada jam) → ditampilkan dalam waktu Jakarta.
export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

// Due date (tanpa jam) → ditampilkan dalam UTC supaya tidak geser hari.
export function formatDateUTC(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// DATABASE / SERVER (jalur UTC, string YYYY-MM-DD <-> Date UTC)
// Date dari database (UTC) → teks YYYY-MM-DD untuk dikirim/ditampilkan di input. 
export function toDateInputValue(date: Date | null) {
  return date?.toISOString().split("T")[0] ?? "";
}

// Teks YYYY-MM-DD dari client → Date UTC untuk disimpan lewat Prisma.
export function toUTCDateFromInput(date: string | null | undefined) {
  if (date === null || date === undefined) {
    return date;
  }

  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// KALENDER SHADCN (jalur lokal, hanya jembatan ke komponen Calendar)
// Dari kalender (Date lokal) → teks YYYY-MM-DD.
export function toInputDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Dari teks YYYY-MM-DD → Date lokal untuk kalender.
export function fromInputDateString(value: string) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}
