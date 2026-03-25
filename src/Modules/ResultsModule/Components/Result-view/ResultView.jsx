import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useResults from "@/Hooks/useResults";
import { ChevronRight, Eye, Search } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function ResultView() {
  const { getAllResults, loading, results } = useResults();
  const [search, setSearch] = useState("");
  const { state } = useLocation();
  const { quiz, participants } = state;
  const filtered = participants.filter((student) =>
    `${student.participant.first_name} ${student.participant.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const navigate = useNavigate();
  return (
    <>
      <div className="mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2  text-gray-600 text-base my-8">
          <span
            className="cursor-pointer hover:text-black transition"
            onClick={() => navigate(-1)}
          >
            Quizzes
          </span>
          <ChevronRight size={18} />
          <span className="text-black text-lg">{quiz.title}</span>
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="relative  w-full ">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />

            <Input
              className="w-full py-6 pl-10 rounded-full border border-gray-300 placeholder:text-gray-600 placeholder:text-base"
              placeholder="Search By Student Name"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="border border-gray-300 p-5 rounded-lg mt-5">
          <Table className="border border-gray-200 p-5 rounded-lg ">
            <TableHeader className="bg-[#0D1321] rounded-full text-center ">
              <TableRow className="hover:bg-transparent border-none text-center">
                <TableHead className="text-white text-center font-bold uppercase py-4 px-6 text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">
                  #
                </TableHead>
                <TableHead className="text-white text-center font-bold uppercase py-4 px-6 text-[14px] tracking-wider border-r border-gray-800 last:border-r-0">
                  Student name
                </TableHead>

                <TableHead className="text-white font-bold uppercase py-4 px-6 text-[14px] tracking-wider border-r border-gray-800 last:border-r-0 text-center">
                  Score
                </TableHead>
                <TableHead className="text-white font-bold uppercase py-4 px-6 text-[14px] tracking-wider border-r border-gray-800 last:border-r-0 text-center">
                  Submitted at
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-xl text-gray-400 font-mono  "
                  >
                    No participants found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((result, index) => (
                <TableRow
                  className="text-center tracking-widest py-5"
                  key={result.quiz._id}
                >
                  <TableCell className="font-medium tracking-widest py-5">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium tracking-widest py-5">
                    {result.participant.first_name}{" "}
                    {result.participant.last_name}
                  </TableCell>
                  <TableCell>{result.score}</TableCell>

                  <TableCell className="text-center tracking-widest py-5">
                    {new Date(result.finished_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
