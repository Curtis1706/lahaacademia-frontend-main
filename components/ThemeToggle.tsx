"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Passer en mode ${theme === "light" ? "nuit" : "jour"}`}
      className="px-4 py-2 rounded-lg font-medium transition-all bg-white/10 text-white hover:bg-laha-gold hover:text-laha-black ml-2"
      style={{ cursor: "pointer" }}
    >
      {theme === "light" ? "🌙 Mode Nuit" : "☀️ Mode Jour"}
    </button>
  );
} 