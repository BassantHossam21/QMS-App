import axiosClient from "@/Api/AxiosClient";
import React, { useState } from "react";

export default function useResults() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getAllResults = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/api/quiz/result");
      const data = response.data;
      console.log(response.data);

      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };
  return { getAllResults, loading, results };
}
