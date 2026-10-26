"use client";

import { useState } from "react";
import { Plus, CalendarIcon, X } from "lucide-react";
import z from "zod";
import { CreateTodoSchema } from "@/lib/validations/todo";
import { TodoStatus } from "@/generated/prisma/enums";
import { createTodo } from "@/app/(app)/todos/actions";
import { STATUS_OPTIONS } from "@/lib/todo-status";
import { MAX_DESCRIPTION } from "@/lib/validations/todo";
import { formatDateUTC, toInputDateString, fromInputDateString, toUTCDateFromInput } from "@/lib/date";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function TodoDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.TODO);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueOpen, setDueOpen] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueOpen(false);
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

    const parsed = CreateTodoSchema.safeParse({ title, status, description, dueDate });
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await createTodo({ title, status, description, dueDate });

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

            <Field data-invalid={!!fieldErrors.dueDate}>
              <FieldLabel htmlFor="todo-due-date">Due date</FieldLabel>
              <div className="flex gap-2">
                <Popover open={dueOpen} onOpenChange={setDueOpen}>
                  <PopoverTrigger id="todo-due-date" render={<Button type="button" variant="outline" className="h-10 flex-1 justify-start" aria-invalid={!!fieldErrors.dueDate} />}>
                    <CalendarIcon className="size-4" />
                    {dueDate ? formatDateUTC(toUTCDateFromInput(dueDate)!) : "Pick a date"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromInputDateString(dueDate)}
                      defaultMonth={fromInputDateString(dueDate)}
                      onSelect={(d) => {
                        setDueDate(d ? toInputDateString(d) : "");
                        setDueOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {dueDate && (
                  <Button type="button" variant="ghost" size="icon" className="size-10 cursor-pointer" aria-label="Clear due date" onClick={() => setDueDate("")}>
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              {fieldErrors.dueDate?.[0] && <FieldError>{fieldErrors.dueDate[0]}</FieldError>}
            </Field>

            <Field data-invalid={!!fieldErrors.description}>
              <FieldLabel htmlFor="todo-description">Description</FieldLabel>
              <Textarea id="todo-description" className="resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your Description" aria-invalid={!!fieldErrors.description} />
              <FieldDescription className={description.length > MAX_DESCRIPTION ? "text-destructive" : ""}>
                {description.length}/{MAX_DESCRIPTION}
              </FieldDescription>
              {fieldErrors.description?.[0] && <FieldError>{fieldErrors.description[0]}</FieldError>}
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
