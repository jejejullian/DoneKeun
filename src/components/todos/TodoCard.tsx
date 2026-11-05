import type { Todo } from "@/generated/prisma/client";
import TodoDialog from "./TodoDialog";
import { formatDate, formatDateUTC, getDueState, toDateInputValue } from "@/lib/date";
import type { DueState } from "@/lib/date";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import TodoStatusButton from "./TodoStatusButton";
import TodoDeleteButton from "./TodoDeleteButton";

const DUE_STYLES: Record<DueState, string> = {
  overdue: "border-destructive bg-destructive/20 text-red-800 dark:text-destructive",
  today: "border-warning bg-warning/20 text-amber-800 dark:text-warning",
  normal: "border-border bg-muted/20 text-muted-foreground",
};

export default function TodoCard({ todo }: { todo: Todo }) {
  const dueState = todo.dueDate ? getDueState(todo.dueDate, todo.status) : null;

  return (
    <div className="rounded-md border bg-card p-3 shadow-sm">
      {/* Due Date  */}
      {todo.dueDate && dueState && (
        <div className="mb-2 flex">
          <span className={cn("ml-auto inline-flex items-center gap-1 rounded-full border px-2 text-sm", DUE_STYLES[dueState])}>
            <CalendarIcon className="size-3" />
            {formatDateUTC(todo.dueDate)}
          </span>
        </div>
      )}
      {/* Judul*/}
      <div className="font-medium line-clamp-2 wrap-anywhere border-b border-muted-foreground">{todo.title}</div>

      {/* Deskripsi */}
      {todo.description && <p className="mt-2 line-clamp-2 wrap-anywhere whitespace-pre-line text-sm text-muted-foreground first-letter:uppercase">{todo.description}</p>}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatDate(todo.createdAt)}</span>

        <div className="flex items-center gap-1">
          <TodoDialog
            todo={{
              id: todo.id,
              title: todo.title,
              description: todo.description,
              status: todo.status,
              dueDate: todo.dueDate ? toDateInputValue(todo.dueDate) : "",
            }}
          />
          <TodoDeleteButton id={todo.id} title={todo.title} />
          <TodoStatusButton id={todo.id} status={todo.status} />
        </div>
      </div>
    </div>
  );
}
