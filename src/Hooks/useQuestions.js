import axiosClient from "@/Api/AxiosClient";
import React from "react";
import { toast } from "react-toastify";

export default function useQuestions() {
  const [data, setData] = React.useState([]);

  const getAllQuestions = async () => {
    try {
      const response = await axiosClient.get("/api/question");
      console.log(`all questions`, response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createQuestion = async (data) => {
    try {
      const response = await axiosClient.post("/api/question", data);
      console.log(`created question`, response);
      getAllQuestions();
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const updateQuestion = async (id, data) => {
    try {
      const response = await axiosClient.put(`/api/question/${id}`, data);
      console.log(`updated question`, response);
      getAllQuestions();
      toast.success(response.data.message || "Updated successfully");
    } catch (error) {
      const errorData = error.response?.data;
      console.log("Update Error Status:", error.response?.status);
      console.log("Update Error Full Data:", errorData);

      // If message is an array (Joi/Validation errors), log each one
      if (Array.isArray(errorData?.message)) {
        errorData.message.forEach((msg, i) =>
          console.log(`Validation Error ${i + 1}:`, msg),
        );
      }

      toast.error(
        Array.isArray(errorData?.message)
          ? errorData.message[0]
          : errorData?.message || "Failed to update",
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
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return {
    getAllQuestions,
    data,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
