import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import useAuth from "@/Hooks/useAuth";

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("data");
    await forgotPassword(data);
  };

  return (
    <>
      {/* Heading */}
      <h2 className="text-[#C5D86D] font-bold mb-6 md:mb-10 lg:mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
        Forgot password
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full my-8 md:my-10">
        <FieldGroup className="gap-5 md:gap-6 lg:gap-8">
          {/* Email Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              Email address
            </FieldLabel>
            <div
              className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                errors.email
                  ? "border-red-500"
                  : "border-white focus-within:border-[#C5D86D]"
              }`}
            >
              <Mail
                size={20}
                className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
              />
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="Type your email"
                className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
              />
            </div>
            {errors.email && (
              <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                {errors.email.message}
              </FieldError>
            )}
          </Field>
        </FieldGroup>

        {/* Actions */}
        <div className="mt-10 md:mt-16 lg:mt-24 w-full flex flex-col items-start">
          <Button
            disabled={loading}
            type="submit"
            className="bg-white hover:bg-gray-200 text-black font-bold py-5 md:py-6 lg:py-7 px-6 md:px-8 lg:px-10 rounded-[10px] flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="text-[14px] md:text-[16px] lg:text-[17px]">
              {loading ? "Sending email..." : "Send email"}
            </span>
            <div className="bg-black text-white rounded-full p-1 flex items-center justify-center">
              {loading ? (
                <Loader2 size={15} strokeWidth={4} className="animate-spin" />
              ) : (
                <Check size={15} strokeWidth={4} />
              )}
            </div>
          </Button>

          <div className="w-full text-right mt-16 md:mt-24 lg:mt-32 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]">
            <span className="text-gray-200">Login? </span>
            <Link
              to="/"
              className="text-[#c1d936] font-semibold hover:underline"
            >
              click here
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
