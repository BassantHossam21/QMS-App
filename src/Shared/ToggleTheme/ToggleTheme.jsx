import React, { useContext } from "react";
import { ThemeContext } from "../../Context/DarkModeContext";

import { Moon, Sun } from "lucide-react";

export default function ToggleTheme() {
  let { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <i onClick={toggleTheme} className="w-fit cursor-pointer text-2xl">
      {darkMode ? (
        <Sun className="text-yellow-400" />
      ) : (
        <Moon className=" text-black" />
      )}
    </i>
  );
}
