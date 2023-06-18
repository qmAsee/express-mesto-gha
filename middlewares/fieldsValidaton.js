const { celebrate, Joi } = require('celebrate');

const linkRegExp = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const findUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const uploadAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  updateUserValidation,
  findUserByIdValidation,
  uploadAvatarValidation,
};
