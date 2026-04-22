import type { UseFormRegisterReturn } from "react-hook-form";

export interface PasswordFieldWithToggleProps {
  label: string;
  placeholder?: string;
  errorMessage?: string;
  autoComplete?: string;
  className?: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  registration: UseFormRegisterReturn;
}
