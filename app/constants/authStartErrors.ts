import { loginErrors, registerErrors } from "../modulos/models/AuthErrors";

export const startRegisterErrors: registerErrors = {
  notEmail: false,
  emailEmpty: false,
  usernameMax: false,
  usernameMin: false,
  usernameEmpty: false,
  usernameInvalid: false,
  passwordMin: false,
  passwordMax: false,
  passwordInvalid: false,
  passwordEmpty: false,
  passwordFailed: false,
};

export const startLoginErrors: loginErrors = {
  usernameEmpty: false,
  passwordEmpty: false,
};