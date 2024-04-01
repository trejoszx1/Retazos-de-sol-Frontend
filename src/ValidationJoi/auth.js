import Joi from "joi";

export const email = Joi.string().email({ tlds: { allow: false } }),
  password = Joi.string().min(8),
  newPassword = Joi.string().min(8).max(30).messages({
    'string.empty': 'La contraseña no puede estar vacía',
    'string.pattern.base': 'La contraseña debe contener entre 8 y 30 caracteres alfanuméricos',
    'any.required': 'La contraseña es un campo requerido'
  }),
  token = Joi.string().regex(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
  );

export const loginAuthSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

export const recoveryAuthSchema = Joi.object({
  email: email.required(),
});

export const changePasswordAuthSchema = Joi.object({
  token: token.required(),
  newPassword: newPassword.required(),
});
