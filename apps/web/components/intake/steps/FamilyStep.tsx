"use client";

import { useState } from "react";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface FamilyStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

export function FamilyStep({ formData, updateField }: FamilyStepProps) {
  const [newSiblingName, setNewSiblingName] = useState("");
  const [newSiblingAge, setNewSiblingAge] = useState("");

  const addSibling = () => {
    if (newSiblingName.trim()) {
      updateField("siblings", [
        ...formData.siblings,
        { name: newSiblingName.trim(), age: newSiblingAge.trim() },
      ]);
      setNewSiblingName("");
      setNewSiblingAge("");
    }
  };

  const removeSibling = (index: number) => {
    updateField(
      "siblings",
      formData.siblings.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          Tell us about your family
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          We&apos;ll use this to find names that sound beautiful with your surname
          and complement your other children&apos;s names.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Surname */}
        <div>
          <Input
            id="surname"
            label="Family surname"
            value={formData.surname}
            onChange={(e) => updateField("surname", e.target.value)}
            placeholder="Smith"
          />
        </div>

        {/* Siblings */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-studio-ink">
            Siblings (if any)
          </label>
          <p className="text-sm text-studio-ink/50">
            If you have other children, we&apos;ll make sure the names flow well together.
          </p>

          {/* Sibling list */}
          {formData.siblings.length > 0 && (
            <div className="space-y-2">
              {formData.siblings.map((sibling, index) => (
                <Card key={index} variant="outline" padding="sm" className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-studio-ink">{sibling.name}</span>
                    {sibling.age && (
                      <span className="text-studio-ink/50 ml-2">({sibling.age})</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSibling(index)}
                    className="text-studio-ink/40 hover:text-studio-ink p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Card>
              ))}
            </div>
          )}

          {/* Add sibling form */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Name"
                value={newSiblingName}
                onChange={(e) => setNewSiblingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSibling()}
              />
            </div>
            <div className="w-24">
              <Input
                placeholder="Age"
                value={newSiblingAge}
                onChange={(e) => setNewSiblingAge(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSibling()}
              />
            </div>
            <Button variant="secondary" onClick={addSibling} size="md">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
