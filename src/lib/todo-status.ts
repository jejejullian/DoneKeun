import { TodoStatus } from "@/generated/prisma/enums";

export const STATUS_OPTIONS = [
  { value: TodoStatus.TODO, label: "To do", color: "bg-slate-400" },
  { value: TodoStatus.IN_PROGRESS, label: "In progress", color: "bg-blue-500" },
  { value: TodoStatus.DONE, label: "Done", color: "bg-green-500" },
];

export const NEXT_STATUS: Partial<Record<TodoStatus, { next: TodoStatus; label: string }>> = {
  [TodoStatus.TODO]: { next: TodoStatus.IN_PROGRESS, label: "In progress" },
  [TodoStatus.IN_PROGRESS]: { next: TodoStatus.DONE, label: "Done" },
};
