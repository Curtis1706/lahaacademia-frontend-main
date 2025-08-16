"use client"

import { useState, ReactNode } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface StepProps {
  children: ReactNode
}

export function Step({ children }: StepProps) {
  return <div>{children}</div>
}

interface StepperProps {
  children: ReactNode[]
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => void
  backButtonText?: string
  nextButtonText?: string
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Précédent",
  nextButtonText = "Suivant"
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const totalSteps = children.length

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      onStepChange?.(nextStep)
    } else {
      onFinalStepCompleted?.()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  index + 1 <= currentStep
                    ? "bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black"
                    : "bg-laha-surface/20 text-laha-text-secondary border border-laha-border"
                }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-0.5 w-16 mx-2 transition-all ${
                    index + 1 < currentStep
                      ? "bg-gradient-to-r from-laha-gold to-laha-gold-warm"
                      : "bg-laha-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-laha-text-secondary text-sm">
          Étape {currentStep} sur {totalSteps}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-laha-surface/20 backdrop-blur-md border border-laha-border rounded-xl p-8 mb-8"
      >
        {children[currentStep - 1]}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            currentStep === 1
              ? "bg-laha-surface/10 text-laha-text-secondary/50 cursor-not-allowed"
              : "bg-laha-surface/20 text-laha-gold hover:bg-laha-gold/20 hover:text-laha-gold border border-laha-border"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          {backButtonText}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all"
        >
          {currentStep === totalSteps ? "Terminer" : nextButtonText}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}