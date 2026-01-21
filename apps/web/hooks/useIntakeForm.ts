"use client";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";

const STORAGE_KEY = "namazing-intake-form";

export const intakeFormSchema = z.object({
  // Welcome step
  babyGender: z.enum(["boy", "girl", "unknown"]).optional(),

  // Family step
  surname: z.string().min(1, "Surname is required"),
  siblings: z.array(z.object({
    name: z.string(),
    age: z.string(),
  })).default([]),

  // Style step
  stylePreferences: z.array(z.string()).default([]),
  lengthPreference: z.enum(["short", "short-to-medium", "any"]).default("any"),
  nicknameTolerance: z.enum(["low", "medium", "high"]).default("medium"),

  // Names step
  namesConsidering: z.array(z.object({
    name: z.string(),
    notes: z.string().optional(),
  })).default([]),
  namesToAvoid: z.array(z.string()).default([]),

  // Heritage step
  culturalConsiderations: z.array(z.string()).default([]),
  familyTraditions: z.string().default(""),
  honorNames: z.array(z.string()).default([]),

  // Freeform step
  additionalNotes: z.string().default(""),
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;

const defaultFormData: IntakeFormData = {
  babyGender: undefined,
  surname: "",
  siblings: [],
  stylePreferences: [],
  lengthPreference: "any",
  nicknameTolerance: "medium",
  namesConsidering: [],
  namesToAvoid: [],
  culturalConsiderations: [],
  familyTraditions: "",
  honorNames: [],
  additionalNotes: "",
};

export function useIntakeForm() {
  const [formData, setFormData] = useState<IntakeFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData({ ...defaultFormData, ...parsed.formData });
          setCurrentStep(parsed.currentStep || 0);
        } catch (e) {
          console.error("Failed to parse saved form data", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, currentStep })
      );
    }
  }, [formData, currentStep, isLoaded]);

  const updateField = useCallback(<K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 6)));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 0: // Welcome
        return true; // Gender is optional
      case 1: // Family
        return formData.surname.length > 0;
      case 2: // Style
        return true; // All optional
      case 3: // Names
        return true; // All optional
      case 4: // Heritage
        return true; // All optional
      case 5: // Freeform
        return true; // All optional
      case 6: // Review
        return formData.surname.length > 0;
      default:
        return false;
    }
  }, [formData]);

  return {
    formData,
    currentStep,
    isLoaded,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    validateStep,
    setFormData,
  };
}

// Transform form data to SessionProfile format for API
export function transformToSessionProfile(data: IntakeFormData) {
  const styleLanes: string[] = [];
  if (data.stylePreferences.includes("classic")) styleLanes.push("classic");
  if (data.stylePreferences.includes("modern")) styleLanes.push("modern");
  if (data.stylePreferences.includes("unique")) styleLanes.push("unique");
  if (data.stylePreferences.includes("traditional")) styleLanes.push("traditional");
  if (data.stylePreferences.includes("nature")) styleLanes.push("nature-inspired");

  // Build raw brief from form data
  const briefParts: string[] = [];

  if (data.babyGender && data.babyGender !== "unknown") {
    briefParts.push(`Looking for ${data.babyGender} names.`);
  } else {
    briefParts.push("Looking for names (gender unknown or flexible).");
  }

  briefParts.push(`Family surname: ${data.surname}.`);

  if (data.siblings.length > 0) {
    const siblingStr = data.siblings
      .map((s) => s.age ? `${s.name} (${s.age})` : s.name)
      .join(", ");
    briefParts.push(`Siblings: ${siblingStr}.`);
  }

  if (styleLanes.length > 0) {
    briefParts.push(`Style preferences: ${styleLanes.join(", ")}.`);
  }

  if (data.lengthPreference !== "any") {
    briefParts.push(`Prefer ${data.lengthPreference} names.`);
  }

  if (data.namesConsidering.length > 0) {
    const considering = data.namesConsidering
      .map((n) => n.notes ? `${n.name} (${n.notes})` : n.name)
      .join(", ");
    briefParts.push(`Names being considered: ${considering}.`);
  }

  if (data.namesToAvoid.length > 0) {
    briefParts.push(`Names to avoid: ${data.namesToAvoid.join(", ")}.`);
  }

  if (data.honorNames.length > 0) {
    briefParts.push(`Honor names to consider: ${data.honorNames.join(", ")}.`);
  }

  if (data.culturalConsiderations.length > 0) {
    briefParts.push(`Cultural considerations: ${data.culturalConsiderations.join(", ")}.`);
  }

  if (data.familyTraditions) {
    briefParts.push(`Family traditions: ${data.familyTraditions}`);
  }

  if (data.additionalNotes) {
    briefParts.push(`Additional notes: ${data.additionalNotes}`);
  }

  return {
    raw_brief: briefParts.join(" "),
    family: {
      surname: data.surname,
      siblings: data.siblings.map((s) => s.name).filter(Boolean),
      honor_names: data.honorNames,
      special_initials_include: [],
      special_initials_avoid: [],
    },
    preferences: {
      style_lanes: styleLanes,
      avoid_endings: [],
      nickname_tolerance: data.nicknameTolerance,
      length_pref: data.lengthPreference,
      cultural_bounds: data.culturalConsiderations,
      frozen_callback: false,
    },
    themes: data.stylePreferences,
    vetoes: {
      hard: data.namesToAvoid,
      soft: [],
    },
    region: [],
    target_popularity_band: null,
    comments: data.additionalNotes,
  };
}
