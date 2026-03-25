import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/Context/DarkModeContext";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Pencil, X, Trash2, Copy, Check } from "lucide-react";
import useQuizes from "@/Hooks/useQuizes";
import { toast } from "react-toastify";

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuizDetailsById, updateQuiz, deleteQuiz } = useQuizes();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    schadule: "",
    duration: "",
    score_per_question: "",
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getQuizDetailsById(id);
        setQuiz(data);
      } catch (error) {
        console.error("Failed to fetch quiz details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const formatToInputDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString).slice(0, 16);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleEditOpen = () => {
    setEditData({
      title: quiz?.title || "",
      schadule: formatToInputDate(quiz?.schadule),
      duration: quiz?.duration || "",
      score_per_question: quiz?.score_per_question || "",
    });
    setShowEditModal(true);
  };

  const OnQuizUpdate = async () => {
    if (!editData.title?.trim()) {
      toast.error("Quiz title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: editData.title.trim(),
        schadule: editData.schadule
          ? new Date(editData.schadule).toISOString()
          : "",
        duration: String(editData.duration),
        score_per_question: String(editData.score_per_question),
      };

      await updateQuiz(id, payload);

      const updatedData = await getQuizDetailsById(id);
      setQuiz(updatedData);

      setShowEditModal(false);
      navigate("/dashboard/quizes");
    } catch (err) {
      console.error("Failed to update quiz:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteQuiz(id);
      navigate("/dashboard/quizes");
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDD400] dark:border-[#CDD400]"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 font-bold">
          Quiz not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#CDD400] hover:underline font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const scheduleDate = quiz.schadule ? new Date(quiz.schadule) : null;
  const dateStr = scheduleDate
    ? scheduleDate.toLocaleDateString("en-GB").replace(/\//g, " / ")
    : "—";
  const timeStr = scheduleDate
    ? scheduleDate
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(":", " : ")
    : "—";

  return (
    <div className="py-6 px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-bold mb-6">
        <span
          className="text-black/40 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-gray-100 transition-colors"
          onClick={() => navigate("/dashboard/quizes")}
        >
          Quizzes
        </span>
        <span className="font-black text-black/30 dark:text-gray-500">
          {" "}
          &raquo;{" "}
        </span>
        <span className="text-black dark:text-gray-100 font-bold">
          {quiz.title}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 border border-black/20 dark:border-gray-700 rounded-[10px] p-6 sm:p-8 max-w-xl shadow-sm w-full mx-auto md:mx-0">
        <h1 className="text-2xl font-black text-black dark:text-gray-100 mb-3">
          {quiz.title}
        </h1>

        {/* Date & Time */}
        <div className="flex items-center gap-6 mb-7 text-sm font-bold text-black dark:text-gray-200">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-black dark:text-gray-200" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-black dark:text-gray-200" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {/* Duration */}
          <div className="flex flex-col sm:flex-row sm:items-stretch border border-black/20 dark:border-gray-700 rounded-[8px] overflow-hidden min-h-[44px]">
            <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 w-full sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-black/20 dark:border-gray-700 shrink-0">
              Duration
            </span>
            <span className="flex-1 px-4 py-3 sm:py-0 flex items-center font-bold text-black dark:text-gray-200 text-sm">
              {quiz.duration} minutes
            </span>
          </div>

          {/* Quiz Code */}
          <div className="flex flex-col sm:flex-row sm:items-stretch border border-black/20 rounded-[8px] overflow-hidden min-h-[44px]">
            <span className="bg-[#FFEDDF] px-4 py-2 sm:py-0 w-full sm:w-44 flex items-center font-bold text-black text-sm border-b sm:border-b-0 sm:border-r border-black/20 shrink-0">
              Quiz Code
            </span>
            <div className="flex-1 px-4 py-3 sm:py-0 flex items-center justify-between">
              <span className="font-black text-black dark:text-gray-100 text-sm tracking-widest">
                {quiz.code}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(quiz.code);
                  toast.success("Quiz code copied!");
                }}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#0D1321] dark:text-gray-200 hover:bg-[#0D1321] hover:text-white dark:hover:bg-gray-700 dark:hover:text-white px-2 py-0.5 rounded border border-[#0D1321] transition-all"
              >
                <Copy size={11} />
                Copy
              </button>
            </div>
          </div>

          {/* Number of questions */}
          <div className="flex flex-col sm:flex-row sm:items-stretch border border-black/20 dark:border-gray-700 rounded-[8px] overflow-hidden min-h-[44px]">
            <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 w-full sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-black/20 dark:border-gray-700 shrink-0">
              Number of questions
            </span>
            <span className="flex-1 px-4 py-3 sm:py-0 flex items-center font-bold text-black dark:text-gray-200 text-sm">
              {quiz.questions_number}
            </span>
          </div>

          {/* Score per question */}
          <div className="flex flex-col sm:flex-row sm:items-stretch border border-black/20 dark:border-gray-700 rounded-[8px] overflow-hidden min-h-[44px]">
            <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 w-full sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-black/20 dark:border-gray-700 shrink-0">
              Score per question
            </span>
            <span className="flex-1 px-4 py-3 sm:py-0 flex items-center font-bold text-black dark:text-gray-200 text-sm">
              {quiz.score_per_question}
            </span>
          </div>

          {/* Description */}
          <div className="border border-black/20 dark:border-gray-700 rounded-[8px] overflow-hidden">
            <div className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2.5 font-bold text-black dark:text-gray-100 text-sm border-b border-black/20 dark:border-gray-700">
              Description
            </div>
            <div className="px-4 py-3 font-bold text-black dark:text-gray-200 text-sm leading-relaxed min-h-[90px]">
              {quiz.description || "No description provided."}
            </div>
          </div>

          {/* Question bank used */}
          <div className="flex flex-col sm:flex-row sm:items-stretch border border-black/20 rounded-[8px] overflow-hidden min-h-[44px]">
            <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-4 py-2 sm:py-0 w-full sm:w-44 flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-black/20 dark:border-gray-700 shrink-0">
              Question bank used
            </span>
            <span className="flex-1 px-4 py-2 sm:py-0 flex items-center font-bold text-black dark:text-gray-200 text-sm uppercase">
              Bank {quiz.type || "one"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-[#0D1321] rounded cursor-pointer"
            />
            <span className="font-bold text-sm text-black dark:text-gray-200">
              Randomize questions
            </span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 sm:flex-none justify-center border border-red-200 text-red-500 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-700 transition-colors active:scale-95 text-sm"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={handleEditOpen}
              className="flex-1 sm:flex-none justify-center bg-[#0D1321] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-black dark:bg-gray-900 dark:hover:bg-black transition-colors active:scale-95 text-sm"
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-black/10 dark:border-gray-700">
              <h2 className="text-lg font-black text-black dark:text-gray-100">
                Delete Quiz
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-black/50" />
              </button>
            </div>

            <div className="px-8 py-6">
              <p className="text-black dark:text-gray-200 font-bold text-sm leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-black">&ldquo;{quiz.title}&rdquo;</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="px-8 py-5 border-t border-black/10 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-lg border border-black/20 font-bold text-sm text-black dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-black/10">
              <h2 className="text-lg font-black text-black dark:text-gray-100">
                Edit Quiz
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-black/50" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700">
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-2 sm:py-0 h-auto sm:h-full flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap min-w-0 sm:min-w-[120px]">
                  Quiz Title
                </span>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="flex-1 px-5 h-12 sm:h-full border-none outline-none text-black font-bold text-sm bg-transparent placeholder:text-gray-300"
                  placeholder="Enter quiz title..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-stretch border border-[#0000004D] dark:border-[#777] rounded-[10px] overflow-hidden bg-white dark:bg-gray-700">
                <span className="bg-[#FFEDDF] dark:bg-[#3C2A1A] px-5 py-2 sm:py-0 h-auto sm:h-full flex items-center font-bold text-black dark:text-gray-100 text-sm border-b sm:border-b-0 sm:border-r border-[#0000004D] dark:border-[#777] shrink-0 whitespace-nowrap min-w-0 sm:min-w-[120px]">
                  Schedule
                </span>
                <input
                  type="datetime-local"
                  value={editData.schadule}
                  onChange={(e) =>
                    setEditData({ ...editData, schadule: e.target.value })
                  }
                  className="flex-1 px-5 h-12 sm:h-full border-none outline-none text-black font-bold text-sm bg-transparent placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-stretch border border-[#0000004D] rounded-[10px] overflow-hidden bg-white">
                  <span className="bg-[#FFEDDF] px-3 py-2 sm:py-0 h-auto sm:h-12 flex items-center font-bold text-black text-[12px] border-b sm:border-b-0 sm:border-r border-[#0000004D] shrink-0 whitespace-nowrap">
                    Duration{" "}
                    <span className="text-[10px] text-black/40 ml-1">
                      (min)
                    </span>
                  </span>
                  <select
                    value={editData.duration}
                    onChange={(e) =>
                      setEditData({ ...editData, duration: e.target.value })
                    }
                    className="flex-1 px-3 h-10 sm:h-full border-none outline-none text-black dark:text-gray-200 font-bold text-sm bg-transparent cursor-pointer"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {[10, 15, 20, 30, 45, 60, 90, 120, 180].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-stretch border border-[#0000004D] rounded-[10px] overflow-hidden bg-white">
                  <span className="bg-[#FFEDDF] px-3 py-2 sm:py-0 h-auto sm:h-12 flex items-center font-bold text-black text-[12px] border-b sm:border-b-0 sm:border-r border-[#0000004D] shrink-0 whitespace-nowrap">
                    Score / Q
                  </span>
                  <select
                    value={editData.score_per_question}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        score_per_question: e.target.value,
                      })
                    }
                    className="flex-1 px-3 h-10 sm:h-full border-none outline-none text-black dark:text-gray-200 font-bold text-sm bg-transparent cursor-pointer"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {[1, 2, 5, 10, 20].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-black/10 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 rounded-lg border border-black/20 dark:border-gray-600 font-bold text-sm text-black dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={OnQuizUpdate}
                disabled={saving || !editData.title.trim()}
                className="px-6 py-2 rounded-lg bg-[#0D1321] text-white font-bold text-sm hover:bg-black dark:bg-gray-900 dark:hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Pencil size={14} />
                )}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
