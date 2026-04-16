import { z } from "zod";

export type AuthValidationMessages = {
  required: string;
  invalidEmail: string;
  minLength: (min: number) => string;
  maxLength: (max: number) => string;
};

export const createLoginEmailSchema = (msg: AuthValidationMessages) => {
  const emailSchema = z
    .string()
    .trim()
    .min(1, { message: msg.required })
    .email({ message: msg.invalidEmail })
    .min(3, { message: msg.minLength(3) })
    .max(50, { message: msg.maxLength(50) });

  const passwordSchema = z
    .string()
    .min(1, { message: msg.required })
    .min(3, { message: msg.minLength(3) })
    .max(50, { message: msg.maxLength(50) });

  return z.object({
    email: emailSchema,
    password: passwordSchema
  });
};

export type EmailFormValues = z.infer<
  ReturnType<typeof createLoginEmailSchema>
>;
