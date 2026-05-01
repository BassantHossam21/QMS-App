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
import { Trash2 } from "lucide-react";

export default function DeleteConfirmation({
  children,
  open,
  onOpenChange,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  const controlled = open !== undefined && onOpenChange !== undefined;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!controlled && (
        <AlertDialogTrigger asChild>
          {children || <Button variant="outline">Open</Button>}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="bg-white dark:bg-[#111827] border border-black/10 dark:border-gray-800 rounded-[24px] max-w-[300px] w-[95vw] p-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Enhanced Icon Section */}
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-5 relative">
            <div className="absolute inset-0 bg-red-200/20 dark:bg-red-500/5 rounded-full animate-ping duration-1000 opacity-20" />
            <Trash2 size={30} className="text-red-500 relative z-10" strokeWidth={1.5} />
          </div>

          <AlertDialogHeader className="space-y-3 mb-8 w-full">
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-row justify-center gap-3 w-full sm:space-x-0">
            <AlertDialogCancel
              onClick={onCancel}
              className="flex-1 m-0 mt-0 px-2 py-5 rounded-[12px] border border-black/10 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200"
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="flex-1 m-0 px-2 py-5 rounded-[12px] bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 shadow-md shadow-red-500/25 active:scale-[0.98]"
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
