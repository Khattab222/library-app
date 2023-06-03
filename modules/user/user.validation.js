import Joi from "joi";

export const signupValidation = {
  body: Joi.object()
    .required()
    .keys({
      fullname: Joi.string()
        .alphanum()
        .required()
        .messages({ "string.empty": "name required" }),
      phone: Joi.number()
        .required()
        .messages({ "string.empty": "phone required" }),
      email: Joi.string()
        .required()
        .email()
        .messages({
          "string.empty": "email required",
          "string.email": "please enter valid email",
        }),
      password: Joi.string()
        .required()
        .min(4)
        .max(15)
        .messages({
          "string.empty": "password required",
          "string.min": "password must be at least 4 characters",
          "string.max": "password must be at most 15 characters",
        }),
      cpass: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .messages({ "any.only": "cpass must match password" }),
    }),
};

export const loginValidation = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string()
        .required()
        .email()
        .messages({
          "string.empty": "email required",
          "string.email": "please enter valid email",
        }),
      password: Joi.string()
        .required()
        .messages({ "string.empty": "password required" }),
    }),
};

export const  resetPasswordvalidation = {
  body: Joi.object()
  .required()
  .keys({
    password: Joi.string()
      .required()
      .messages({ "string.empty": "password required" }),
    cpass: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "cpass must match password" }),
  }, 
  
  ),
}


