import React, { useEffect, useState } from "react";
import useQuestions from "@/Hooks/useQuestions";
import DeleteConfirmation from "@/Shared/DeleteConfirmation/DeleteConfirmation";
import Pagination from "@/Shared/Pagination/Pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Eye, Edit, Trash2, Plus, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Questions() {
  const {
    getAllQuestions,
    data: questions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  } = useQuestions();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleAddDialog = () => {
    setSelectedQuestion(null);
    reset({
      title: "",
      description: "",
      options: { A: "", B: "", C: "", D: "" },
      answer: "",
      type: "",
      difficulty: "",
    });
    setOpenDialog(true);
  };

  const handleEditDialog = (question) => {
    setSelectedQuestion(question);
    reset({
      ...question,
      options: question.options || { A: "", B: "", C: "", D: "" },
    });
    setOpenDialog(true);
  };

  const onSubmit = (data) => {
    const questionData = {
      title: data.title,
      description: data.description,
      options: data.options,
      answer: data.answer,
      difficulty: data.difficulty,
      type: data.type,
    };

    if (selectedQuestion) {
      updateQuestion(selectedQuestion._id, questionData);
    } else {
      createQuestion(questionData);
    }
    reset();
    setOpenDialog(false);
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil((questions?.length || 0) / itemsPerPage);
  const paginatedQuestions =
    questions?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="py-6 w-full bg-white dark:bg-[#0D1321] min-h-screen">
      <div className=" border border-black/20 dark:border-gray-800 rounded-[10px] shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#111827] border-b border-black/20 dark:border-gray-800 gap-4">
          <h2 className="text-xl font-bold text-black dark:text-gray-100">
            Bank of Questions
          </h2>
          <Button
            onClick={handleAddDialog}
            className="w-full sm:w-auto bg-white dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 text-[#1F2937] border border-black/20 dark:border-gray-600 rounded-[30px] py-6 sm:py-5 flex items-center justify-center gap-2 shadow-md font-bold transition-all"
          >
            <Plus
              size={18}
              className="bg-black text-white rounded-full p-1 size-6 sm:size-5"
              strokeWidth={3}
            />
            <span className="text-lg sm:text-base">Add Question</span>
          </Button>
        </div>

        {/* Table Content */}
        <div className="px-4 sm:px-6 py-6 bg-white dark:bg-[#111827]">
          <div className="border border-black/20 dark:border-gray-800 shadow-sm rounded-[10px] overflow-hidden overflow-x-auto">
            <Table className="min-w-[800px] w-full">
              <TableHeader className="bg-[#0D1321] dark:bg-black text-white ">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 dark:border-gray-700 last:border-r-0">
                    TITLE
                  </TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 dark:border-gray-700 last:border-r-0">
                    DESCRIPTION
                  </TableHead>
                  <TableHead className="text-white font-bold uppercase  text-[14px] tracking-wider border-r border-gray-800 dark:border-gray-700 last:border-r-0 text-center">
                    DIFFICULTY
                  </TableHead>
                  <TableHead className="text-white font-bold uppercase  text-[14px] tracking-wider border-r border-gray-800 dark:border-gray-700 last:border-r-0 text-center">
                    TYPE
                  </TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuestions.length > 0 ? (
                  paginatedQuestions.map((question, index) => (
                    <TableRow
                      key={question._id || index}
                      className="border-b border-black/20 dark:border-gray-800 last:border-0 hover:bg-gray-50/40 dark:hover:bg-[#1A1D23]"
                    >
                      <TableCell className="text-center py-6  text-black dark:text-gray-100 font-base text-[14px] border-r border-black/20 dark:border-gray-800 last:border-r-0">
                        {question.title}
                      </TableCell>
                      <TableCell className="text-center py-6 text-black dark:text-gray-100 font-base text-[14px] text-wrap border-r border-black/20 dark:border-gray-800 last:border-r-0">
                        {question.description ||
                          question.question ||
                          "No description"}
                      </TableCell>
                      <TableCell className="text-center  border-r border-black/20 dark:border-gray-800 last:border-r-0">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-[14px] font-medium  ${
                            question.difficulty === "easy"
                              ? "bg-[#ECFDF5] text-[#065F46]"
                              : question.difficulty === "hard"
                                ? "bg-[#FFF1F2] text-[#9F1239]"
                                : "bg-[#FFFBEB] text-[#92400E]"
                          }`}
                        >
                          {question.difficulty || "medium"}
                        </span>
                      </TableCell>
                      <TableCell className="  py-2 text-center border-r border-black/20 dark:border-gray-800 last:border-r-0">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-[14px] font-semibold border ${
                            question.type === "BE"
                              ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                              : question.type === "FE"
                                ? "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]"
                                : "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]"
                          }`}
                        >
                          {question.type || "FE"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-6 border-r border-black/20 dark:border-gray-800 last:border-r-0">
                        <div className="flex items-center justify-center gap-5">
                          <button
                            className="text-[#FB7C19] cursor-pointer hover:opacity-80 transition-opacity"
                            title="View"
                          >
                            <Eye size={18} strokeWidth={3} fillOpacity={0.1} />
                          </button>
                          <button
                            onClick={() => handleEditDialog(question)}
                            className="text-[#FB7C19] cursor-pointer hover:opacity-80 transition-opacity"
                            title="Edit"
                          >
                            <Edit size={18} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuestion(question);
                              setOpenDeleteModal(true);
                            }}
                            className="text-[#FB7C19] cursor-pointer hover:opacity-80 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 size={18} strokeWidth={3} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      No questions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* ================Add/Edit Question Modal ================ */}
        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            setOpenDialog(open);
            if (!open) setSelectedQuestion(null);
          }}
        >
          <DialogContent className="max-w-5xl! w-[95vw]! p-0 border border-black/15 dark:border-gray-700 rounded-[12px] bg-white dark:bg-[#111827] shadow-2xl [&>button]:hidden max-h-[90vh] flex flex-col overflow-hidden">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden min-h-0"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-4 sm:py-0 border-b border-black/10 dark:border-gray-800 min-h-[70px] bg-white dark:bg-[#111827] gap-3 sm:gap-0 shrink-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-gray-100 font-sans text-center sm:text-left">
                  {selectedQuestion
                    ? "Update question"
                    : "Set up a new question"}
                </DialogTitle>
                <div className="flex border-t sm:border-t-0 sm:border-l border-black/10 h-auto sm:h-[70px] items-center w-full sm:w-auto justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-r border-black/10 flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <Check
                      size={26}
                      strokeWidth={2.5}
                      className="text-black dark:text-gray-200"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                    className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <X
                      size={26}
                      strokeWidth={2.5}
                      className="text-black dark:text-gray-200"
                    />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto min-h-0 p-8 space-y-4 sm:space-y-3">
                <p className="font-semibold text-black/70 dark:text-gray-300 text-sm mb-2">
                  Details
                </p>

                {/* Title */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-800 rounded-[10px] overflow-hidden bg-white dark:bg-[#111827] shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0">
                    Title:
                  </span>
                  <Input
                    {...register("title", { required: true })}
                    className="flex-1 h-20 sm:h-12 border-none shadow-none text-black dark:text-gray-100 font-bold text-base sm:text-sm bg-transparent placeholder:text-gray-300 placeholder:text-base sm:placeholder:text-sm rounded-none focus-visible:ring-0 px-6 sm:px-4"
                    placeholder="Enter question title..."
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0">
                    Description
                  </span>
                  <Textarea
                    {...register("description")}
                    rows={4}
                    className="flex-1 px-6 sm:px-4 py-5 sm:py-3 border-none shadow-none text-black dark:text-gray-200 font-bold text-base sm:text-sm bg-transparent resize-none placeholder:text-gray-300 placeholder:text-base sm:placeholder:text-sm leading-relaxed rounded-none focus-visible:ring-0 min-h-[140px] sm:min-h-[80px]"
                    placeholder="Provide details about this question..."
                  />
                </div>

                {/* Difficulty | Right Answer | Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                    <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-32 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0 whitespace-nowrap">
                      Difficulty
                    </span>
                    <select
                      {...register("difficulty")}
                      className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-base sm:text-sm outline-none cursor-pointer"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                    <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-32 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0 whitespace-nowrap">
                      Right Answer
                    </span>
                    <select
                      {...register("answer", { required: true })}
                      className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                    <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-32 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0 whitespace-nowrap">
                      Category
                    </span>
                    <select
                      {...register("type")}
                      className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                    >
                      <option value="FE">FE</option>
                      <option value="BE">BE</option>
                      <option value="DO">DO</option>
                    </select>
                  </div>
                </div>

                {/* Options A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["A", "B", "C", "D"].map((opt) => (
                    <div
                      key={opt}
                      className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm"
                    >
                      <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-16 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0 w-full justify-center">
                        {opt}
                      </span>
                      <Input
                        {...register(`options.${opt}`, { required: true })}
                        className="flex-1 h-20 sm:h-12 border-none shadow-none text-black dark:text-gray-100 font-bold text-base sm:text-sm bg-transparent placeholder:text-gray-300 placeholder:text-base sm:placeholder:text-sm rounded-none focus-visible:ring-0 px-6 sm:px-4"
                        placeholder={`Option ${opt}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteConfirmation
          open={openDeleteModal}
          onOpenChange={setOpenDeleteModal}
          onConfirm={() => {
            if (selectedQuestion?._id) {
              deleteQuestion(selectedQuestion._id);
              setOpenDeleteModal(false);
              setSelectedQuestion(null);
            }
          }}
          title="Delete this question?"
          description="Are you sure you want to delete this question? This action cannot be undone."
        />
      </div>
    </div>
  );
}
