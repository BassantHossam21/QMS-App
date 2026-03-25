import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmation({
  children,
  open,
  onOpenChange,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm, // function يتم تمريرها من بره
  onCancel,
  confirmSize = "default",
  cancelVariant = "outline",
  cancelSize = "default",
}) {
  // لو open و onOpenChange موجودين يبقى controlled
  const controlled = open !== undefined && onOpenChange !== undefined;

  return (
    <AlertDialog
      className="bg-white dark:bg-gray-800 text-black dark:text-gray-100"
      open={open}
      onOpenChange={onOpenChange}
    >
      {!controlled && (
        <AlertDialogTrigger asChild>
          {children || <Button variant="outline">Open</Button>}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="bg-white dark:bg-gray-800 text-black dark:text-gray-100">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            variant={cancelVariant}
            size={cancelSize}
            onClick={onCancel}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            size={confirmSize}
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
