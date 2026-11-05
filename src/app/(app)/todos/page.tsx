import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TodoDialog from "@/components/todos/TodoDialog";
import TodoBoard from "@/components/todos/TodoBoard";
import { TodoStatus } from "@/generated/prisma/enums";
import { getDoneCutoff } from "@/lib/date";

export default async function TodosPage({ searchParams }: { searchParams: Promise<{ older?: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const cutoff = getDoneCutoff();

  const { older } = await searchParams;
  const isShowOlder = older === "1";

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { status: { not: TodoStatus.DONE } },
        {
          status: TodoStatus.DONE,
          ...(isShowOlder ? {} : { OR: [{ completedAt: { gte: cutoff } }, { completedAt: null }] }),
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const olderCount = await prisma.todo.count({
    where: {
      userId: session.user.id,
      status: TodoStatus.DONE,
      completedAt: { lt: cutoff },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <TodoDialog />
      </div>

      {todos.length === 0 && olderCount === 0 ? <p className="text-muted-foreground">No todos yet.</p> : <TodoBoard todos={todos} olderCount={olderCount} showOlder={isShowOlder} />}
    </div>
  );
}
