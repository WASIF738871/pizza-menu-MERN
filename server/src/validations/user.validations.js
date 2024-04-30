import Joi from 'joi';

const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(15),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
    profileImage: Joi.string(),
    isEmailVerified: Joi.boolean(),
    changedPasswordAt: Joi.date(),
    role: Joi.string().valid('user', 'guide', 'lead-guide', 'admin'),
  }),
};

const userLogin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(15),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().min(8).max(15),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  }),
};

const updateMyPassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required().min(8).max(15),
    password: Joi.string().required().min(8).max(15),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  }),
};

const updateMe = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    confirmPassword: Joi.string(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(15),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .label('Confirm password')
      .options({ messages: { 'any.only': '{{#label}} does not match' } }),
    profileImage: Joi.string(),
    isEmailVerified: Joi.boolean(),
    changedPasswordAt: Joi.date(),
  }),
};

export default { createUser, updateUser, userLogin, forgotPassword, resetPassword, updateMyPassword, updateMe };
