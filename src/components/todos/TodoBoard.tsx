import { TodoStatus } from "@/generated/prisma/enums";
import { STATUS_OPTIONS } from "@/lib/todo-status";

type BoardTodo = { id: string; title: string; status: TodoStatus };

export default function TodoBoard({ todos }: { todos: BoardTodo[] }) {
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
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No todos</p>
            ) : (
              <ul className="space-y-2">
                {items.map((todo) => (
                  <li key={todo.id} className="rounded-md border bg-card p-3">
                    {todo.title}
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
