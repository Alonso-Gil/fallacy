// EmailAuthForm types and interfaces

// Component Props
export interface EmailAuthFormProps {
  className?: string;
  context: "login" | "signUp";
}

export interface EmailSignUpFormSchema {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface EmailLoginFormSchema {
  email: string;
  password: string;
}
