import axiosClient from "@/Api/AxiosClient";
import React from "react";
import { toast } from "react-toastify";

export default function useQuestions() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getAllQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/api/question");
      console.log(`all questions`, response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (data) => {
    try {
      const response = await axiosClient.post("/api/question", data);
      console.log(`created question`, response);
      getAllQuestions();
      toast.success(response.data.message);
    } catch (error) {
      console.log("Create Error Data:", error.response?.data);
      toast.error(
        Array.isArray(error.response?.data?.message)
          ? error.response?.data?.message[0]
          : error.response?.data?.message || "Failed to create question",
      );
    }
  };

  const updateQuestion = async (id, data) => {
    try {
      const response = await axiosClient.put(`/api/question/${id}`, data);
      console.log(`updated question`, response);
      getAllQuestions();
      toast.success(response.data.message || "Updated successfully");
    } catch (error) {
      console.log("Update Error Data:", error.response?.data);
      toast.error(
        Array.isArray(error.response?.data?.message)
          ? error.response?.data?.message[0]
          : error.response?.data?.message || "Failed to update",
      );
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const response = await axiosClient.delete(`/api/question/${id}`);
      console.log(`deleted question`, response);
      getAllQuestions();
      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You can only delete questions you created.");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return {
    getAllQuestions,
    data,
    loading,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
