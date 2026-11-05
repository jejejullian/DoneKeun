import Link from "next/link";
import { STATUS_OPTIONS } from "@/lib/todo-status";
import type { Todo } from "@/generated/prisma/client";
import { TodoStatus } from "@/generated/prisma/enums";
import TodoCard from "./TodoCard";

type TodoBoardProps = {
  todos: Todo[];
  olderCount: number;
  showOlder: boolean;
};

export default function TodoBoard({ todos, olderCount, showOlder }: TodoBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {STATUS_OPTIONS.map((col) => {
        const items = todos.filter((t) => t.status === col.value);

        return (
          <section key={col.value}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`h-5 w-1 rounded-full ${col.color}`} />
              <h2 className="font-semibold">{col.label}</h2>
              <span className="text-sm text-muted-foreground">{items.length}</span>

              {col.value === TodoStatus.DONE && olderCount > 0 && (
                <div className="ml-auto text-xs font-medium">
                  {showOlder ? (
                    <Link href="/todos" className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                      Hide older
                    </Link>
                  ) : (
                    <Link href="/todos?older=1" className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                      Show older ({olderCount})
                    </Link>
                  )}
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No todos</p>
            ) : (
              <ul className="space-y-2">
                {items.map((todo) => (
                  <li key={todo.id}>
                    <TodoCard todo={todo} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
