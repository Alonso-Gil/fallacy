import type {
  EmailLoginFormValues,
  EmailSignUpFormValues
} from "./EmailAuthForm.utils";

export interface EmailAuthFormProps {
  className?: string;
  context: "login" | "sign-up";
}

export type EmailLoginFormSchema = EmailLoginFormValues;
export type EmailSignUpFormSchema = EmailSignUpFormValues;
