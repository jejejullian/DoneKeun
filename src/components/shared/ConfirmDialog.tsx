"use client";

import { useState, useTransition, type ReactNode } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => Promise<boolean>;
};

export function ConfirmDialog({ trigger, title, description, confirmText, onConfirm }: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        const ok = await onConfirm();
        if (ok) setOpen(false);
      } catch {}
    });
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!pending) setOpen(next);
        }}
      >
        <AlertDialogContent className="overflow-hidden">
          <AlertDialogHeader className="min-w-0">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className="wrap-anywhere">{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button className="cursor-pointer" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="cursor-pointer" variant="destructive" disabled={pending} onClick={handleConfirm}>
              {pending ? "Processing..." : confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
