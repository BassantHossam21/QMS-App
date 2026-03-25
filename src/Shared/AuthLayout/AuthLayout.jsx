import React from "react";
import { Outlet } from "react-router-dom";
import { Check, X } from "lucide-react";
import img from "../../assets/AuthImg.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden w-full bg-[#0f111a] flex flex-col md:flex-row">
      {/* Left Side: Form Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-4 lg:p-6 h-full">
        <div className="w-full max-w-4xl flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center mb-6 md:mb-8">
            <div className="flex items-center">
              <div className="bg-[#0f111a] rounded-full h-9 w-9 md:w-10 flex items-center justify-center border-2 border-white z-10">
                <X size={20} className="text-white" strokeWidth={3} />
              </div>
              <div className="bg-[#0f111a] rounded-full h-9 w-9 md:w-10 flex items-center justify-center border-2 border-white z-20">
                <Check size={20} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="font-mono text-xl md:text-2xl tracking-widest ml-1 text-white">
              |Quizwiz
            </span>
          </div>

          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Right Side: Image Section */}
      <div className="md:w-1/2 w-full hidden md:flex items-center justify-center p-4 md:p-6 lg:p-8 xl:p-10 bg-[#0f111a]">
        <div className="w-full h-full bg-[#FFEDDF] rounded-[30px] flex items-center justify-center overflow-hidden max-h-[92vh] shadow-2xl">
          <img
            src={img}
            alt="Authentication Illustration"
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
