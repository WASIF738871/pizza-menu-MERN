import mongoose from 'mongoose';

import app from './app.js';
import config from './config/env.config.js';
import logger from './config/logger.config.js';

const PORT = config.PORT;

const MONGODB_URL = config.MONGOOSE.url
  .replace('<USER_NAME>', config.MONGOOSE.auth.user)
  .replace('<PASSWORD>', config.MONGOOSE.auth.password);

let server;
mongoose
  .connect(MONGODB_URL, config.MONGOOSE.options)
  .then(() => logger.info('MONGODB is Connected 😍'))
  .catch((err) => logger.error(err));

server = app.listen(PORT, () => {
  logger.info(`Express app is listening 😍 on http://localhost:${PORT}`);
});
//handling various scenarios for gracefully shutting down Node.js server

// responsible for gracefully shutting down the server
const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

//handle unhandledRejection errors
const unHandledRejectionHandler = (error) => {
  logger.info('UNHANDELED REJECTION! 💥Shutting down...........');
  // logger.error(`${error.name} (${error.message})`);
  logger.error(error);
  exitHandler();
};

//handle uncaughtException errors
const unHandledExceptionHandler = (error) => {
  logger.info('UNHANDELED EXCEPTION! 💥Shutting down...........');
  // logger.error(`${error.name} (${error.message})`);
  logger.error(error);
};

// This event listener catches unhandled promise rejections, meaning promise errors that were not caught using .catch() or try...catch, and again calls the unexpectedErrorHandler function to handle them
process.on('unhandledRejection', unHandledRejectionHandler);
// This event listener catches uncaught exceptions, meaning errors that were not handled in a try...catch block
process.on('uncaughtException', unHandledExceptionHandler);

// This event listener is triggered when the process receives a SIGTERM signal, which is a signal to terminate the process. It logs that SIGTERM was received and tries to close the server if it exists.
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECIEVED, Shutting down gracefully');
  if (server) {
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  }
});
