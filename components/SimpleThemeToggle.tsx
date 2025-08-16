"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-4 py-2 bg-laha-gold text-laha-black rounded-lg font-semibold">
        Chargement...
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-laha-gold text-laha-black rounded-lg font-semibold hover:bg-laha-gold-warm transition-colors flex items-center gap-2"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Mode Nuit</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Mode Jour</span>
        </>
      )}
    </button>
  );
}


