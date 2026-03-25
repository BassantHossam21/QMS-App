import axios from "axios";
import { Toast } from "radix-ui";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/Api/AxiosClient";

export default function useAuth() {
  const { saveLoginData, setLoginData, setUserProfile } =
    useContext(AuthContext);

  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  let [AuthLoginData, setAuthLoginData] = useState();

  //==================Register==================
  const register = async (data) => {
    setLoading(true);
    try {
      let response = await axiosClient.post(`/api/auth/register`, data);
      console.log(response);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //==================Login==================
  const login = async (data) => {
    setLoading(true);
    try {
      let response = await axiosClient.post(`/api/auth/login`, data);
      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem(
        "userProfile",
        JSON.stringify(response.data.data.profile),
      );
      saveLoginData();
      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Login failed");

      throw error; // ⭐ دي المهمة
    } finally {
      setLoading(false);
    }
  };

  //==================Forgot Password==================
  const forgotPassword = async (data) => {
    setLoading(true);
    try {
      let response = await axiosClient.post(`/api/auth/forgot-password`, data);
      console.log(response);
      toast.success(response.data.message);
      navigate("/reset-password");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  // ==================Change Password==================
  const changePassword = async (data) => {
    setLoading(true);
    try {
      let response = await axiosClient.post(`/api/auth/change-password`, data);
      console.log(response);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  // ==================Reset Password==================
  const resetPassword = async (data) => {
    setLoading(true);
    try {
      let response = await axiosClient.post(`/api/auth/reset-password`, data);

      console.log(response);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      let response = await axiosClient.get(`/api/auth/logout`);
      toast.success(response.data.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
      setLoginData(null);
      setUserProfile(null);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return {
    login,
    forgotPassword,
    loading,
    register,
    changePassword,
    resetPassword,
    logout,
    AuthLoginData,
  };
}
