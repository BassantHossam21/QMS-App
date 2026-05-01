import axiosClient from "@/Api/AxiosClient";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useStudents() {
  let [students, setStudents] = useState([]);
  let [studentDetails, setStudentDetails] = useState(null);
  let [loading, setLoading] = useState(false);


  //===================== Get All Students=====================
  const getAllStudents = async () => {
    setLoading(true);
    try {
      let response = await axiosClient.get(`/api/student`);
      setStudents(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //===================== Delete Student=====================
  const deleteStudent = async (id) => {
    const previousStudents = students;
    // ✅ optimistic update -
    setStudents((prev) => prev.filter((s) => s._id !== id));

    try {
      let response = await axiosClient.delete(`/api/student/${id}`);
      console.log(response);
      toast.success(response.data.message || "Student deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete student");
      setStudents(previousStudents);
      console.log(error);
    }
  };

  //===================== Get Student By Id=====================
  const getStudentById = async (id) => {
    try {
      let response = await axiosClient.get(`/api/student/${id}`);
      setStudentDetails(response.data);
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getAllStudents,
    students,
    deleteStudent,
    getStudentById,
    studentDetails,
    loading,
  };
}
