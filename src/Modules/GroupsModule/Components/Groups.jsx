import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, FileEdit, Plus, Check, X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import DeleteConfirmation from "@/Shared/DeleteConfirmation/DeleteConfirmation";
import Loading from "@/Shared/Loading/Loading";
import axiosClient from "@/Api/AxiosClient";
import useStudents from "@/Hooks/useStudent";
import { toast } from "react-toastify";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAllStudents, students } = useStudents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    students: [],
  });

  // ================= Fetch Groups =================
  const getAllGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/api/group");
      if (Array.isArray(response.data)) {
        setGroups(response.data);
      } else if (Array.isArray(response.data?.data)) {
        setGroups(response.data.data);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllGroups();
    getAllStudents();
  }, []);

  // ================= Open Modal =================
  const openModal = (group = null) => {
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

  // ================= Submit =================
  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      if (isEditMode) {
        let response = await axiosClient.put(
          `/api/group/${selectedGroup._id}`,
          formData,
        );
        toast.success(response.data.message);
      } else {
        let response = await axiosClient.post("/api/group", formData);
        toast.success(response.data.message);
      }
      getAllGroups();
      setIsModalOpen(false);
      setOpenDropdown(false);
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
    }
  };

  // ================= Delete =================
  const deleteGroup = async (id) => {
    try {
      let response = await axiosClient.delete(`/api/group/${id}`);
      toast.success(response.data.message);
      setGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // ================= Toggle Student =================
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
    <div className="font-sans">
      <DeleteConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          if (selectedGroup) deleteGroup(selectedGroup._id);
          setConfirmOpen(false);
        }}
      />

      {/* ================= MODAL ================= */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] p-0 border border-black/15 dark:border-gray-600 rounded-[12px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-4 sm:py-0 border-b border-black/10 dark:border-gray-800 min-h-[70px] bg-white dark:bg-[#111827] gap-3 sm:gap-0 shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-black dark:text-gray-100 font-sans text-center sm:text-left">
              {isEditMode ? "Update Group" : "Set up a new Group"}
            </h2>
            <div className="flex border-t sm:border-t-0 sm:border-l border-black/10 h-auto sm:h-[70px] items-center w-full sm:w-auto justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-r border-black/10 flex items-center justify-center flex-1 sm:flex-none"
              >
                <Check size={26} strokeWidth={2.5} className="text-black dark:text-gray-200" />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center flex-1 sm:flex-none"
              >
                <X size={26} strokeWidth={2.5} className="text-black dark:text-gray-200" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-4 sm:space-y-3 bg-white dark:bg-[#111827]">
            <p className="font-semibold text-black/70 dark:text-gray-300 text-sm mb-2">Details</p>

            {/* Group Name */}
            <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-800 rounded-[10px] overflow-hidden bg-white dark:bg-[#1A1D23] shadow-sm">
              <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0">
                Group Name
              </span>
              <input
                type="text"
                className="flex-1 px-6 sm:px-5 h-24 sm:h-12 outline-none text-base sm:text-sm font-bold bg-white dark:bg-gray-800 dark:text-white placeholder:text-gray-300 placeholder:text-base sm:placeholder:text-sm"
                placeholder="Enter group name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Students Dropdown */}
            <div className="relative">
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-gray-600 rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 cursor-pointer shadow-sm"
              >
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-3 sm:py-0 sm:h-12 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-base sm:text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-gray-600 shrink-0">
                  List Students
                </span>
                <div className="flex-1 px-6 sm:px-5 h-24 sm:h-12 flex justify-between items-center bg-white dark:bg-gray-800">
                  <span className={`text-base sm:text-sm font-bold ${formData.students.length > 0 ? "text-black dark:text-white" : "text-gray-400"}`}>
                    {formData.students.length > 0 ? `${formData.students.length} Selected` : "Select students..."}
                  </span>
                  <ChevronDown size={24} strokeWidth={2.5} className="text-black dark:text-white" />
                </div>
              </div>

              {/* Dropdown Menu */}
              {openDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1A1D23] border border-[#0000004D] dark:border-gray-700 rounded-[10px] shadow-xl max-h-[320px] sm:max-h-56 overflow-y-auto">
                  {students.length === 0 ? (
                    <div className="p-8 text-gray-400 text-center text-base sm:text-sm">No students available</div>
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
                            <Check size={14} className="text-white dark:text-black" />
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

      {/* ================= MAIN UI ================= */}
      <div className="py-6 w-full bg-white dark:bg-[#0D1321] min-h-screen">
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
              <Plus size={18} className="bg-black text-white rounded-full p-1 size-6 sm:size-5" strokeWidth={3} />
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
                    className="flex items-center justify-between p-5 border border-black/10 dark:border-gray-800 rounded-[10px] hover:border-orange-200 hover:shadow-md transition-all bg-white dark:bg-[#1A1D23]"
                  >
                    <div>
                      <h3 className="font-bold text-base text-black dark:text-gray-100">
                        Group: {group.name}
                      </h3>
                      <p className="text-sm font-medium text-[#FB7C19] mt-1">
                        Students count: {group.students?.length || 0}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => openModal(group)}
                      >
                        <FileEdit className="dark:text-white" size={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          setSelectedGroup(group);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="text-red-500" size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
