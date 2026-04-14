// EmailAuthForm types and interfaces

import { loginEmailSchema, signUpEmailSchema } from "./EmailAuthForm.helpers";

import type { z } from "zod";

// Component Props
export interface EmailAuthFormProps {
  className?: string;
  context: "login" | "signUp";
}

export type EmailLoginFormSchema = z.infer<typeof loginEmailSchema>;
export type EmailSignUpFormSchema = z.infer<typeof signUpEmailSchema>;
