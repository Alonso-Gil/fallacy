// Form utility functions

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
  invalidPassword: "Contraseña inválida"
};
