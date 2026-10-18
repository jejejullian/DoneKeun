import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TodoDialog from "@/components/todos/TodoDialog";

export default async function TodosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1>Welcome, {session.user.name}</h1>
      <TodoDialog />
    </div>
  );
}