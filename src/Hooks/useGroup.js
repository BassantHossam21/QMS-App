import { useState } from "react";
import axiosClient from "@/Api/AxiosClient";
import { toast } from "react-toastify";

export default function useGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  //=================Get All Groups=================
  const getAllGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/api/group");
      console.log("Fetched groups:", response);
      const data = response.data?.data || response.data;
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  //=================Add Group=================
  const addGroup = async (formData) => {
    try {
      const response = await axiosClient.post("/api/group", formData);
      toast.success(response.data.message || "Group added successfully");
      getAllGroups();
      return true;
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
      return false;
    }
  };

  //=================Update Group=================
  const updateGroup = async (id, formData) => {
    try {
      const response = await axiosClient.put(`/api/group/${id}`, formData);
      toast.success(response.data.message || "Group updated successfully");
      getAllGroups();
      return true;
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
      return false;
    }
  };

  //=================Delete Group=================
  const deleteGroup = async (id) => {
    try {
      const response = await axiosClient.delete(`/api/group/${id}`);
      toast.success(response.data.message || "Group deleted successfully");
      setGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error(
        error.response?.data.message || "Failed to delete the group.",
      );
    }
  };

  return { groups, loading, getAllGroups, addGroup, updateGroup, deleteGroup };
}


