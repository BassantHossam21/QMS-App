import { Link } from "react-router-dom";
import {
  Mail,
  Key,
  Check,
  User,
  UserPlus,
  Loader2,
  Contact,
  Users,
} from "lucide-react";
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

export default function Register() {
  const { register: registerApi, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerApi(data);
    } catch (error) {}
  };

  return (
    <>
      {/* Heading */}
      <h2 className="text-[#C5D86D] font-bold mb-3 md:mb-5 lg:mb-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
        Create your account and start using QuizWiz!
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 my-4 md:my-5">
        {/* Sign In Tab (Inactive here) */}
        <Link
          to="/"
          className="flex-1 max-w-[240px] py-5 cursor-pointer bg-[#333333] rounded-[10px] flex flex-col items-center justify-center transition-all shadow-md hover:bg-[#2a2a2a]"
        >
          <User
            size={28}
            className="text-white  sm:mb-2 sm:w-9 md:w-10 lg:w-[49px]"
            strokeWidth={1.5}
          />
          <span className="font-bold text-white tracking-wide text-[13px] sm:text-[15px] lg:text-[18px]">
            Sign in
          </span>
        </Link>

        {/* Sign Up Tab (Active here) */}
        <Link
          to="/register"
          className="flex-1 max-w-[240px] py-5 cursor-pointer bg-[#333333] border-4 lg:border-[5px] border-[#C5D86D] rounded-[10px] flex flex-col items-center justify-center transition-all shadow-md hover:bg-[#1f212f]"
        >
          <UserPlus
            size={28}
            className="text-[#c1d936]  sm:mb-2 sm:w-9 md:w-10 lg:w-[49px]"
            strokeWidth={1.5}
          />
          <span className="font-bold text-white tracking-wide text-[13px] sm:text-[15px] lg:text-[18px]">
            Sign Up
          </span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full my-3 md:my-4">
        <FieldGroup className="gap-3 md:gap-4 lg:gap-5">
          {/* Row for First Name and Last Name */}
          <div className="flex flex-col sm:flex-row gap-3  w-full">
            {/* First Name Field */}
            <Field className="flex-1">
              <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
                Your first name
              </FieldLabel>
              <div
                className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                  errors.first_name
                    ? "border-red-500"
                    : "border-white focus-within:border-[#C5D86D]"
                }`}
              >
                <Contact
                  size={20}
                  className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
                />
                <Input
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  placeholder="Type your first name"
                  className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
                />
              </div>
              {errors.first_name && (
                <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                  {errors.first_name.message}
                </FieldError>
              )}
            </Field>

            {/* Last Name Field */}
            <Field className="flex-1">
              <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium ">
                Your last name
              </FieldLabel>
              <div
                className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                  errors.last_name
                    ? "border-red-500"
                    : "border-white focus-within:border-[#C5D86D]"
                }`}
              >
                <Contact
                  size={20}
                  className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
                />
                <Input
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  placeholder="Type your last name"
                  className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
                />
              </div>
              {errors.last_name && (
                <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                  {errors.last_name.message}
                </FieldError>
              )}
            </Field>
          </div>

          {/* Email Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              Your email address
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

          {/* Role Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              Your role
            </FieldLabel>
            <div
              className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                errors.role
                  ? "border-red-500"
                  : "border-white focus-within:border-[#C5D86D]"
              }`}
            >
              <Users
                size={20}
                className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
              />
              {/* Native select styled using Tailwind to match Input */}
              <select
                {...register("role", { required: "Role is required" })}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder:text-gray-400 text-[14px] md:text-[15px] appearance-none"
                defaultValue=""
              >
                <option
                  value=""
                  disabled
                  className="text-gray-400 bg-[#0f111a]"
                >
                  Choose your role
                </option>
                <option value="Instructor" className="text-white bg-[#0f111a]">
                  Instuctor
                </option>
                <option value="Student" className="text-white bg-[#0f111a]">
                  Student
                </option>
              </select>
            </div>
            {errors.role && (
              <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                {errors.role.message}
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
        <div className="flex items-center mt-5 md:mt-6 w-full">
          <Button
            disabled={loading}
            type="submit"
            className="bg-white hover:bg-gray-200 text-black font-bold py-5 md:py-6 lg:py-7 px-6 md:px-8 lg:px-10 rounded-[10px] flex items-center space-x-2 transition-colors cursor-pointer shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="text-[14px] md:text-[16px] lg:text-[17px]">
              {loading ? "Signing up..." : "Sign Up"}
            </span>
            <div className="bg-black text-white rounded-full p-1 flex items-center justify-center">
              {loading ? (
                <Loader2 size={15} strokeWidth={4} className="animate-spin" />
              ) : (
                <Check size={15} strokeWidth={4} />
              )}
            </div>
          </Button>
        </div>
      </form>
    </>
  );
}
