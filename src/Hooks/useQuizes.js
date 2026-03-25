import axiosClient from "@/Api/AxiosClient";
import { useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";

export default function useQuizes() {
  let [studentQuiz, setStudentQuiz] = useState([]);
  // ================== CREATE QUIZ===========================
  const createQuiz = async (data) => {
    try {
      const response = await axiosClient.post("/api/quiz", data);
      toast.success(response.data?.message || "Quiz created successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  // ================== GET QUIZ DETAILS BY ID===========================
  const getQuizDetailsById = async (id) => {
    try {
      const response = await axiosClient.get(`/api/quiz/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting quiz details:", error);
      throw error;
    }
  };

  // ================== UPDATE QUIZ===========================
  const updateQuiz = async (id, data) => {
    try {
      const response = await axiosClient.put(`/api/quiz/${id}`, data);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  };

  // ================== DELETE QUIZ===========================
  const deleteQuiz = async (id) => {
    try {
      const response = await axiosClient.delete(`/api/quiz/${id}`);
      console.log("Quiz deleted:", response.data);
      toast.success(response.data.message || "Quiz deleted successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  };

  // ================== GET INCOMMING QUIZES===========================
  const getIncommingQuizes = async () => {
    try {
      const response = await axiosClient.get("/api/quiz/incomming");
      console.log("Incomming quizes:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting incomming quizes:", error);
      throw error;
    }
  };

  // ================== GET COMPLETED QUIZES===========================
  const getCompletedQuizes = async () => {
    try {
      const response = await axiosClient.get("/api/quiz/completed");
      console.log("Completed quizes:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting completed quizes:", error);
      throw error;
    }
  };

  const JoinStudentQuiz = async (data) => {
    try {
      const response = await axiosClient.post("/api/quiz/join", data);
      toast.success(response.data.message);
      return response; // خليها ترجع response عشان نقدر ناخد quizId
    } catch (error) {
      console.log("JoinStudentQuiz error:", error);
      throw error; // عشان الـ joinSubmit يعرف يحصل خطأ
    }
  };

  const getQuestionsWithoutAnswers = async (id) => {
    try {
      const response = await axiosClient.get(`/api/quiz/without-answers/${id}`);
      setStudentQuiz(response.data.data.questions);
      console.log(response);

      return response; // مهم ترجعه عشان تستخدمه بعدين
    } catch (error) {
      console.log("getQuestionsWithoutAnswers error:", error);
      throw error;
    }
  };
  return {
    createQuiz,
    getIncommingQuizes,
    getCompletedQuizes,
    getQuizDetailsById,
    updateQuiz,
    deleteQuiz,
    JoinStudentQuiz,
    getQuestionsWithoutAnswers,
    studentQuiz,
  };
}
