import type { Todo } from "@/generated/prisma/client";
import { formatDate } from "@/lib/date";

export default function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="font-medium line-clamp-2 wrap-anywhere">{todo.title}</div>
      <div className="text-sm text-muted-foreground">{formatDate(todo.createdAt)}</div>
    </div>
  );
}
