import winston from 'winston';
import config from './env.config.js';

const { NODE_ENV } = config;
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const customFormatForlog = winston.format.printf(({ level, message }) => {
  if (typeof message === 'object') {
    return `${level}: ${JSON.stringify(message, null, 4)}`;
  }

  return `${level}: ${message}`;
});
const logger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),

    NODE_ENV === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    customFormatForlog,
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

export default logger;
