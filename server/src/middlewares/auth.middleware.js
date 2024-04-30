import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import { ApiError, catchAsync, convertIntoJavascriptObject } from '../utils/index.js';
import { envConfig, logger } from '../config/index.js';
import { userServices } from '../services/index.js';

const verifyTokenPromise = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, envConfig.jwt.secret, (err, decoded) => {
      if (err) {
        reject(new ApiError(httpStatus.UNAUTHORIZED, err.message));
      }
      resolve(decoded);
    });
  });
};

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it is there
  let token = req.headers.authorization;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not logged in! Please login to access.');
  }
  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1];
  }
  // 2) Token Verification
  const decoded = await verifyTokenPromise(token);
  // 3) Check if User still exists
  const user = await userServices.retrieveUser(decoded.sub);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'The user belonging to this token no longer exists.');
  }
  // 4) If user changed password ater issued token
  if (user.changePasswordAfterTokenIssued(decoded.iat)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You had recently changed the password. Please login again.');
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = convertIntoJavascriptObject(user);
  next();
});

const restrictTo = (...roles) =>
  catchAsync((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action!');
    }
    next();
  });

export default { protect, restrictTo };
