"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import z from "zod";
import { CreateTodoSchema } from "@/lib/validations/todo";
import { TodoStatus } from "@/generated/prisma/enums";
import { createTodo } from "@/app/(app)/todos/actions";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { STATUS_OPTIONS } from "@/lib/todo-status";


export default function TodoDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.TODO);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setTitle("");
    setStatus(TodoStatus.TODO);
    setFieldErrors({});
    setError("");
  }

  function handleOpenChange(next: boolean, eventDetails?: { reason: string; cancel: () => void }) {
    if (!next && eventDetails?.reason === "escape-key") {
      eventDetails.cancel();
      return;
    }
    setOpen(next);
    if (!next) resetForm();
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setFieldErrors({});

    const parsed = CreateTodoSchema.safeParse({ title, status });
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await createTodo({ title, status });

      if (!result.success) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        else if (result.message) setError(result.message);

        return;
      }

      toast.add({
        type: "success",
        description: "Todo created",
      });

      handleOpenChange(false);
    } catch (err) {
      console.error("Failed to create todo.", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog disablePointerDismissal open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="flex items-center px-4 h-8 cursor-pointer rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover">
            <Plus className="size-5" /> Add todo
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={!!fieldErrors.title}>
              <FieldLabel htmlFor="todo-title">Title</FieldLabel>
              <Input id="todo-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your title" aria-invalid={!!fieldErrors.title} className="h-10" />
              {fieldErrors.title?.[0] && <FieldError>{fieldErrors.title[0]}</FieldError>}
            </Field>

            <Field data-invalid={!!fieldErrors.status}>
              <FieldLabel htmlFor="todo-status">Status</FieldLabel>
              <Select
                items={STATUS_OPTIONS}
                value={status}
                onValueChange={(v) => {
                  if (v) setStatus(v as TodoStatus);
                }}
              >
                <SelectTrigger id="todo-status" className="py-5 w-full" aria-invalid={!!fieldErrors.status}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem className="h-10 cursor-pointer" key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldErrors.status?.[0] && <FieldError>{fieldErrors.status[0]}</FieldError>}
            </Field>
            {/* Global Error (dari server) */}
            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>

          <DialogFooter>
            <DialogClose className="cursor-pointer" render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button className="cursor-pointer" type="submit" disabled={loading}>
              {loading && <Spinner />} Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
