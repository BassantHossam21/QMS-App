// --- 1. Imports (UI Components, Icons, Hooks, Assets) ---
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  CircleX,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteConfirmation from "@/Shared/DeleteConfirmation/DeleteConfirmation";
import Pagination from "@/Shared/Pagination/Pagination";
import useStudents from "@/Hooks/useStudent";

import img from "../../../assets/StudentImg.jpg";
import img1 from "../../../assets/StudentImg2.jpg";
import img2 from "../../../assets/StudentImg3.jpg";
import img3 from "../../../assets/StudentImg4.jpg";
import { Input } from "@/components/ui/input";
import Loading from "@/Shared/Loading/Loading";

export default function Students() {
  // --- 2. Hooks & API Data ---
  let {
    getAllStudents,
    students,
    deleteStudent,
    getStudentById,
    loading,
  } = useStudents();

  // --- 3. Local State Management ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Selected Data States
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- 4. Lifecycle Methods (useEffect) ---
  useEffect(() => {
    getAllStudents();
  }, []);

  // --- 5. Handlers & Functions ---
  const handleViewProfile = async (id) => {
    setDialogOpen(true);
    const student = await getStudentById(id);
    setSelectedStudent(student);
  };

  // --- 6. Filtering & Search Logic ---
  const studentImages = [img, img1, img2, img3];
  const searchedStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // --- 7. Pagination Logic ---
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentStudents = searchedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(searchedStudents.length / itemsPerPage);

  // --- 8. UI Render ---
  return (
    <>
      <div className="py-6 w-full bg-white dark:bg-[#0D1321] min-h-screen">
        <div className="border border-black/20 dark:border-gray-800 rounded-[10px] shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#111827] border-b border-black/20 dark:border-gray-800 gap-4">
            <h2 className="text-xl font-bold text-black dark:text-gray-100">
              Student List
            </h2>

            <div className="relative w-full sm:w-1/3">
              <Input
                className="w-full pl-4 rounded-[30px] border border-black/20 dark:border-gray-800 bg-white dark:bg-[#1A1D23] placeholder:text-gray-400 text-black dark:text-white shadow-sm h-11 focus-visible:ring-0"
                placeholder="Search By Name"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Cards Content */}
          <div className="px-4 sm:px-6 py-6 bg-white dark:bg-[#111827]">
            {loading ? (
              <Loading height={"h-screen"} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStudents.map((student, index) => (
                    <Card
                      key={student._id}
                      id={`student-${student._id}`}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-black/20 dark:border-gray-800 rounded-[10px] hover:shadow-lg hover:shadow-[#FB7C19]/15 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#1A1D23] gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                        <img
                          src={studentImages[index % studentImages.length]}
                          alt="avatar"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] object-cover shrink-0 shadow-sm border border-black/10 dark:border-gray-700 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="min-w-0 flex-1">
                          <CardTitle className="font-bold text-lg text-gray-900 dark:text-gray-100 tracking-tight truncate">
                            {student.first_name} {student.last_name}
                          </CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1.5 bg-[#FFEDDF] dark:bg-[#3C2A1A] px-2.5 py-1 rounded-full border border-[#FB7C19]/20 whitespace-nowrap overflow-hidden">
                              <span className="text-[11px] font-bold text-[#FB7C19] truncate">
                                {student.group ? student.group.name : "No Group"}
                              </span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border whitespace-nowrap ${student.status === "active" ? "bg-[#CDD400]/10 border-[#CDD400]/30 text-[#8A8D00] dark:text-[#CDD400]" : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"}`}>
                              {student.status === "active" ? (
                                <>
                                  <span className="text-[11px] font-bold">Active</span>
                                  <Check size={12} strokeWidth={3} />
                                </>
                              ) : (
                                <>
                                  <span className="text-[11px] font-bold">Inactive</span>
                                  <CircleX size={12} strokeWidth={3} />
                                </>
                              )}
                            </div>
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-black/5 dark:border-gray-800 sm:border-none shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="rounded-[10px] w-10 h-10 bg-[#FB7C19]/10 hover:bg-[#FB7C19] text-[#FB7C19] hover:text-white dark:bg-[#FB7C19]/20 dark:hover:bg-[#FB7C19] transition-colors p-0 flex items-center justify-center border border-[#FB7C19]/20">
                              <ArrowRight size={20} strokeWidth={2.5} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#1A1D23] shadow-xl border border-black/10 dark:border-gray-800 rounded-[12px] p-1.5">
                            <DropdownMenuLabel className="text-xs text-gray-400 font-bold px-2 py-1.5 uppercase tracking-wider">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-black/5 dark:bg-gray-800 my-1" />
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => handleViewProfile(student._id)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors focus:bg-gray-50 dark:focus:bg-gray-800"
                              >
                                <Eye className="w-4 h-4 text-[#FB7C19]" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-bold text-red-600 dark:text-red-400 transition-colors focus:bg-red-50 dark:focus:bg-red-900/30 focus:text-red-600 dark:focus:text-red-400"
                                onClick={() => {
                                  setStudentToDelete(student);
                                  setConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Student
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete student"
        description={
          studentToDelete
            ? `Are you sure you want to delete ${studentToDelete.first_name} ${studentToDelete.last_name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete._id);
          }
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-md w-[95vw] p-0 border border-black/15 dark:border-gray-600 rounded-[12px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 sm:px-8 border-b border-black/10 dark:border-gray-800 h-[70px] bg-white dark:bg-[#111827] shrink-0">
            <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-gray-100 font-sans text-center sm:text-left flex-1">
              Student Details
            </DialogTitle>
            <div className="flex border-l border-black/10 h-[70px] items-center justify-center">
              <button
                onClick={() => setDialogOpen(false)}
                className="px-8 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
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
          <div className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 bg-white dark:bg-[#111827]">
            {selectedStudent ? (
              <div className="space-y-6 text-sm text-gray-800 dark:text-gray-200 font-sans">
                {/* Personal Info */}
                <div>
                  <h3 className="text-base font-bold text-[#FB7C19] border-b border-black/5 dark:border-white/5 pb-2 mb-3 flex items-center gap-2">
                    <User size={18} /> Personal Information
                  </h3>
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-black/5 dark:border-gray-700">
                    <div className="flex justify-between items-center border-b border-black/5 dark:border-gray-700 pb-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        Full Name
                      </span>
                      <span className="font-bold">
                        {selectedStudent.first_name} {selectedStudent.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/5 dark:border-gray-700 pb-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        Email
                      </span>
                      <span
                        className="font-bold truncate max-w-[200px]"
                        title={selectedStudent.email}
                      >
                        {selectedStudent.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/5 dark:border-gray-700 pb-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        Student ID
                      </span>
                      <span
                        className="font-bold truncate max-w-[200px]"
                        title={selectedStudent._id}
                      >
                        {selectedStudent._id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        Role
                      </span>
                      <span className="font-bold flex items-center gap-1">
                        <ShieldCheck size={16} className="text-[#FB7C19]" />
                        <span className="capitalize">
                          {selectedStudent.role}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Group Info */}
                <div>
                  <h3 className="text-base font-bold text-[#CDD400] border-b border-black/5 dark:border-white/5 pb-2 mb-3 flex items-center gap-2">
                    <Users size={18} /> Group Information
                  </h3>
                  <div className="bg-[#CDD400]/5 dark:bg-[#CDD400]/10 p-4 rounded-xl border border-[#CDD400]/20">
                    {selectedStudent.group ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Group Name
                        </span>
                        <span className="font-bold text-[#8A8D00] dark:text-[#CDD400]">
                          {selectedStudent.group.name}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center font-medium py-2">
                        This student is not assigned to any group.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
