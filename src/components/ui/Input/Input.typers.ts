// Input types and interfaces
import { InputHTMLAttributes } from "react";

// Component Props
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
}
