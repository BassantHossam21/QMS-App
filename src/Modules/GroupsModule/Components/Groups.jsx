import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  FileEdit,
  Plus,
  Check,
  X,
  ChevronDown,
  Users,
  LayoutGrid,
  Eye,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DeleteConfirmation from "@/Shared/DeleteConfirmation/DeleteConfirmation";
import Loading from "@/Shared/Loading/Loading";
import useStudents from "@/Hooks/useStudent";
import useGroup from "@/Hooks/useGroup";
import { toast } from "react-toastify";

export default function Groups() {
  // ================= Hooks =================
  const { groups, loading, getAllGroups, addGroup, updateGroup, deleteGroup } =
    useGroup();
  const { getAllStudents, students } = useStudents();

  // ================= State =================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    students: [],
  });

  // ================= Effects =================
  useEffect(() => {
    getAllGroups();
    getAllStudents();
  }, []);

  // ================= Actions =================
  const openModal = (group = null) => {
    setOpenDropdown(false);
    if (group) {
      setIsEditMode(true);
      setSelectedGroup(group);
      setFormData({
        name: group.name,
        students: group.students || [],
      });
    } else {
      setIsEditMode(false);
      setFormData({
        name: "",
        students: [],
      });
    }
    setIsModalOpen(true);
  };



  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter a group name");
      return;
    }

    let success = false;
    if (isEditMode) {
      success = await updateGroup(selectedGroup._id, formData);
    } else {
      success = await addGroup(formData);
    }

    if (success) {
      setIsModalOpen(false);
      setOpenDropdown(false);
    }
  };

  const toggleStudent = (id) => {
    const exists = formData.students.includes(id);
    if (exists) {
      setFormData({
        ...formData,
        students: formData.students.filter((s) => s !== id),
      });
    } else {
      setFormData({
        ...formData,
        students: [...formData.students, id],
      });
    }
  };

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-[#0D1321]">
      {/* ================= MAIN UI ================= */}
      <div className="py-6 w-full">
        <div className="border border-black/20 dark:border-gray-800 rounded-[10px] shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#111827] border-b border-black/20 dark:border-gray-800 gap-4">
            <h2 className="text-xl font-bold text-black dark:text-gray-100">
              Groups Management
            </h2>
            <Button
              onClick={() => openModal()}
              className="w-full sm:w-auto bg-white dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 text-[#1F2937] border border-black/20 dark:border-gray-600 rounded-[30px] py-6 sm:py-5 flex items-center justify-center gap-2 shadow-md font-bold transition-all"
            >
              <Plus
                size={18}
                className="bg-black text-white rounded-full p-1 size-6 sm:size-5"
                strokeWidth={3}
              />
              <span className="text-lg sm:text-base">Add Group</span>
            </Button>
          </div>

          {/* Cards Content */}
          <div className="px-4 sm:px-6 py-6 bg-white dark:bg-[#111827]">
            {loading ? (
              <Loading height="h-64" />
            ) : groups.length === 0 ? (
              <div className="py-20 text-center text-gray-400 dark:text-gray-500">
                No groups found. Create your first one!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groups.map((group) => (
                  <div
                    key={group._id}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-black/20 dark:border-gray-800 rounded-[10px] hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#1A1D23] gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                      <div className="w-14 h-14 bg-[#FFEDDF] dark:bg-[#3C2A1A] rounded-[14px] flex items-center justify-center text-[#FB7C19] shrink-0 shadow-sm group-hover:rotate-3 transition-transform">
                        <LayoutGrid size={26} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 tracking-tight truncate">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/80 px-2.5 py-1 rounded-full border border-gray-100 dark:border-gray-700 whitespace-nowrap overflow-hidden">
                            <Users size={14} className="text-[#FB7C19] shrink-0" />
                            <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate">
                              {group.students?.length || 0} Students
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-black/5 dark:border-gray-800 sm:border-none shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-[#FB7C19]/10 text-[#FB7C19] hover:bg-[#FB7C19]/20 transition-all dark:bg-[#FB7C19]/10 dark:hover:bg-[#FB7C19]/20"
                        onClick={() => {
                          setSelectedGroup(group);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <Eye size={18} strokeWidth={2.5} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-[#CDD400]/10 text-[#CDD400] hover:bg-[#CDD400]/20 transition-all"
                        onClick={() => openModal(group)}
                      >
                        <FileEdit size={18} strokeWidth={2.5} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-red-50/50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                        onClick={() => {
                          setSelectedGroup(group);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================  ADD & EDIT GROUPS MODAL ================= */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl w-[95vw] p-0 border border-black/15 dark:border-gray-600 rounded-[12px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden max-h-[90vh] flex flex-col overflow-visible">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-4 sm:py-0 border-b border-black/10 dark:border-gray-800 min-h-[70px] bg-white dark:bg-[#111827] gap-3 sm:gap-0 shrink-0 rounded-t-[12px]">
            <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-gray-100 font-sans text-center sm:text-left">
              {isEditMode ? "Update Group" : "Set up a new Group"}
            </DialogTitle>
            <div className="flex border-t sm:border-t-0 sm:border-l border-black/10 h-auto sm:h-[70px] items-center w-full sm:w-auto justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-r border-black/10 flex items-center justify-center flex-1 sm:flex-none"
              >
                <Check
                  size={26}
                  strokeWidth={2.5}
                  className="text-black dark:text-gray-200"
                />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
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
          <div className="flex-1 overflow-visible min-h-0 p-6 sm:p-8 space-y-4 sm:space-y-3 bg-white dark:bg-[#111827] rounded-b-[12px]">
            <p className="font-semibold text-black/70 dark:text-gray-300 text-sm mb-2">
              Details
            </p>

            {/* Group Name */}
            <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-800 rounded-[10px] overflow-hidden bg-white dark:bg-[#1A1D23] shadow-sm">
              <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 h-12 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0">
                Group Name
              </span>
              <input
                type="text"
                className="flex-1 px-5 h-12 outline-none text-sm font-bold bg-white dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
                placeholder="Enter group name..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Students Dropdown */}
            <div className="relative">
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 cursor-pointer shadow-sm"
              >
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 h-12 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0">
                  List Students
                </span>
                <div className="flex-1 px-5 h-12 flex justify-between items-center bg-white dark:bg-gray-800">
                  <span
                    className={`text-sm font-bold ${formData.students.length > 0 ? "text-black dark:text-white" : "text-gray-400"}`}
                  >
                    {formData.students.length > 0
                      ? `${formData.students.length} Selected`
                      : "Select students..."}
                  </span>
                  <ChevronDown
                    size={24}
                    strokeWidth={2.5}
                    className="text-black dark:text-white shrink-0 ml-2"
                  />
                </div>
              </div>

              {/* Dropdown Menu */}
              {openDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1A1D23] border border-[#0000004D] dark:border-gray-700 rounded-[10px] shadow-xl max-h-[320px] sm:max-h-56 overflow-y-auto">
                  {students.length === 0 ? (
                    <div className="p-8 text-gray-400 text-center text-base sm:text-sm">
                      No students available
                    </div>
                  ) : (
                    students.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => toggleStudent(student._id)}
                        className="px-6 py-4 sm:px-5 sm:py-3 hover:bg-[#FFF7F0] dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b border-black/10 dark:border-gray-700 last:border-none transition-colors"
                      >
                        <span className="text-base sm:text-sm font-bold text-black dark:text-white">
                          {student.first_name} {student.last_name}
                        </span>
                        {formData.students.includes(student._id) && (
                          <div className="bg-black dark:bg-gray-200 rounded-full p-1">
                            <Check
                              size={14}
                              className="text-white dark:text-black"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= DETAILS MODAL ================= */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-md w-[95vw] p-0 border border-black/15 dark:border-gray-600 rounded-[12px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 sm:px-8 border-b border-black/10 dark:border-gray-800 h-[70px] bg-white dark:bg-[#111827] shrink-0">
            <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-gray-100 font-sans text-center sm:text-left flex-1">
              Group Details
            </DialogTitle>
            <div className="flex border-l border-black/10 h-[70px] items-center justify-center">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
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
            {selectedGroup && (
              <div className="space-y-5 text-sm text-gray-800 dark:text-gray-200 font-sans">
                
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                  <span className="font-bold text-gray-500 dark:text-gray-400">Group Name:</span>
                  <span className="font-bold text-black dark:text-white text-base">{selectedGroup.name}</span>
                </div>

                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                  <span className="font-bold text-gray-500 dark:text-gray-400">Instructor Id:</span>
                  <span className="font-mono text-xs bg-[#FB7C19]/10 px-2 py-1 rounded-md text-[#FB7C19] font-bold">
                    {selectedGroup.instructor || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                  <span className="font-bold text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    {selectedGroup.status || "active"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                  <span className="font-bold text-gray-500 dark:text-gray-400">No. of students:</span>
                  <span className="font-bold text-[#FB7C19] bg-[#FB7C19]/10 px-2 py-0.5 rounded-md">{selectedGroup.students?.length || 0}</span>
                </div>

                <div className="pt-2">
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-3">Students:</span>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-black/5 dark:border-white/5">
                    {selectedGroup.students?.length > 0 ? (
                      <div className="space-y-3">
                        {students
                          .filter(student => selectedGroup.students.includes(student._id))
                          .map((student, index) => (
                            <div key={student._id} className="flex items-center gap-3 text-gray-800 dark:text-gray-200 font-medium">
                              <span className="w-6 h-6 rounded-md bg-[#FB7C19]/5 dark:bg-[#FB7C19]/10 flex items-center justify-center text-xs font-bold text-[#FB7C19] border border-[#FB7C19]/20 shrink-0">
                                {index + 1}
                              </span>
                              {student.first_name} {student.last_name}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-2">No students enrolled</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRMATION ================= */}
      <DeleteConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          if (selectedGroup) deleteGroup(selectedGroup._id);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
