  "use server";

  import { auth } from "@/lib/auth";
  import { CreateTodoSchema } from "@/lib/validations/todo";
  import { headers } from "next/headers";
  import { redirect } from "next/navigation";
  import { toUTCDateFromInput } from "@/lib/date";
  import prisma from "@/lib/prisma";
  import { revalidatePath } from "next/cache";
  import { TodoStatus } from "@/generated/prisma/enums";
  import z from "zod";

  async function getSession() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/login");
    }

    return session;
  }

  export async function createTodo(data: z.input<typeof CreateTodoSchema>) {
    const session = await getSession();

    const parsed = CreateTodoSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false as const,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      };
    }

    const completedAt = parsed.data.status === TodoStatus.DONE ? new Date() : null;

    const dueDate = toUTCDateFromInput(parsed.data.dueDate);

    try {
      await prisma.todo.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          status: parsed.data.status,
          dueDate,
          completedAt,
          userId: session.user.id,
        },
      });
      revalidatePath("/todos");
      return { success: true as const };
    } catch (err) {
      console.error("Failed save todo", err);
      return { success: false as const, message: "Failed to save todo." };
    }
  }
