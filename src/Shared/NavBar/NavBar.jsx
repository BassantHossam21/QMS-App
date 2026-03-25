import React, { useContext } from "react";
import { ChevronDown, AlarmClockPlus, Mail, Bell, LogOut, Menu } from "lucide-react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import useAuth from "@/Hooks/useAuth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ThemeContext } from "@/Context/DarkModeContext";
import ToggleTheme from "../ToggleTheme/ToggleTheme";

export default function NavBar() {
  const { userProfile } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  let { logout } = useAuth();
  let { darkMode } = useContext(ThemeContext);
  const { toggleSidebar } = useSidebar();

  // Get title from path
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/groups")) return "Groups";
    if (path.includes("/quizes")) return "Quizes";
    if (path.includes("/results")) return "Results";
    if (path.includes("/questions")) return "Questions";
    if (path.includes("/quiz-result-view")) return "Results";
    if (path.includes("/students")) return "Students";

    return "Dashboard";
  };

  return (
    <header className="flex py-3 items-center justify-between bg-white dark:bg-[#0D1321] px-4 md:px-8 border-b border-black/10 dark:border-gray-800">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          <Menu className="w-6 h-6 dark:text-white" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-black dark:text-gray-100 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center h-full">
        {/* Toggle Theme */}
        <div className="px-2 md:px-4">
          <ToggleTheme />
        </div>

        {/* New Quiz */}
        <div className="px-2 md:px-6 flex items-center h-full border-l border-black/10 dark:border-gray-600">
          <Link
            to="/dashboard/quizes"
            className="flex items-center gap-2 rounded-full border border-black/20 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 md:px-5 py-2 text-[14px] font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-95 cursor-pointer"
            id="new-quiz-btn"
          >
            <div className="flex items-center justify-center rounded-full bg-[#FFF2EB] dark:bg-gray-600 text-[#E37A49] dark:text-gray-200">
              <AlarmClockPlus className="h-4 w-4 stroke-[2.5]" />
            </div>

            {/* Hidden on mobile */}
            <span className="hidden md:block text-black dark:text-gray-100">
              New quiz
            </span>
          </Link>
        </div>

        {/* Mail */}
        <div className="px-2 md:px-6 flex items-center h-full border-l border-black/10 dark:border-gray-600 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="relative">
            <Mail
              size={18}
              className="text-black dark:text-gray-200 fill-black dark:fill-gray-200"
            />

            <span className="absolute -top-2 -right-2 flex h-4 w-5 items-center justify-center rounded-full bg-[#FFF2EB] dark:bg-gray-600 text-[10px] font-bold text-black dark:text-gray-200 border border-black/10 dark:border-gray-600">
              10
            </span>
          </div>
        </div>

        {/* Bell */}
        <div className="px-2 md:px-6 flex items-center h-full border-l border-black/10 dark:border-gray-600 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="relative">
            <Bell
              size={18}
              className="text-black dark:text-gray-200 fill-black dark:fill-gray-200"
            />

            <span className="absolute -top-2 -right-2 flex h-4 w-5 items-center justify-center rounded-full bg-[#FFF2EB] dark:bg-gray-600 text-[10px] font-bold text-black dark:text-gray-200 border border-black/10 dark:border-gray-600">
              10
            </span>
          </div>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="px-2 md:px-6 flex items-center gap-2 md:gap-4 cursor-pointer group h-full border-l border-black/10 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              id="user-profile-menu"
            >
              {/* Hidden on mobile */}
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-black dark:text-gray-100">
                  {userProfile
                    ? `${userProfile.first_name} ${userProfile.last_name || ""}`
                    : "User Name"}
                </span>

                <span className="text-[10px] font-semibold text-[#CDD400]">
                  {userProfile?.role}
                </span>
              </div>

              <ChevronDown className="h-5 w-5 text-black/30 dark:text-gray-400" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-1">
            <DropdownMenuLabel className="text-xs text-gray-400 dark:text-gray-500 font-medium px-2">
              Actions
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center text-xs gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-700 dark:text-gray-200">
                <NavLink
                  to="/dashboard/change-password"
                  className="flex items-center gap-2 w-full"
                >
                  <AlarmClockPlus
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  Change Password
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-700 text-xs font-medium text-red-500 dark:text-red-400"
                onClick={logout}
              >
                <LogOut size={16} />
                LogOut
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
