"use client";

import { Check } from "lucide-react";
import React from "react";

import { cn } from "lib/utils";
import type { PasswordRuleChecklistProps } from "./PasswordRuleChecklist.types";

const RuleRow = ({
  met,
  children
}: {
  met: boolean;
  children: React.ReactNode;
}) => (
  <li className="flex items-center gap-2">
    <span
      className={cn(
        "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
        met
          ? "border-zinc-400/55 bg-zinc-500/25 text-zinc-100"
          : "border-foreground/25 bg-foreground/6"
      )}
      aria-hidden
    >
      {met ? (
        <Check
          className="size-2.5 stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </span>
    <span
      className={cn(
        "text-xs leading-snug transition-colors",
        met ? "text-foreground" : "text-foreground/65"
      )}
    >
      {children}
    </span>
  </li>
);

const PasswordRuleChecklist: React.FC<PasswordRuleChecklistProps> = props => {
  const { rules, labels, className } = props;

  return (
    <ul
      className={cn("mb-8 list-none space-y-1.5 pl-0", className)}
      aria-live="polite"
    >
      <RuleRow met={rules.uppercase}>{labels.uppercase}</RuleRow>
      <RuleRow met={rules.lowercase}>{labels.lowercase}</RuleRow>
      <RuleRow met={rules.number}>{labels.number}</RuleRow>
      <RuleRow met={rules.special}>{labels.special}</RuleRow>
      <RuleRow met={rules.minLength}>{labels.minLength}</RuleRow>
    </ul>
  );
};

export default PasswordRuleChecklist;
