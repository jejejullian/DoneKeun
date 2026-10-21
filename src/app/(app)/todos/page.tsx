import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TodoDialog from "@/components/todos/TodoDialog";
import TodoBoard from "@/components/todos/TodoBoard";

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

      {todos.length === 0 ? <p className="text-muted-foreground">No todos yet.</p> : <TodoBoard todos={todos} />}
    </div>
  );
}
