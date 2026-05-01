import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "@/Context/DarkModeContext";
import useQuizes from "@/Hooks/useQuizes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, X, Award, BarChart3 } from "lucide-react";

export default function StudentQuiz() {
  const { state } = useLocation();
  const quizId = state?.quizId;
  const questions = state?.questions;
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();
  const { submitQuiz } = useQuizes();

  // Local State
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    console.log("Quiz ID:", quizId);
  }, [quizId]);

  const handleSubmit = async () => {
    // Format answers for API
    const answers = Object.entries(selected).map(([questionId, answer]) => ({
      question: questionId,
      answer: answer,
    }));

    try {
      const data = await submitQuiz(quizId, answers);
      console.log("Submission successful:", data);

      // Extract score with fallbacks
      const score = data?.data?.score ?? data?.score ?? 0;
      setQuizScore(score);
      setIsResultModalOpen(true);

      toast.success(data?.message || "Quiz submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit quiz"
      );
    }
  };

  if (!questions)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-400 dark:text-gray-600 font-extrabold text-2xl animate-pulse tracking-tight text-center">
          Loading Questions...
        </p>
      </div>
    );

  const percentage = quizScore !== null ? (quizScore / questions.length) * 100 : 0;

  return (
    <div className="py-6 font-sans min-h-screen space-y-8 dark:bg-[#0D1321]">
      <div className="flex flex-col gap-8 px-4 md:px-0">
        {questions.map((question, index) => (
          <div
            key={question._id}
            className="bg-white dark:bg-gray-800/40 rounded-[10px] border border-black/10 dark:border-white/5 p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-8">
              <span className="bg-black dark:bg-[#CDD400] text-white dark:text-black w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 text-sm shadow-sm transition-colors">
                {index + 1}
              </span>
              <h3 className="text-xl font-extrabold text-black dark:text-gray-100 tracking-tight leading-snug">
                {question.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(question.options)
                .filter(([key]) => key !== "_id")
                .map(([key, value]) => {
                  const isSelected = selected[question._id] === key;
                  return (
                    <div
                      key={key}
                      onClick={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [question._id]: key,
                        }))
                      }
                      className={`
                        group cursor-pointer rounded-[12px] border-[3px] p-5 flex items-center gap-4
                        transition-all duration-300 transform active:scale-[0.98]
                        ${
                          isSelected
                            ? "border-[#CDD400] bg-[#CDD400]/10 dark:bg-[#CDD400]/20 shadow-sm"
                            : "border-black/10 bg-black/5 dark:border-white/5 dark:bg-white/5 hover:border-[#CDD400]/40"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${isSelected ? "border-[#CDD400] bg-[#CDD400]" : "border-black/20 dark:border-white/10"}
                      `}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-black shadow-inner" />
                        )}
                      </div>

                      <div className="flex flex-col flex-1">
                        <span
                          className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 ${isSelected ? "text-[#CDD400]" : "text-black/30 dark:text-gray-500"}`}
                        >
                          Option {key}
                        </span>
                        <span
                          className={`text-base font-extrabold transition-all duration-300 ${isSelected ? "text-black dark:text-white" : "text-black/70 dark:text-gray-400"}`}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-6 pb-20">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selected).length !== questions.length}
            className="w-full md:max-w-md py-5 cursor-pointer rounded-full bg-[#CDD400] hover:bg-[#b8bf00] dark:bg-[#CDD400] dark:hover:bg-[#b8bf00] text-black font-black text-lg transition-all active:scale-95 shadow-xl shadow-[#CDD400]/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Submit Answers
          </button>
        </div>
      </div>

      {/* Result Modal - Matching Project Premium Design */}
      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-xl w-[95vw] p-0 border border-black/15 dark:border-gray-600 rounded-[12px] bg-white dark:bg-gray-800 shadow-2xl [&>button]:hidden flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 sm:px-8 border-b border-black/10 dark:border-gray-800 h-[65px] bg-white dark:bg-[#111827] shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-black text-black dark:text-gray-100 font-sans text-center sm:text-left flex-1">
              Quiz Result
            </DialogTitle>
            <div className="flex border-l border-black/10 h-[65px] items-center justify-center">
              <button
                onClick={() => {
                  setIsResultModalOpen(false);
                  navigate("/dashboard/quizes");
                }}
                className="px-8 h-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
              >
                <X
                  size={28}
                  strokeWidth={3}
                  className="text-black dark:text-gray-200"
                />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 bg-white dark:bg-[#111827]">
            <div className="space-y-4 text-base text-gray-800 dark:text-gray-200 font-sans">
              
              {/* Score Visualization */}
              <div className="flex flex-col items-center justify-center py-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-[24px] border border-black/5 dark:border-white/5">
                <div className="relative flex items-center justify-center mb-2">
                  <div className="w-28 h-28 rounded-full border-[10px] border-[#CDD400]/20 flex items-center justify-center relative">
                    <div
                      className="absolute inset-0 rounded-full border-[10px] border-[#CDD400] border-t-transparent -rotate-45"
                      style={{
                        clipPath: `conic-gradient(from 0deg, #CDD400 ${percentage}%, transparent 0)`,
                      }}
                    />
                    <span className="text-3xl font-black text-black dark:text-white">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-black dark:text-white leading-tight">
                    {percentage >= 50 ? "Quiz Passed!" : "Quiz Completed!"}
                  </h3>
                </div>
              </div>

              {/* Performance Details Row */}
              <div>
                <h3 className="text-base font-bold text-[#FB7C19] border-b border-black/5 dark:border-white/5 pb-1 mb-2 flex items-center gap-2">
                  <BarChart3 size={18} /> Performance Summary
                </h3>
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-black/5 dark:border-gray-700">
                  <div className="flex justify-between items-center border-b border-black/5 dark:border-gray-700 pb-2">
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-base">Score</span>
                    <span className="font-black text-xl text-[#CDD400] flex items-center gap-2">
                      <CheckCircle2 size={18} /> {quizScore}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/5 dark:border-gray-700 pb-2">
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-base">Total Questions</span>
                    <span className="font-black text-xl">{questions.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-base">Achievement</span>
                    <span className="font-black flex items-center gap-2">
                      <Award size={18} className="text-[#FB7C19]" />
                      <span className="text-base text-[#FB7C19] uppercase tracking-wider">{percentage >= 50 ? "Passed" : "Completed"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Success Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <span>Progress</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                  <div
                    className="h-full bg-[#CDD400] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(205,212,0,0.3)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-black/5 dark:border-gray-800">
            <button
              onClick={() => {
                setIsResultModalOpen(false);
                navigate("/dashboard/quizes");
              }}
              className="w-full bg-[#CDD400] hover:bg-[#b8bf00] text-black py-3 rounded-xl font-black text-base transition-all active:scale-95 shadow-lg shadow-[#CDD400]/25 uppercase tracking-widest"
            >
              Finish and Go Back
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
