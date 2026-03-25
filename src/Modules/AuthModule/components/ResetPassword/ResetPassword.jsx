import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Eye, EyeOff, Loader2, Check } from "lucide-react";
import useAuth from "@/Hooks/useAuth";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { resetPassword, loading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      otp: data.otp,
      password: data.password,
    };
    await resetPassword(payload);
  };

  return (
    <>
      {/* Heading */}
      <h2 className="text-[#C5D86D] font-bold mb-6 md:mb-10 lg:mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
        Reset password
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full my-8 md:my-10">
        <FieldGroup className="gap-5 md:gap-6 lg:gap-8">
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

          {/* OTP Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              OTP
            </FieldLabel>
            <div
              className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                errors.otp
                  ? "border-red-500"
                  : "border-white focus-within:border-[#C5D86D]"
              }`}
            >
              <Check
                size={20}
                className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
              />
              <Input
                type="text"
                {...register("otp", { required: "OTP is required" })}
                placeholder="Enter OTP"
                className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
              />
            </div>
            {errors.otp && (
              <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                {errors.otp.message}
              </FieldError>
            )}
          </Field>

          {/* Password Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              New Password
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
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                placeholder="Type your password"
                className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="text-white" size={20} />
                ) : (
                  <Eye className="text-white" size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                {errors.password.message}
              </FieldError>
            )}
          </Field>

          {/* Confirm Password Field */}
          <Field>
            <FieldLabel className="text-white text-sm sm:text-base lg:text-[20px] font-medium mb-1">
              Confirm Password
            </FieldLabel>
            <div
              className={`flex items-center bg-[#0f111a] border-3 rounded-[10px] px-3 md:px-4 h-11 md:h-12 lg:h-13 transition-colors ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-white focus-within:border-[#C5D86D]"
              }`}
            >
              <Key
                size={20}
                className="text-white shrink-0 mr-2 md:mr-3 md:w-[26px] lg:w-[30px]"
              />
              <Input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="Confirm password"
                className="border-none bg-transparent shadow-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-[14px] md:text-[15px] px-0 placeholder:text-[13px] md:placeholder:text-[15px]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="focus:outline-none"
              >
                {showConfirm ? (
                  <EyeOff className="text-white" size={20} />
                ) : (
                  <Eye className="text-white" size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <FieldError className="text-red-400 text-[12px] md:text-[13px] mt-1">
                {errors.confirmPassword.message}
              </FieldError>
            )}
          </Field>
        </FieldGroup>

        {/* Actions */}
        <div className="flex items-center mt-10 md:mt-12 lg:mt-16 w-full">
          <Button
            disabled={loading}
            type="submit"
            className="bg-white hover:bg-gray-200 text-black font-bold py-5 md:py-6 lg:py-7 px-6 md:px-8 lg:px-10 rounded-[10px] flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="text-[14px] md:text-[16px] lg:text-[17px]">
              {loading ? "Updating..." : "Reset Password"}
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