import { z } from "zod";
import { TodoStatus } from "@/generated/prisma/enums";

export const MAX_TITLE = 100;
export const MAX_DESCRIPTION = 200;

export const CreateTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(MAX_TITLE, `Title must be at most ${MAX_TITLE} characters`),
  description: z
    .string()
    .trim()
    .max(MAX_DESCRIPTION, `Description must be at most ${MAX_DESCRIPTION} characters`)
    .transform((val) => (val === "" ? null : val))
    .optional(),
  status: z.enum(TodoStatus),
  dueDate: z.iso
    .date("Invalid date")
    .or(z.literal(""))
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v)),
});

export const UpdateTodoSchema = CreateTodoSchema.extend({
  id: z.cuid2(),
});

export const UpdateStatusSchema = z.object({
  id: z.cuid2(),
  status: z.enum(TodoStatus),
});
