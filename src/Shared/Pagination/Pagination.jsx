import React from "react";
import { Button } from "@/components/ui/button";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {

  return (
    <div className="flex items-center gap-6 mt-6 px-2">
      <Button
        variant="ghost"
        className="p-0 h-auto text-xs text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white disabled:opacity-30 transition-colors font-medium"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="ghost"
        className="p-0 h-auto text-xs text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white disabled:opacity-30 transition-colors font-medium"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
