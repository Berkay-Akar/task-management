"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import MoonIcon from "./icons/moonIcon";
import SunIcon from "./icons/sunIcon";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5 " />
      ) : (
        <SunIcon className="h-5 w-5 text-yellow-300" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
