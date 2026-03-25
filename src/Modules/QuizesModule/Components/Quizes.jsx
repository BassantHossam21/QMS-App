import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/Context/DarkModeContext";
import {
  AlarmClockPlus,
  Vault,
  ArrowRightCircle,
  Check,
  X,
  Calendar,
  Clock,
  Copy,
  CheckCheck,
} from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import useGroup from "@/Hooks/useGroup";
import useQuizes from "@/Hooks/useQuizes";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import InComingImg from "@/assets/InComeingQuiz.png";
import { AuthContext } from "@/Context/AuthContext";
import { toast } from "react-toastify";

export default function Quizes() {
  const navigate = useNavigate();
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const { groups, getAllGroups } = useGroup();
  const {
    createQuiz,
    getIncommingQuizes,
    getCompletedQuizes,
    JoinStudentQuiz,
    getQuestionsWithoutAnswers,
  } = useQuizes();
  const [incomingQuizes, setIncomingQuizes] = useState([]);
  const [completedQuizes, setCompletedQuizes] = useState([]);
  const [loadingQuizes, setLoadingQuizes] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [quizCode, setQuizCode] = useState("");
  const [copied, setCopied] = useState(false);
  let { loginData } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      group: "",
      questions_number: 10,
      difficulty: "medium",
      type: "FE",
      schadule: new Date().toISOString().slice(0, 16),
      duration: 30,
      score_per_question: 1,
    },
  });

  const fetchQuizes = async () => {
    setLoadingQuizes(true);
    try {
      const incoming = await getIncommingQuizes();
      setIncomingQuizes(incoming?.data || incoming || []);

      const completed = await getCompletedQuizes();
      setCompletedQuizes(completed?.data || completed || []);
    } catch (error) {
      console.error("Error fetching quizes", error);
    } finally {
      setLoadingQuizes(false);
    }
  };

  useEffect(() => {
    getAllGroups();
    fetchQuizes();
  }, []);

  const onQuizSubmit = async (data) => {
    const formattedData = {
      title: data.title,
      description: data.description,
      group: data.group,
      questions_number: Number(data.questions_number),
      difficulty: data.difficulty,
      type: data.type,
      schadule: data.schadule ? new Date(data.schadule).toISOString() : "",
      duration: String(data.duration),
      score_per_question: String(data.score_per_question),
    };
    try {
      const response = await createQuiz(formattedData);

      // Only show success modal if the request actually succeeded
      const status = response?.status || response?.data?.status;
      const isSuccess =
        status === 200 ||
        status === 201 ||
        response?.data?.code ||
        response?.code;

      if (!isSuccess) {
        const msg = response?.data?.message || response?.message;
        toast.error(msg);
        return;
      }

      const code = response?.data?.code || response?.code || "";
      setQuizCode(code);
      setSuccessModal(true);
      setOpenQuizDialog(false);
      fetchQuizes();
      reset();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create quiz";
      toast.error(msg);
      console.error("Failed to create quiz:", err);
    }
  };

  const handleCopyCode = () => {
    if (!quizCode) return;
    navigator.clipboard.writeText(quizCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  function QuizCard({ title, onClick }) {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-gray-800 rounded-[10px] border border-black/20 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group shadow-sm w-full min-h-[200px] sm:min-h-[240px]"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-black/10 dark:border-gray-700 group-hover:border-black/30 transition-all">
          <AlarmClockPlus className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform duration-300" />
        </div>

        <span className="text-base font-extrabold text-black dark:text-gray-100 text-center leading-snug tracking-tight">
          {title}
        </span>
      </div>
    );
  }
  const { register: registerJoin, handleSubmit: handleJoinSubmit } = useForm();
  const joinSubmit = async (data) => {
    try {
      const joinResponse = await JoinStudentQuiz({ code: data.code });
      const quizId = joinResponse?.data?.data?.quiz;

      if (!quizId) return console.error("No quizId returned");

      let response = await getQuestionsWithoutAnswers(quizId);
      console.log(response);
      const questions = response?.data?.data?.questions;

      navigate("/dashboard/student-quiz", { state: { questions, quizId } });
    } catch (error) {
      console.log("Join quiz error:", error.response?.data || error.message);
    }
  };
  return (
    <div className="py-6 font-sans min-h-screen dark:bg-[#0D1321]">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Left Section: Two cards responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 content-start">
          {/* Set up a new quiz card */}
          <QuizCard
            title={
              loginData?.role === "Instructor"
                ? "Set up a new quiz"
                : "Join Quiz"
            }
            onClick={
              loginData?.role === "Instructor"
                ? () => setOpenQuizDialog(true)
                : () => setSuccessModal(true)
            }
          />

          {/* Question Bank card */}
          {loginData?.role === "Instructor" && (
            <div
              onClick={() => navigate("/dashboard/questions")}
              className="bg-white dark:bg-gray-800 rounded-[10px] border border-black/20 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group shadow-sm w-full min-h-[200px] sm:min-h-[240px]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-[18px] border-2 border-dashed border-black/10 dark:border-gray-700 group-hover:border-black/30 transition-all">
                <Vault className="h-10 w-10 text-black dark:text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-base font-extrabold text-black dark:text-gray-100 text-center leading-snug tracking-tight">
                Question Bank
              </span>
            </div>
          )}
        </div>

        {/* Right Section: Quizzes Overview */}
        <div className="flex flex-col gap-6 w-full">
          {/* Upcoming Quizzes */}
          <div className="bg-white dark:bg-[#111827] rounded-[10px] border border-black/20 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-black dark:text-gray-100 mb-8 lg:mb-10 tracking-tight">
              Upcoming quizzes
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:gap-8">
              {loadingQuizes ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-gray-600 dark:border-t-gray-200" />
                </div>
              ) : incomingQuizes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-black/30 dark:text-gray-400">
                  <img src={InComingImg} alt="InComingImg" />
                  <p className="font-bold text-lg">No upcoming quizzes</p>
                </div>
              ) : (
                incomingQuizes.map((quiz) => {
                  const scheduleDate = quiz.schadule
                    ? new Date(quiz.schadule)
                    : null;
                  const dateStr = scheduleDate
                    ? scheduleDate
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, " / ")
                    : "—";
                  const timeStr = scheduleDate
                    ? scheduleDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <div
                      key={quiz._id}
                      onClick={() => navigate(`/dashboard/quizes/${quiz._id}`)}
                      className="flex flex-col md:flex-row items-stretch rounded-[10px] border border-black/20 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-[#1A1D23] group overflow-hidden"
                    >
                      {/* Left: Image Container */}
                      <div className="w-full md:w-[110px] h-[80px] md:h-auto bg-[#FFEDDF] dark:bg-[#3C2A1A] shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={InComingImg}
                          alt="Quiz Graphic"
                          className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Right: Content Container */}
                      <div className="flex flex-col w-full flex-1 justify-between p-2 md:px-3 md:py-2">
                        <div>
                          <h3 className="text-[14px] font-extrabold text-black dark:text-gray-100 mb-0.5 leading-tight tracking-tight line-clamp-1 group-hover:text-[#CDD400] transition-colors">
                            {quiz.title}
                          </h3>
                          <div className="text-[11px] text-black/60 dark:text-gray-400 font-bold">
                            <span>{dateStr}</span>{" "}
                            <span className="mx-1.5">|</span>{" "}
                            <span>{timeStr}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1">
                          <span className="text-[11px] font-extrabold text-black/80 dark:text-gray-300 tracking-tight">
                            No. of student's enrolled: {quiz.participants || 32}
                          </span>
                          <div className="flex items-center gap-1 text-[12px] font-extrabold text-black dark:text-gray-200">
                            Open
                            <ArrowRightCircle className="h-[14px] w-[14px] text-[#CDD400]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Completed Quizzes */}
          <div className="bg-white dark:bg-[#111827] rounded-[10px] border border-black/20 dark:border-gray-800 p-6 lg:p-8 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] lg:text-xl font-extrabold text-black dark:text-gray-100 tracking-tight">
                Completed Quizzes
              </h2>
              <button
                onClick={() => navigate("/dashboard/results")}
                className="text-[13px] font-extrabold text-black/40 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 transition-colors flex items-center gap-1 group"
              >
                Results
                <ArrowRightCircle className="h-[14px] w-[14px] text-[#CDD400] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#000000] text-white dark:bg-black dark:text-white">
                    <th className="py-3 px-4 font-bold text-[12px] border-r border-white/20 dark:border-gray-800">
                      Title
                    </th>
                    <th className="py-3 px-4 font-bold text-[12px] border-r border-white/20 dark:border-gray-800">
                      Group name
                    </th>
                    <th className="py-3 px-4 font-bold text-[12px] border-r border-white/20 dark:border-gray-800">
                      No. of persons in group
                    </th>
                    <th className="py-3 px-4 font-bold text-[12px]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {completedQuizes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center font-bold text-[13px] text-black/30 dark:text-gray-400 border border-black/10 dark:border-gray-600"
                      >
                        No completed quizzes yet
                      </td>
                    </tr>
                  ) : (
                    completedQuizes.map((row) => {
                      const dateStr = row.schadule
                        ? new Date(row.schadule)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, " / ")
                        : "—";
                      return (
                        <tr
                          key={row._id}
                          onClick={() =>
                            navigate(`/dashboard/quizes/${row._id}`)
                          }
                          className="hover:bg-gray-50/50 dark:hover:bg-[#1A1D23] transition-colors group cursor-pointer"
                        >
                          <td className="py-4 px-4 font-bold text-[13px] text-black dark:text-white group-hover:text-[#E37A49] border border-black/10 dark:border-gray-800 border-t-0">
                            {row.title}
                          </td>
                          <td className="py-4 px-4 font-bold text-[13px] text-black/60 dark:text-gray-400 border border-black/10 dark:border-gray-800 border-t-0 border-l-0">
                            {row.group || "—"}
                          </td>
                          <td className="py-4 px-4 font-bold text-[13px] text-black/60 dark:text-gray-400 border border-black/10 dark:border-gray-800 border-t-0 border-l-0">
                            {row.participants ?? "—"} persons
                          </td>
                          <td className="py-4 px-4 font-bold text-[13px] text-black/60 dark:text-gray-400 border border-black/10 dark:border-gray-800 border-t-0 border-l-0">
                            {dateStr}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================ Set up a new quiz Modal ================ */}
      <Dialog
        open={openQuizDialog}
        onOpenChange={(open) => {
          setOpenQuizDialog(open);
          if (!open) reset();
        }}
      >
        <DialogContent className="max-w-5xl! w-[95vw]! p-0 border border-black/15 dark:border-gray-600 rounded-[12px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden max-h-[90vh] flex flex-col overflow-hidden">
          <form
            onSubmit={handleSubmit(onQuizSubmit)}
            className="flex flex-col flex-1 overflow-hidden min-h-0"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-4 sm:py-0 border-b border-black/10 dark:border-gray-700 min-h-[70px] bg-white dark:bg-gray-800 gap-3 sm:gap-0 shrink-0">
              <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-gray-100 font-sans text-center sm:text-left">
                Set up a new quiz
              </DialogTitle>
              <div className="flex border-t sm:border-t-0 sm:border-l border-black/10 h-auto sm:h-[70px] items-center w-full sm:w-auto justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-r border-black/10 flex items-center justify-center flex-1 sm:flex-none"
                >
                  <Check
                    size={24}
                    strokeWidth={2.5}
                    className="text-black dark:text-gray-200"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setOpenQuizDialog(false)}
                  className="px-8 py-3 sm:py-0 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center flex-1 sm:flex-none"
                >
                  <X
                    size={24}
                    strokeWidth={2.5}
                    className="text-black dark:text-gray-200"
                  />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-3">
              <p className="font-semibold text-black/70 dark:text-gray-300 text-sm mb-2">
                Details
              </p>

              {/* Title */}
              <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 sm:px-5 py-2 sm:py-0 sm:h-12 min-w-0 sm:min-w-[110px] flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0">
                  Title:
                </span>
                <Input
                  {...register("title", { required: true })}
                  className="flex-1 h-20 sm:h-12 border-none shadow-none text-black dark:text-gray-100 font-bold text-lg sm:text-sm bg-transparent placeholder:text-gray-300 rounded-none focus-visible:ring-0 px-6 sm:px-4"
                  placeholder="Enter quiz title..."
                />
              </div>

              {/* Duration | No. of questions | Score per question */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Duration */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                    Duration{" "}
                    <span className="text-[11px] text-black/40 ml-1">
                      (min)
                    </span>
                  </span>
                  <select
                    {...register("duration")}
                    className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                  >
                    {[10, 15, 20, 30, 45, 60, 90, 120, 180].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* No. of questions */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                    No. questions
                  </span>
                  <select
                    {...register("questions_number")}
                    className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                  >
                    {[1, 5, 10, 15, 20, 25, 30, 40, 50].map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Score per question */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                    Score / Q
                  </span>
                  <select
                    {...register("score_per_question")}
                    className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                  >
                    {[1, 2, 5, 10, 20].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0">
                  Description
                </span>
                <Textarea
                  {...register("description")}
                  rows={4}
                  className="flex-1 px-6 sm:px-4 py-5 sm:py-3 border-none shadow-none text-black dark:text-gray-200 text-lg sm:text-sm bg-transparent resize-none placeholder:text-gray-300 leading-relaxed rounded-none focus-visible:ring-0 min-h-[140px] sm:min-h-[80px]"
                  placeholder="Provide details about this quiz..."
                />
              </div>

              {/* Schedule */}
              <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 sm:min-w-[110px] flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                  Schedule
                </span>
                <div className="flex-1 flex items-center px-4 sm:px-4 gap-3 h-20 sm:h-12 min-w-0">
                  <Calendar className="h-6 w-6 sm:h-4 sm:w-4 text-black/50 dark:text-gray-400 shrink-0" />
                  <input
                    type="datetime-local"
                    {...register("schadule", { required: true })}
                    className="w-full min-w-0 bg-transparent border-none outline-none text-black dark:text-gray-100 font-bold text-lg sm:text-sm cursor-pointer"
                  />
                </div>
              </div>

              {/* Difficulty | Category | Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Difficulty */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                    Difficulty
                  </span>
                  <select
                    {...register("difficulty")}
                    className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                  >
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
                  </select>
                </div>

                {/* Category */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                    Category
                  </span>
                  <select
                    {...register("type")}
                    className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                  >
                    <option value="FE">FE</option>
                    <option value="BE">BE</option>
                    <option value="DO">DO</option>
                  </select>
                </div>

                {/* Group */}
                <div className="flex flex-col sm:flex-row items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 sm:h-12 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap">
                    Group
                  </span>
                  <select
                    {...register("group", { required: true })}
                    className="flex-1 px-6 sm:px-4 h-20 sm:h-12 border-none bg-transparent text-black dark:text-gray-100 font-bold text-lg sm:text-sm outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Group
                    </option>
                    {groups?.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================ Success Modal ================ */}
      <Dialog
        open={successModal}
        onOpenChange={(open) => {
          setSuccessModal(open);
        }}
      >
        <DialogContent className=" w-full p-0 overflow-hidden border-none rounded-[20px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden">
          <div className="flex flex-col items-center gap-6 px-10 py-12 dark:text-gray-200">
            {/* Checkmark icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0D1321]">
              <Check size={40} strokeWidth={3} className="text-white" />
            </div>

            {/* Title */}
            <p className="text-xl font-extrabold text-black dark:text-gray-100 text-center tracking-tight">
              {loginData?.role === "Instructor"
                ? "  Quiz was successfully created"
                : "Join Quiz"}
            </p>

            {/* Code display */}
            {loginData?.role == "Instructor" ? (
              <div className="flex items-center gap-0 rounded-full border-2 border-black/10 overflow-hidden w-full max-w-xs">
                <span className="bg-[#F5F5F5] dark:bg-gray-700 px-5 py-3 font-extrabold text-black dark:text-gray-200 text-sm tracking-widest border-r border-black/10 dark:border-gray-600 shrink-0">
                  CODE:
                </span>
                <span className="flex-1 px-5 py-3 font-extrabold text-black dark:text-white text-lg tracking-widest text-center">
                  {quizCode || "—"}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors shrink-0 border-l border-black/10"
                  title="Copy code"
                >
                  {copied ? (
                    <CheckCheck size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-black/50" />
                  )}
                </button>
              </div>
            ) : (
              <form
                className="min-w-full mx-auto flex flex-col "
                onSubmit={handleJoinSubmit(joinSubmit)}
              >
                <div className="relative w-full">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-bold text-black dark:text-gray-200 py-4 px-5 bg-[#f8ebd9] dark:bg-[#3C2A1A]">
                    Code
                  </span>

                  <Input
                    {...registerJoin("code", { required: true })}
                    className=" pl-25 py-4 h-auto dark:text-white dark:placeholder:text-white placeholder:text-black placeholder:text-base"
                    type="text"
                    placeholder="Enter Your Code to join"
                  />
                </div>

                <button
                  type="submit"
                  className="w-3/4 m-auto text-center  my-5 rounded-full bg-[#CDD400] hover:bg-[#b8bf00] dark:bg-[#aabb00] text-black dark:text-gray-900 font-extrabold py-4 text-base transition-all active:scale-95 shadow-md"
                >
                  Send
                </button>
              </form>
            )}

            {/* Close button */}
            {loginData?.role == "Instructor" && (
              <button
                onClick={() => {
                  setSuccessModal(false);
                }}
                className="w-full max-w-xs rounded-full bg-[#CDD400] hover:bg-[#b8bf00] dark:bg-[#aabb00] text-black dark:text-gray-900 font-extrabold py-4 text-base transition-all active:scale-95 shadow-md"
              >
                Close
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
