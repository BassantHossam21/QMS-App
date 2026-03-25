import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/Context/AuthContext";
import useResults from "@/Hooks/useResults";
import Loading from "@/Shared/Loading/Loading";
import Pagination from "@/Shared/Pagination/Pagination";
import { Eye, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const { getAllResults, loading, results } = useResults();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  let { loginData } = useContext(AuthContext);
  const itemsPerPage = 10;

  const filtered = results.filter((result) =>
    result.quiz.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedResults = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    getAllResults();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="py-6 w-full bg-white dark:bg-[#0D1321] min-h-screen">
      <div className="border border-black/20 dark:border-gray-800 rounded-[10px] shadow-sm overflow-hidden">

        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#111827] border-b border-black/20 dark:border-gray-800 gap-4">
          <h2 className="text-xl font-bold text-black dark:text-gray-100">
            Closed Quizzes
          </h2>

          <div className="relative w-full sm:md:w-1/3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
            <Input
              className="w-full pl-9 rounded-[30px] border border-black/20 dark:border-gray-800 bg-white dark:bg-[#1A1D23] placeholder:text-gray-400 text-black dark:text-white shadow-sm h-11 focus-visible:ring-0"
              placeholder="Search By Name"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="px-4 sm:px-6 py-6 bg-white dark:bg-[#111827]">
          <div className="border border-black/20 dark:border-gray-800 shadow-sm rounded-[10px] overflow-hidden overflow-x-auto">
            <Table className="min-w-[1000px] w-full">
              <TableHeader className="bg-[#0D1321] dark:bg-black text-white">
                <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">TITLE</TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">STATUS</TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">CODE</TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">DURATION</TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">SCHEDULE</TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">DIFFICULTY</TableHead>
                  <TableHead className="text-white font-bold uppercase text-center text-[14px] tracking-wider">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7}><Loading /></TableCell>
                  </TableRow>
                ) : paginatedResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500 dark:text-gray-400">
                      No closed quizzes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedResults.map((result) => (
                    <TableRow
                      key={result.quiz._id}
                      className={`border-b border-black/20 dark:border-gray-800 last:border-0 hover:bg-gray-50/40 dark:hover:bg-[#1A1D23] ${loginData?.role === "Instructor" ? "cursor-pointer" : ""}`}
                      onClick={() => {
                        if (loginData?.role === "Instructor") {
                          navigate(`/dashboard/quiz-result-view`, {
                            state: { quiz: result.quiz, participants: result.participants },
                          });
                        }
                      }}
                    >
                      <TableCell className="text-center py-6 text-black dark:text-gray-100 text-[14px] border-r border-black/20 dark:border-gray-800 last:border-r-0 font-medium">
                        {result.quiz.title}
                      </TableCell>
                      <TableCell className="text-center py-6 border-r border-black/20 dark:border-gray-800 last:border-r-0">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-[13px] font-medium ${
                          result.quiz.status === "active"
                            ? "bg-[#ECFDF5] text-[#065F46]"
                            : "bg-[#FFF1F2] text-[#9F1239]"
                        }`}>
                          {result.quiz.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-6 text-black dark:text-gray-100 text-[14px] border-r border-black/20 dark:border-gray-700 last:border-r-0 font-mono font-semibold">
                        {result.quiz.code}
                      </TableCell>
                      <TableCell className="text-center py-6 text-black dark:text-gray-100 text-[14px] border-r border-black/20 dark:border-gray-700 last:border-r-0">
                        {result.quiz.duration} MIN
                      </TableCell>
                      <TableCell className="text-center py-6 text-black dark:text-gray-100 text-[14px] border-r border-black/20 dark:border-gray-700 last:border-r-0">
                        {new Date(result.quiz.schadule).toLocaleString("en-GB", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit", hour12: true,
                        })}
                      </TableCell>
                      <TableCell className="text-center py-6 border-r border-black/20 dark:border-gray-700 last:border-r-0">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-[13px] font-medium ${
                          result.quiz.difficulty === "easy"
                            ? "bg-[#ECFDF5] text-[#065F46]"
                            : result.quiz.difficulty === "hard"
                              ? "bg-[#FFF1F2] text-[#9F1239]"
                              : "bg-[#FFFBEB] text-[#92400E]"
                        }`}>
                          {result.quiz.difficulty}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <Eye size={18} strokeWidth={3} className="text-[#FB7C19] cursor-pointer hover:opacity-80 transition-opacity" />
                          <span className="text-[13px] font-semibold text-[#FB7C19]">View</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </div>
  );
}
