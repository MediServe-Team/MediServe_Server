const Joi = require('joi');

const registerValidate = (data) => {
  const accountSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(8).max(32).required(),
    confirmPassword: Joi.ref('password'),
  });

  return accountSchema.validate(data);
};

const loginValidate = (data) => {
  const accountSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(32).required(),
  });

  return accountSchema.validate(data);
};

module.exports = {
  registerValidate,
  loginValidate,
};
