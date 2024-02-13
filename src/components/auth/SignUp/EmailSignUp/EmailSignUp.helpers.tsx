import * as yup from "yup";

import { validationRules } from "@/utils/form.utils";

const { requiredEmail, requiredString } = validationRules;

export const getOtpEmailSchema = () => {
  return yup.object().shape({
    email: requiredEmail.trim(),
    password: requiredString,
  });
};
