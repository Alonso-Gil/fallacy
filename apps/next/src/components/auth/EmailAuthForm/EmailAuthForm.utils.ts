import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export type AuthValidationMessages = {
  required: string;
  invalidEmail: string;
  minLength: (min: number) => string;
  maxLength: (max: number) => string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordNumber: string;
  passwordSpecial: string;
};

const buildEmailSchema = (msg: AuthValidationMessages) =>
  z
    .string()
    .trim()
    .min(1, { message: msg.required })
    .email({ message: msg.invalidEmail })
    .min(3, { message: msg.minLength(3) })
    .max(50, { message: msg.maxLength(50) });

export const createLoginEmailSchema = (msg: AuthValidationMessages) => {
  const passwordSchema = z
    .string()
    .min(1, { message: msg.required })
    .min(3, { message: msg.minLength(3) })
    .max(128, { message: msg.maxLength(128) });

  return z.object({
    email: buildEmailSchema(msg),
    password: passwordSchema
  });
};

export const createSignUpEmailSchema = (msg: AuthValidationMessages) => {
  const passwordSchema = z
    .string()
    .min(1, { message: msg.required })
    .min(8, { message: msg.minLength(8) })
    .max(128, { message: msg.maxLength(128) })
    .regex(/[a-z]/, { message: msg.passwordLowercase })
    .regex(/[A-Z]/, { message: msg.passwordUppercase })
    .regex(/\d/, { message: msg.passwordNumber })
    .regex(/[^A-Za-z0-9]/, { message: msg.passwordSpecial });

  return z.object({
    email: buildEmailSchema(msg),
    password: passwordSchema
  });
};

export type EmailLoginFormValues = z.infer<
  ReturnType<typeof createLoginEmailSchema>
>;

export type EmailSignUpFormValues = z.infer<
  ReturnType<typeof createSignUpEmailSchema>
>;

export type AuthFormErrorKey =
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "userAlreadyRegistered"
  | "signupDisabled"
  | "rateLimited"
  | "weakPassword"
  | "generic";

export const mapSupabaseAuthMessageToKey = (
  message: string | undefined
): AuthFormErrorKey => {
  if (!message?.trim()) {
    return "generic";
  }
  const m = message.toLowerCase();
  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid credentials")
  ) {
    return "invalidCredentials";
  }
  if (m.includes("email not confirmed")) {
    return "emailNotConfirmed";
  }
  if (
    m.includes("already registered") ||
    m.includes("user already registered") ||
    m.includes("email address is already registered")
  ) {
    return "userAlreadyRegistered";
  }
  if (m.includes("signup is disabled") || m.includes("sign up is disabled")) {
    return "signupDisabled";
  }
  if (
    m.includes("email rate limit exceeded") ||
    m.includes("too many requests") ||
    m.includes("rate limit") ||
    (m.includes("security purposes") && m.includes("after"))
  ) {
    return "rateLimited";
  }
  if (
    m.includes("password") &&
    (m.includes("at least") || m.includes("should be"))
  ) {
    return "weakPassword";
  }
  return "generic";
};

export type EmailLoginResult =
  | { status: "redirect" }
  | { status: "error"; errorKey: AuthFormErrorKey };

export const signInWithEmailPassword = async (
  supabase: SupabaseClient,
  email: string,
  password: string
): Promise<EmailLoginResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      status: "error",
      errorKey: mapSupabaseAuthMessageToKey(error.message)
    };
  }

  if (data.session) {
    return { status: "redirect" };
  }

  return { status: "error", errorKey: "invalidCredentials" };
};

export type EmailSignUpResult =
  | { status: "redirect" }
  | { status: "confirmEmail" }
  | { status: "error"; errorKey: AuthFormErrorKey };

export const signUpWithEmailPassword = async (
  supabase: SupabaseClient,
  email: string,
  password: string
): Promise<EmailSignUpResult> => {
  const origin = globalThis.window?.location?.origin;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: origin
      ? { emailRedirectTo: `${origin}/api/auth/confirm?next=/` }
      : undefined
  });

  if (error) {
    return {
      status: "error",
      errorKey: mapSupabaseAuthMessageToKey(error.message)
    };
  }

  if (data.session) {
    return { status: "redirect" };
  }

  return { status: "confirmEmail" };
};

export type PasswordRulesState = {
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  minLength: boolean;
};

export const evaluatePasswordRules = (value: string): PasswordRulesState => ({
  uppercase: /[A-Z]/.test(value),
  lowercase: /[a-z]/.test(value),
  number: /\d/.test(value),
  special: /[^A-Za-z0-9]/.test(value),
  minLength: value.length >= 8
});
