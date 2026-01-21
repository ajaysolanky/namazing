"use client";

import { useState } from "react";
import { type IntakeFormData } from "@/hooks/useIntakeForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface NamesStepProps {
  formData: IntakeFormData;
  updateField: <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => void;
}

export function NamesStep({ formData, updateField }: NamesStepProps) {
  const [newConsideringName, setNewConsideringName] = useState("");
  const [newConsideringNotes, setNewConsideringNotes] = useState("");
  const [newAvoidName, setNewAvoidName] = useState("");

  const addConsideringName = () => {
    if (newConsideringName.trim()) {
      updateField("namesConsidering", [
        ...formData.namesConsidering,
        { name: newConsideringName.trim(), notes: newConsideringNotes.trim() || undefined },
      ]);
      setNewConsideringName("");
      setNewConsideringNotes("");
    }
  };

  const removeConsideringName = (index: number) => {
    updateField(
      "namesConsidering",
      formData.namesConsidering.filter((_, i) => i !== index)
    );
  };

  const addAvoidName = () => {
    if (newAvoidName.trim()) {
      updateField("namesToAvoid", [...formData.namesToAvoid, newAvoidName.trim()]);
      setNewAvoidName("");
    }
  };

  const removeAvoidName = (index: number) => {
    updateField(
      "namesToAvoid",
      formData.namesToAvoid.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
          Names on your mind
        </h1>
        <p className="text-studio-ink/60 max-w-md mx-auto">
          Are there names you've been considering? Or ones that just don't feel right?
          This helps us understand your taste.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Names considering */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-studio-ink">
            Names you're considering
          </label>
          <p className="text-sm text-studio-ink/50">
            Add any names you've thought about, even if you're not sure about them.
          </p>

          {formData.namesConsidering.length > 0 && (
            <div className="space-y-2">
              {formData.namesConsidering.map((item, index) => (
                <Card key={index} variant="outline" padding="sm" className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-studio-ink">{item.name}</span>
                    {item.notes && (
                      <p className="text-sm text-studio-ink/50 mt-0.5">{item.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeConsideringName(index)}
                    className="text-studio-ink/40 hover:text-studio-ink p-1 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={newConsideringName}
              onChange={(e) => setNewConsideringName(e.target.value)}
            />
            <Input
              placeholder="Notes (optional) - e.g., 'love it but worried about popularity'"
              value={newConsideringNotes}
              onChange={(e) => setNewConsideringNotes(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addConsideringName()}
            />
            <Button variant="secondary" onClick={addConsideringName} size="sm">
              Add name
            </Button>
          </div>
        </div>

        {/* Names to avoid */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-studio-ink">
            Names to avoid
          </label>
          <p className="text-sm text-studio-ink/50">
            Every family has names that just don't feel right. What are yours?
          </p>

          {formData.namesToAvoid.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.namesToAvoid.map((name, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-studio-rose/30 text-studio-ink rounded-full text-sm"
                >
                  {name}
                  <button
                    onClick={() => removeAvoidName(index)}
                    className="text-studio-ink/40 hover:text-studio-ink"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Name to avoid"
                value={newAvoidName}
                onChange={(e) => setNewAvoidName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAvoidName()}
              />
            </div>
            <Button variant="secondary" onClick={addAvoidName} size="md">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
