import { z } from "zod";

import { validationMessages as msg } from "utils/form.utils";

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

export const loginEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const signUpEmailSchema = loginEmailSchema;

export const getLoginEmailSchema = () => loginEmailSchema;
export const getSignUpEmailSchema = () => signUpEmailSchema;
