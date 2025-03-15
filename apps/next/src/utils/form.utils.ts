// Form utility functions
import * as yup from "yup";

export const allowedSymbols = "[<>;,:.'_@$!%*&\"¡¿?°/()=|+~{}-]";

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validationMessages = {
  required: "Campo requerido",
  invalidEmail: "Correo electrónico no válido",
  minLength: (min: number) => `El campo debe tener ${min} caracteres mínimo`,
  maxLength: (max: number) => `El campo debe tener ${max} caracteres máximo`,
  onlyNumbers: "El campo debe contener solo números",
  matchFields: "Los campos no coinciden",
  length: (len: number) => `El campo debe tener ${len} caracteres`,
  invalidPassword: "Contraseña inválida",
};

const { invalidEmail, required, maxLength, minLength } = validationMessages;
const { invalidPassword } = validationMessages;

export const validationRules = {
  requiredEmail: yup
    .string()
    .required(required)
    .email(invalidEmail)
    .min(3, minLength(3))
    .max(50, maxLength(50)),
  requiredString: yup
    .string()
    .required(required)
    .min(3, minLength(3))
    .max(50, maxLength(50)),
  password: yup
    .string()
    .required(required)
    .min(7, minLength(7))
    .max(70, maxLength(70))
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#^<>;,:.'_@$!%*&"¡¿?°/()=|+~{}-]).{7,70}$/,
      invalidPassword,
    ),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Repeat password is required"),
};
