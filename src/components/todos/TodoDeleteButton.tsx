"use client";
import { deleteTodo } from "@/app/(app)/todos/actions";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "../ui/toast";

type TodoProps = {
  id: string;
  title: string;
};

export default function TodoDeleteButton({ id, title }: TodoProps) {
  const shortTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title;
  return (
    <ConfirmDialog
      trigger={
        <Button className="cursor-pointer" variant="ghost" size="icon-sm" aria-label="Delete todo">
          <Trash2 />
        </Button>
      }
      title="Delete todo?"
      description={`"${shortTitle}" will be permanently deleted.`}
      confirmText="Delete"
      onConfirm={async () => {
        const result = await deleteTodo({ id });
        if (!result.success) {
          toast.add({
            type: "error",
            description: result.message ?? "Failed to delete todo.",
          });
          return false;
        }
        return result.success;
      }}
    />
  );
}
