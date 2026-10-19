import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TodoDialog from "@/components/todos/TodoDialog";

function formatStatus(status: string) {
  const map: Record<string, string> = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    DONE: "Done",
  };
  return map[status] || status; // Jika tidak ketemu, tampilkan aslinya
}

export default async function TodosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <TodoDialog />
      </div>

      {todos.length === 0 ? (
        <p className="text-muted-foreground">No todos yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="bg-card flex justify-between items-center p-3 border rounded-md shadow-sm">
              <span className="font-medium">{todo.title}</span>
              <span className="text-sm text-muted-foreground font-medium Capitalize">{formatStatus(todo.status)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
