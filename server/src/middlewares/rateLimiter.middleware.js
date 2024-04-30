import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';

const rateLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  statusCode: httpStatus.TOO_MANY_REQUESTS,
  message: {
    message: 'Too many request from this ip. Please try again later after an hour!',
  },
  // skipSuccessfulRequests: true,
});

export default rateLimiter;
