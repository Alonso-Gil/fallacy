"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";

import { Input as ShadcnInput } from "components/ui/input";
import { cn } from "lib/utils";
import type { PasswordFieldWithToggleProps } from "./PasswordFieldWithToggle.types";

const PasswordFieldWithToggle: React.FC<
  PasswordFieldWithToggleProps
> = props => {
  const {
    label,
    placeholder,
    errorMessage,
    autoComplete,
    className,
    showPasswordLabel,
    hidePasswordLabel,
    registration
  } = props;
  const inputId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("grid w-full gap-2", className)}>
      <label
        htmlFor={inputId}
        className="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <div className="relative">
        <ShadcnInput
          {...registration}
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={errorMessage ? true : undefined}
          className="border-border bg-surface text-foreground placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:ring-primary/35 h-11 pr-10"
        />
        <button
          type="button"
          className="text-text-secondary hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 transition-colors"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
      {errorMessage ? (
        <p className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default PasswordFieldWithToggle;
