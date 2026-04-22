import type { PasswordRulesState } from "../EmailAuthForm.utils";

export interface PasswordRuleChecklistProps {
  rules: PasswordRulesState;
  labels: {
    uppercase: string;
    lowercase: string;
    number: string;
    special: string;
    minLength: string;
  };
  className?: string;
}
