import type { EmailFormValues } from "./EmailAuthForm.helpers";

export interface EmailAuthFormProps {
  className?: string;
  context: "login" | "sign-up";
}

export type EmailLoginFormSchema = EmailFormValues;
export type EmailSignUpFormSchema = EmailFormValues;
