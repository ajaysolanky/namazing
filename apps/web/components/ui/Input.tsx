"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              focused || hasValue
                ? "top-2 text-xs text-studio-ink/60"
                : "top-1/2 -translate-y-1/2 text-base text-studio-ink/40"
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-white border rounded-xl px-4 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta/40 focus:shadow-soft",
            label ? "pt-6 pb-2" : "py-3",
            error
              ? "border-red-400 bg-red-50/30 focus:ring-red-200"
              : "border-studio-ink/10",
            className
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              focused || hasValue
                ? "top-2 text-xs text-studio-ink/60"
                : "top-4 text-base text-studio-ink/40"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-white border rounded-xl px-4 transition-all duration-200 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-studio-terracotta/20 focus:border-studio-terracotta/40 focus:shadow-soft",
            label ? "pt-6 pb-3" : "py-3",
            error
              ? "border-red-400 bg-red-50/30 focus:ring-red-200"
              : "border-studio-ink/10",
            className
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
