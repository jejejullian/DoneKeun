import type { Todo } from "@/generated/prisma/client";
import { formatDate } from "@/lib/date";

export default function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm">
      {/* Judul*/}
      <div className="font-medium line-clamp-2 wrap-anywhere border-b border-muted-foreground">{todo.title}</div>

      {/* Deskripsi */}
      {todo.description && (
        <p className="mt-2 line-clamp-2 wrap-anywhere whitespace-pre-line text-sm text-muted-foreground first-letter:uppercase">
          {todo.description}
        </p>
      )}

      {/* Tanggal */}
      <div className="mt-3 text-sm text-muted-foreground">{formatDate(todo.createdAt)}</div>
    </div>
  );
}
