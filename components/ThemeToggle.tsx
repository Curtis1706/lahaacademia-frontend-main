"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "sidebar" | "header";
  className?: string;
}

export default function ThemeToggle({ variant = "default", className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Éviter l'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  const variantClasses = {
    default: "px-4 py-3 bg-laha-gold/10 text-laha-gold-dark hover:bg-laha-gold hover:text-laha-black border border-laha-gold/20 transition-all duration-200",
    sidebar: "p-2 bg-white/5 text-white/70 hover:bg-laha-gold/20 hover:text-laha-gold transition-all duration-200",
    header: "px-4 py-2 bg-laha-gold text-laha-black hover:bg-laha-gold-warm border border-laha-gold-dark shadow-lg font-semibold transition-all duration-200 hover:shadow-xl"
  };

  if (!mounted) {
    return (
      <button className={cn("rounded-lg font-medium", variantClasses[variant], className)}>
        <div className="w-5 h-5" />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Passer en mode ${theme === "light" ? "sombre" : "clair"}`}
      title={`Passer en mode ${theme === "light" ? "sombre" : "clair"}`}
      className={cn(
        "rounded-lg font-medium flex items-center gap-2 transition-all duration-200",
        variantClasses[variant],
        className
      )}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
          <span className="text-sm font-medium">Mode Nuit</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span className="text-sm font-medium">Mode Jour</span>
        </>
      )}
    </button>
  );
} 