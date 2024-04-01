import Joi from "joi";

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const lastName = Joi.string();
const phoneNumber1 = Joi.number();
const phoneNumber2 = Joi.number();
const userId = Joi.number().integer();
const city = Joi.string();
const neighborhood = Joi.string();
const address = Joi.string();
const biography = Joi.string();

//user
const email = Joi.string().email({ tlds: { allow: false } });
const password = Joi.string().min(8).alphanum().messages({
  'string.empty': 'La contraseña no puede estar vacía',
  'string.pattern.base': 'La contraseña debe contener entre 3 y 30 caracteres alfanuméricos',
  'any.required': 'La contraseña es un campo requerido'
})

//

export const getCustomerSchema = Joi.object({
  id: id.required(),
});

export  const createCustomerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phoneNumber1: phoneNumber1.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required(),
  }),
});

export  const updateCustomerSchema = Joi.object({
  name,
  lastName,
  phoneNumber1,
  phoneNumber2,
  userId,
  city,
  neighborhood,
  address,
  biography,
});

