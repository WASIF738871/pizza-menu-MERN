import httpStatus from 'http-status';

import { userServices, tokenServices, emailServices } from '../services/index.js';
import { pick, catchAsync, convertIntoJavascriptObject, ApiError, cryptoUtils } from '../utils/index.js';
import logger from '../config/logger.config.js';
import envConfig from '../config/env.config.js';

const createAndSendToken = catchAsync(async (user, statusCode, res) => {
  user = convertIntoJavascriptObject(user);
  const tokens = await tokenServices.generateAuthTokens(user);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
  };
  if (envConfig.NODE_ENV == 'development') cookieOptions.secure = false;
  res.cookie('jwt', tokens.access.token, cookieOptions);
  res.status(statusCode).json({ ...user, tokens });
});

const signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, changedPasswordAt, role } = req.body;
  let user = await userServices.createUser({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    changedPasswordAt,
    role,
  });
  createAndSendToken(user, httpStatus.CREATED, res);
});

const login = catchAsync(async (req, res) => {
  let user = await userServices.userLogin(req.body);
  createAndSendToken(user, httpStatus.OK, res);
});

const forgotPassword = catchAsync(async (req, res) => {
  const filter = pick(req.body, ['email']);
  // 1) Get user Based on POSTED email
  const user = await userServices.findUser(filter, 'User not found!');
  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  // 3) Send it to user's email
  try {
    emailServices.sendResetPasswordEmail(user.email, resetToken);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'There was some error sending the email. Try again later.');
  }
  res.status(httpStatus.OK).json({
    message: 'Reset password email sent successfully. Please check your mail.',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { password, confirmPassword } = req.body;
  // 1) Get user Based on token
  const hashedToken = cryptoUtils.createHash(req.params.token);
  const filter = {
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  };
  const user = await userServices.findUser(filter, 'Token is invalid or has expired!');
  // 2) If token has not Expired, and there is user set new password
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // 3) Update changePasswordAt property for the user
  // Put this logic in pre save middleware
  await user.save();
  // 4) log the user in, send JWT
  createAndSendToken(user, httpStatus.CREATED, res);
});

const updateMyPassword = catchAsync(async (req, res) => {
  const { currentPassword, password, confirmPassword } = req.body;
  // 1) Get user from collection
  const user = await userServices.retrieveUser(req.user.id);
  // 2) Check if Posted current password is correct
  if (!(await user.comparePassword(currentPassword, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your current password is wrong.');
  }
  // 3) If so, update password
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();
  // 4) log user in, send JWT
  createAndSendToken(user, httpStatus.CREATED, res);
});

export default {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateMyPassword,
};
