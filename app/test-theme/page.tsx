"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import SimpleThemeToggle from "@/components/SimpleThemeToggle";

export default function TestThemePage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test du Bouton de Thème</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Thème actuel : {theme}</h2>
            <p className="text-muted-foreground">Classe CSS : {theme === "dark" ? "dark" : "light"}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Variantes du bouton :</h2>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Default :</p>
                <ThemeToggle variant="default" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Header :</p>
                <ThemeToggle variant="header" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Sidebar :</p>
                <ThemeToggle variant="sidebar" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Test de visibilité :</h2>
            <div className="p-6 bg-card border rounded-lg">
              <p className="mb-4">Cette zone utilise les couleurs du thème actuel</p>
              <div className="flex justify-center">
                <ThemeToggle variant="default" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Composant Simple :</h2>
            <div className="p-6 bg-card border rounded-lg">
              <p className="mb-4">Version simplifiée du bouton de thème</p>
              <div className="flex justify-center">
                <SimpleThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
