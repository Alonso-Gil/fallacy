"use client";

import { Check } from "lucide-react";
import React from "react";

import { cn } from "lib/utils";
import type { PasswordRulesState } from "../EmailAuthForm.utils";
import type { PasswordRuleChecklistProps } from "./PasswordRuleChecklist.types";

const RULE_KEYS: (keyof PasswordRulesState)[] = [
  "uppercase",
  "lowercase",
  "number",
  "special",
  "minLength"
];

const PasswordRuleChecklist: React.FC<PasswordRuleChecklistProps> = props => {
  const { rules, labels, className } = props;

  return (
    <ul
      className={cn("mb-8 list-none space-y-1.5 pl-0", className)}
      aria-live="polite"
    >
      {RULE_KEYS.map(key => {
        const isSatisfied = rules[key];

        return (
          <li key={key} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                isSatisfied
                  ? "border-zinc-400/55 bg-zinc-500/25 text-zinc-100"
                  : "border-foreground/25 bg-foreground/6"
              )}
              aria-hidden
            >
              {isSatisfied ? (
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
                isSatisfied ? "text-foreground" : "text-foreground/65"
              )}
            >
              {labels[key]}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordRuleChecklist;
