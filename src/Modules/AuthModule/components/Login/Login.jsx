import { Link } from "react-router-dom";
import { Mail, Key, Check, User, UserPlus, Loader2 } from "lucide-react";
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

export default function Login() {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {}
  };

  return (
    <>
      {/* Heading */}
      <h2 className="text-[#C5D86D] font-bold mb-4 md:mb-6 lg:mb-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
        Continue your learning journey with QuizWiz!
      </h2>

      {/* Tabs */}
      <div className="flex gap-5 my-5 md:my-6">
        {/* Sign In Tab (Active) */}
        <Link
          to="/"
          className="flex-1 max-w-[240px] py-5 cursor-pointer bg-[#333333] border-4 lg:border-[5px] border-[#C5D86D] rounded-[10px] flex flex-col items-center justify-center transition-all shadow-md hover:bg-[#1f212f]"
        >
          <User
            size={28}
            className="text-[#c1d936] mb-1 sm:mb-2 sm:w-9 md:w-10 lg:w-[49px]"
            strokeWidth={1.5}
          />
          <span className="font-bold text-white tracking-wide text-[13px] sm:text-[15px] lg:text-[18px]">
            Sign in
          </span>
        </Link>

        {/* Sign Up Tab (Inactive) */}
        <Link
          to="/register"
          className="flex-1 max-w-[240px]  py-5 cursor-pointer bg-[#333333] rounded-[10px] flex flex-col items-center justify-center transition-all shadow-md hover:bg-[#2a2a2a]"
        >
          <UserPlus
            size={28}
            className="text-[#e2e2e2] mb-1 sm:mb-2 sm:w-9 md:w-10 lg:w-[49px]"
            strokeWidth={1.5}
          />
          <span className="font-bold text-[#e2e2e2] tracking-wide text-[13px] sm:text-[15px] lg:text-[18px]">
            Sign Up
          </span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full my-8 md:my-10">
        <FieldGroup className="gap-5 md:gap-6 lg:gap-8">
          {/* Email Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              Registered email address
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

          {/* Password Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              Password
            </FieldLabel>
            <div
              className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                errors.password
                  ? "border-red-500"
                  : "border-white focus-within:border-[#C5D86D]"
              }`}
            >
              <Key
                size={20}
                className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
              />
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[0-9]).+$/,
                    message:
                      "Password must contain at least one uppercase letter and one number",
                  },
                })}
                placeholder="Type your password"
                className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
              />
            </div>
            {errors.password && (
              <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                {errors.password.message}
              </FieldError>
            )}
          </Field>
        </FieldGroup>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 md:mt-12 lg:mt-16 w-full">
          <Button
            disabled={loading}
            type="submit"
            className="bg-white hover:bg-gray-200 text-black font-bold py-5 md:py-6 lg:py-7 px-6 md:px-8 lg:px-10 rounded-[10px] flex items-center space-x-2 transition-colors cursor-pointer shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="text-[14px] md:text-[16px] lg:text-[17px]">
              {loading ? "Signing in..." : "Sign In"}
            </span>
            <div className="bg-black text-white rounded-full p-1 flex items-center justify-center">
              {loading ? (
                <Loader2 size={15} strokeWidth={4} className="animate-spin" />
              ) : (
                <Check size={15} strokeWidth={4} />
              )}
            </div>
          </Button>

          <div className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] shrink-0">
            <span className="text-gray-200">Forgot password? </span>
            <Link
              to="/forgot-password"
              className="text-[#c1d936] underline font-semibold"
            >
              click here
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
