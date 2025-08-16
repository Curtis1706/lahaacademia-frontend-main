"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function AnimatedThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-laha-gold/20 border border-laha-gold/30 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:bg-laha-gold/30 hover:border-laha-gold/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Arrière-plan avec gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-laha-gold to-laha-gold-warm opacity-0"
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Animation de pulsation continue */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-laha-gold/30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Icônes avec transition fluide */}
      <div className="relative z-10 w-5 h-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ 
              rotate: theme === "dark" ? -90 : 90,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              rotate: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              rotate: theme === "dark" ? 90 : -90,
              opacity: 0,
              scale: 0.5
            }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.4
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-laha-gold" />
            ) : (
              <Moon className="w-5 h-5 text-laha-gold" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Effet de ripple au clic */}
      <motion.div
        className="absolute inset-0 rounded-full bg-laha-gold/40"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
