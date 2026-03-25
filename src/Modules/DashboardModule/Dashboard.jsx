import React, { useContext, useEffect, useState } from "react";
import img from "../../assets/StudentImg.jpg";
import img1 from "../../assets/StudentImg2.jpg";
import img2 from "../../assets/StudentImg3.jpg";
import img3 from "../../assets/StudentImg4.jpg";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  Eye,
  Lock,
  MoveRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  CircleCheck,
  CircleX,
  Plus,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteConfirmation from "@/Shared/DeleteConfirmation/DeleteConfirmation";
import { Link } from "react-router-dom";
import useQuizes from "@/Hooks/useQuizes";
import Loading from "@/Shared/Loading/Loading";
import { AuthContext } from "@/Context/AuthContext";
export default function Dashboard() {
  const studentImages = [img, img1, img2, img3];
  const currentStudents = [
    {
      _id: "64b8c9e5f1a2c9b1d2e3f4a",
      first_name: "John",
      last_name: "Doe",
    },
    {
      _id: "64b8c9e5f1a2c9b1d2e3f4b",
      first_name: "Jane",
      last_name: "Smith",
    },
  ];
  let { getIncommingQuizes, getCompletedQuizes } = useQuizes();
  const [incomingQuizes, setIncomingQuizes] = useState([]);
  const [completedQuizes, setCompletedQuizes] = useState([]);
  const [loadingQuizes, setLoadingQuizes] = useState(false);

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
  const allQuizzes = [...incomingQuizes, ...completedQuizes].slice(0, 5);

  useEffect(() => {
    fetchQuizes();
  }, []);
  return (
    <>
    <div className="py-6 w-full bg-white dark:bg-[#0D1321] min-h-screen">
      <div className="flex flex-col md:flex-row items-start gap-5">
        
        {/* Upcoming Quizzes Column */}
        <div className="md:w-1/2 w-full border border-black/10 dark:border-gray-800 p-4 sm:p-5 rounded-lg bg-gray-50 dark:bg-[#111827] shadow-sm">
        <h2 className="font-bold text-lg text-black dark:text-gray-100 mb-5 px-1">
          Upcoming 5 quizzes
        </h2>

        {loadingQuizes ? (
          <Loading height="h-64" />
        ) : (
          <div className="flex flex-col gap-3">
            {allQuizzes.map((quiz) => (
              <Link key={quiz._id} to={`/dashboard/quizes/${quiz._id}`}>
                <Card
                  className="w-full rounded-lg px-4 py-4 sm:h-24 sm:py-0 border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#1A1D23] hover:bg-gray-50 dark:hover:bg-[#252A33] transition-all flex items-center"
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                      <CardTitle className="dark:text-white text-[15px] font-bold truncate">
                        {quiz.title}
                      </CardTitle>
                      <div className="flex flex-col text-[13px] text-gray-500 dark:text-gray-400 gap-1">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="shrink-0" />
                          <span className="font-semibold">Scheduled:</span>
                          <span className="truncate">{quiz.schadule}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Lock size={14} className="shrink-0" />
                          <span className="font-semibold">Code:</span>
                          <span className="font-mono">{quiz.code}</span>
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shrink-0 ${
                        quiz.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
            <div className="mt-4 px-1">
              <Link
                to={"/dashboard/quizes"}
                className="flex gap-x-2 items-center text-green-600 font-bold hover:underline"
              >
                <span className="text-sm">View Quiz directory</span>
                <MoveRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Top Students Column */}
      <div className="md:w-1/2 w-full border border-black/10 dark:border-gray-800 p-4 sm:p-5 rounded-lg bg-gray-50 dark:bg-[#111827] shadow-sm">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="font-bold text-lg text-black dark:text-gray-100">
            Top 5 Students
          </h2>
          <Link to="/dashboard/students" className="font-bold text-sm flex items-center text-green-600 hover:underline">
            All Students
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="flex flex-col gap-3">
          {currentStudents.map((student, index) => (
            <Card
              key={student._id}
              className="w-full rounded-lg px-4 py-3 sm:px-5 sm:h-20 border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#1A1D23] hover:bg-gray-50 dark:hover:bg-[#252A33] transition-all flex items-center shadow-sm"
            >
              <div className="flex items-center justify-between w-full h-full">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={studentImages[index % studentImages.length]}
                    alt="avatar"
                    className="w-12 h-12 sm:w-14 sm:h-14 aspect-square object-cover rounded-full border border-gray-200 dark:border-gray-700"
                  />

                  <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
                    <CardTitle className="dark:text-white text-base font-bold truncate">
                      {student.first_name} {student.last_name}
                    </CardTitle>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium truncate">
                      Class rank: group | Average score: 20%
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full shrink-0 ml-2">
                  <ArrowRight
                    size={18}
                    className="text-gray-400 dark:text-gray-300"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
</>
);
}
