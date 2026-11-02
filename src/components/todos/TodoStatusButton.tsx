"use client";

import { useState } from "react";
import type { TodoStatus } from "@/generated/prisma/enums";
import { NEXT_STATUS } from "@/lib/todo-status";
import { updateTodoStatus } from "@/app/(app)/todos/actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type TodoProps = {
  id: string;
  status: TodoStatus;
};

export default function TodoStatusButton({ id, status }: TodoProps) {
  const [loading, setLoading] = useState(false);

  const action = NEXT_STATUS[status];

  if (action == null) return null;

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await updateTodoStatus({ id, status: action.next });

      if (!result.success) {
        toast.add({
          type: "error",
          description: result.message || "Failed to update todo",
        });
        return;
      }
    } catch (err) {
      console.error("Failed to update todo status", err);
      toast.add({
        type: "error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="cursor-pointer" type="button" variant="ghost" size="icon-sm" onClick={handleClick} disabled={loading} aria-label={`Move to ${action.label}`}>
      <ArrowRight />
    </Button>
  );
}
