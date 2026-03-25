import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  CircleCheck,
  CircleX,
  Plus,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import DialogDetails from "@/Shared/DialogDetails/DialogDetails";
import Loading from "@/Shared/Loading/Loading";

export default function Students() {
  let {
    getAllStudents,
    students,
    deleteStudent,
    getStudentById,
    loading,
    studentDetails,
  } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    getAllStudents();
  }, []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewProfile = async (id) => {
    setDialogOpen(true);
    const student = await getStudentById(id);
    setSelectedStudent(student);
  };

  const [selectedGroup, setSelectedGroup] = useState("all");
  const studentImages = [img, img1, img2, img3];

  const filtered =
    selectedGroup === "all"
      ? students
      : students.filter((student) => student.group?._id === selectedGroup);
  const searchedStudents = filtered.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentStudents = searchedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(searchedStudents.length / itemsPerPage);

  return (
    <>
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
      <DialogDetails
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={"Student Details"}
      >
        {selectedStudent ? (
          <>
            <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
              <div className="flex gap-x-3 text-gray-600 dark:text-gray-300 my-2">
                <User />

                <h4 className="text-lg font-medium text-black dark:text-gray-100">
                  Personal Information
                </h4>
              </div>
              <div className="flex flex-col gap-y-2">
                <p>
                  <strong>Full Name: </strong>
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedStudent.email}
                </p>
                <p>
                  <strong>Student Id:</strong> {selectedStudent._id}
                </p>
                <p className="flex gap-x-2 items-center">
                  <ShieldCheck size={18} /> {selectedStudent.role}
                </p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg my-4">
              <h3 className="flex items-center text-gray-700 dark:text-gray-200 font-semibold text-lg mb-2 gap-x-2">
                <Users size={18} />
                Group Information
              </h3>
              {selectedStudent.group ? (
                <div className="flex flex-col gap-y-2">
                  <p>
                    <strong>Group Name:</strong> {selectedStudent.group.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  This student is not assigned to any group.
                </p>
              )}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </DialogDetails>
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
                      className="w-full py-0 rounded pr-4 sm:pr-5 h-auto sm:h-26 bg-white dark:bg-[#1A1D23] border border-black/10 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="flex items-center justify-between h-full overflow-hidden">
                        <div className="flex items-center gap-3 sm:gap-4 h-full">
                          <img
                            src={studentImages[index % studentImages.length]}
                            alt="avatar"
                            className="h-24 sm:h-full aspect-square object-cover shrink-0"
                          />

                          <div className="flex flex-col justify-center gap-y-1">
                            <CardTitle className="dark:text-white text-sm">
                              {student.first_name} {student.last_name}
                            </CardTitle>
                            <CardDescription>
                              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-400 dark:text-gray-500 text-sm">
                                  Group:
                                </span>
                                <span className="font-semibold text-gray-500 dark:text-gray-300 text-sm">
                                  {student.group ? student.group.name : "No Group"}
                                </span>
                              </div>
                              <div
                                className={`flex items-center my-1 font-medium w-fit py-0
  ${student.status === "active" ? " text-green-600" : " text-red-600"}`}
                              >
                                {student.status === "active" ? (
                                  <>
                                    <p className="text-base">Active</p>
                                    <Check className="mx-2" size={18} />
                                  </>
                                ) : (
                                  <>
                                    inactive
                                    <CircleX size={18} />
                                  </>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="rounded-full w-8 h-8 bg-black text-white dark:bg-gray-700 dark:text-white self-center">
                              <ArrowRight size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-1">
                            <DropdownMenuLabel className="text-xs text-gray-400 font-medium px-2">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-100" />
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => handleViewProfile(student._id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-100" />
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900 text-sm font-medium text-red-500"
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
    </>
  );
}
