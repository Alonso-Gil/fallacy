import * as yup from "yup";

import { validationRules } from "utils/form.utils";

const { requiredEmail, requiredString, repeatPassword } = validationRules;

export const getSignUpEmailSchema = () => {
  return yup.object().shape({
    email: requiredEmail.trim(),
    password: requiredString,
    repeatPassword: repeatPassword,
  });
};

export const getLoginEmailSchema = () => {
  return yup.object().shape({
    email: requiredEmail.trim(),
    password: requiredString,
  });
};
