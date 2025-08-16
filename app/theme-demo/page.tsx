"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function ThemeDemoPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-laha-background text-laha-text">
      <Navigation currentPage="/theme-demo" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-laha-text mb-4">
            Démonstration des Thèmes
          </h1>
          <p className="text-xl text-laha-text-secondary">
            Thème actuel : <span className="font-semibold text-laha-gold">{theme}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Palette de couleurs */}
          <div className="bg-laha-surface rounded-2xl p-8 border border-laha-border">
            <h2 className="text-2xl font-bold text-laha-text mb-6">Palette de Couleurs</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-laha-background rounded-lg border border-laha-border"></div>
                <div>
                  <p className="font-medium text-laha-text">Background</p>
                  <p className="text-sm text-laha-text-secondary">--laha-background</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-laha-surface rounded-lg border border-laha-border"></div>
                <div>
                  <p className="font-medium text-laha-text">Surface</p>
                  <p className="text-sm text-laha-text-secondary">--laha-surface</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-laha-gold rounded-lg"></div>
                <div>
                  <p className="font-medium text-laha-text">Gold</p>
                  <p className="text-sm text-laha-text-secondary">--laha-gold</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-laha-gold-light-new rounded-lg border border-laha-border"></div>
                <div>
                  <p className="font-medium text-laha-text">Gold Light</p>
                  <p className="text-sm text-laha-text-secondary">--laha-gold-light-new</p>
                </div>
              </div>
            </div>
          </div>

          {/* Typographie */}
          <div className="bg-laha-surface rounded-2xl p-8 border border-laha-border">
            <h2 className="text-2xl font-bold text-laha-text mb-6">Typographie</h2>
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-laha-text">Titre H1</h1>
                <p className="text-sm text-laha-text-secondary">Texte principal</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-laha-text">Titre H2</h2>
                <p className="text-sm text-laha-text-secondary">Texte principal</p>
              </div>
              <div>
                <p className="text-lg text-laha-text">Paragraphe normal</p>
                <p className="text-sm text-laha-text-secondary">Texte secondaire</p>
              </div>
              <div>
                <p className="text-laha-gold font-medium">Accent doré</p>
                <p className="text-sm text-laha-text-secondary">Couleur d'accent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Composants UI */}
        <div className="bg-laha-surface rounded-2xl p-8 border border-laha-border mb-12">
          <h2 className="text-2xl font-bold text-laha-text mb-6">Composants UI</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-laha-gold text-laha-black font-semibold rounded-lg hover:bg-laha-gold-warm transition-all">
              Bouton Principal
            </button>
            <button className="px-6 py-3 bg-laha-surface text-laha-text border border-laha-border font-medium rounded-lg hover:bg-laha-gold/10 transition-all">
              Bouton Secondaire
            </button>
            <button className="px-6 py-3 bg-laha-gold-light-new text-laha-text font-medium rounded-lg hover:bg-laha-gold/20 transition-all">
              Bouton Accent
            </button>
          </div>
        </div>

        {/* Test du thème */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-laha-text mb-6">Test du Thème</h2>
          <div className="flex justify-center gap-4">
            <ThemeToggle variant="header" />
            <ThemeToggle variant="default" />
            <ThemeToggle variant="sidebar" />
          </div>
          <p className="text-laha-text-secondary mt-4">
            Cliquez sur les boutons pour tester le changement de thème
          </p>
        </div>
      </main>
    </div>
  );
}
