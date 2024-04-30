import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';

import envConfig from '../config/env.config.js';
import { userServices } from './index.js';
import { Token } from '../models/index.js';
import { ApiError } from '../utils/index.js';
import { tokenTypes } from '../config/index.js';

const generateToken = (userId, type, expiresIn, secret = envConfig.jwt.secret) => {
  const payload = {
    sub: userId,
    // iat: moment().unix(),
    // exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const saveToken = async (token, userId, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    // expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, envConfig.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(envConfig.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, tokenTypes.ACCESS, `${envConfig.jwt.accessExpirationMinutes}m`);
  // const refreshTokenExpires = moment().add(envConfig.jwt.refreshExpirationDays, 'days');
  // const refreshToken = generateToken(user.id, tokenTypes.REFRESH, `${envConfig.jwt.accessExpirationMinutes}d`);
  // await saveToken(refreshToken, user.id, tokenTypes.REFRESH);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    // refresh: {
    //   token: refreshToken,
    //   expires: refreshTokenExpires.toDate(),
    // },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(envConfig.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (email) => {
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(envConfig.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
