"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIntakeForm, transformToSessionProfile } from "@/hooks/useIntakeForm";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeStep } from "./steps/WelcomeStep";
import { FamilyStep } from "./steps/FamilyStep";
import { StyleStep } from "./steps/StyleStep";
import { NamesStep } from "./steps/NamesStep";
import { HeritageStep } from "./steps/HeritageStep";
import { FreeformStep } from "./steps/FreeformStep";
import { ReviewStep } from "./steps/ReviewStep";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { startRun } from "@/lib/api";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function IntakeWizard() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    isLoaded,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    validateStep,
  } = useIntakeForm();

  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      nextStep();
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const handleStepClick = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    goToStep(step);
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const profile = transformToSessionProfile(formData);
      const { runId } = await startRun(profile.raw_brief, "parallel");
      // Navigate first, then reset form in the background
      // This prevents the form from flashing back to step 0
      router.push(`/processing/${runId}`);
      // Reset form after a delay to ensure navigation has started
      setTimeout(() => resetForm(), 500);
    } catch (err: any) {
      console.error("Failed to start run:", err);
      if (err?.code === "DAILY_LIMIT") {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <Container size="md" className="py-12">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-studio-ink/20 border-t-studio-ink rounded-full animate-spin" />
        </div>
      </Container>
    );
  }

  const steps = [
    <WelcomeStep key="welcome" formData={formData} updateField={updateField} />,
    <FamilyStep key="family" formData={formData} updateField={updateField} />,
    <StyleStep key="style" formData={formData} updateField={updateField} />,
    <NamesStep key="names" formData={formData} updateField={updateField} />,
    <HeritageStep key="heritage" formData={formData} updateField={updateField} />,
    <FreeformStep key="freeform" formData={formData} updateField={updateField} />,
    <ReviewStep key="review" formData={formData} />,
  ];

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const canProceed = validateStep(currentStep);

  // Show full-screen transition when submitting
  if (isSubmitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-studio-sage/30 border-t-studio-sage rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-studio-rose to-studio-sage rounded-full animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl text-studio-ink">
              Starting your consultation
            </h2>
            <p className="text-studio-ink/60">
              We&apos;re assembling your expert naming team...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress indicator */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-studio-ink/5 py-6">
        <Container size="md">
          <ProgressIndicator currentStep={currentStep} onStepClick={handleStepClick} />
        </Container>
      </div>

      {/* Form content */}
      <Container size="md" className="flex-1 py-8 sm:py-12">
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {steps[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-studio-ink/10">
          <div>
            {!isFirstStep && (
              <Button variant="ghost" onClick={handlePrev}>
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Starting...
                  </>
                ) : (
                  "Start consultation"
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
