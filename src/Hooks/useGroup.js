import { useState } from "react";
import axiosClient from "@/Api/AxiosClient";

export default function useGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/api/group");
      // الوصول للمصفوفة سواء كانت في response.data مباشرة أو داخل data داخلها
      const data = response.data?.data || response.data;
      console.log("Fetched groups:",response.data);
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };
//   
//

  const deleteGroup = async (id) => {
    try {
      await axiosClient.delete(`/api/group/${id}`);
      setGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete the group.");
    }
  };

  return { groups, loading, getAllGroups, deleteGroup };
}