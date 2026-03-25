import { useState } from "react";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Loader2, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "@/Hooks/useAuth";

export default function ChangePassword() {
  const { changePassword, loading } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    password_new: "",
    confirm_password: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.password_new) {
      return toast.error("Please fill all fields");
    }

    if (formData.password_new !== formData.confirm_password) {
      return toast.error("New passwords do not match!");
    }

    if (formData.password === formData.password_new) {
      return toast.error("New password must be different from the old one");
    }

    const success = await changePassword({
      password: formData.password,
      password_new: formData.password_new,
    });

    if (success) {
      setFormData({ password: "", password_new: "", confirm_password: "" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-[#0f111a] border border-gray-800 rounded-[20px] p-6 md:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div className="bg-[#C5D86D] p-2 rounded-lg">
            <Key className="text-black" size={24} />
          </div>
          <h2 className="text-white font-bold text-2xl md:text-3xl">
            Security Settings
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FieldGroup className="gap-6 md:gap-8">
            {/* Current Password */}
            <Field>
              <FieldLabel className="text-white text-sm md:text-base font-medium mb-2">
                Current Password
              </FieldLabel>
              <div className="flex items-center bg-[#1a1c26] border-2 border-gray-700 rounded-[12px] px-4 h-12 md:h-14 transition-all focus-within:border-[#C5D86D]">
                <Key className="text-gray-400 mr-3" size={20} />
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showOld ? "text" : "password"}
                  placeholder="Type current password"
                  className="flex-1 border-none bg-transparent text-white focus-visible:ring-0 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            {/* New Password */}
            <Field>
              <FieldLabel className="text-white text-sm md:text-base font-medium mb-2">
                New Password
              </FieldLabel>
              <div className="flex items-center bg-[#1a1c26] border-2 border-gray-700 rounded-[12px] px-4 h-12 md:h-14 transition-all focus-within:border-[#C5D86D]">
                <ShieldCheck className="text-gray-400 mr-3" size={20} />
                <Input
                  name="password_new"
                  value={formData.password_new}
                  onChange={handleChange}
                  type={showNew ? "text" : "password"}
                  placeholder="Type new password"
                  className="flex-1 border-none bg-transparent text-white focus-visible:ring-0 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            {/* Confirm New Password */}
            <Field>
              <FieldLabel className="text-white text-sm md:text-base font-medium mb-2">
                Confirm New Password
              </FieldLabel>
              <div className="flex items-center bg-[#1a1c26] border-2 border-gray-700 rounded-[12px] px-4 h-12 md:h-14 transition-all focus-within:border-[#C5D86D]">
                <Check className="text-gray-400 mr-3" size={20} />
                <Input
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  className="flex-1 border-none bg-transparent text-white focus-visible:ring-0 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>
          </FieldGroup>

          <div className="flex justify-end pt-4">
            <Button
              disabled={loading}
              type="submit"
              className="w-full md:w-auto bg-[#C5D86D] hover:bg-[#b3c75a] text-black font-bold py-6 px-10 rounded-[12px] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
            >
              <span>{loading ? "Updating..." : "Update Password"}</span>
              <div className="bg-black text-white rounded-full p-1 flex items-center justify-center">
                {loading ? (
                  <Loader2 size={16} strokeWidth={3} className="animate-spin" />
                ) : (
                  <Check size={16} strokeWidth={4} />
                )}
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
