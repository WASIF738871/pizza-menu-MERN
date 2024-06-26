class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.stack = '';
    if (stack) {
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
