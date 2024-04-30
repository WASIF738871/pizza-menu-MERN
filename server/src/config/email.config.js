import nodemailer from 'nodemailer';

import { envConfig, logger } from './index.js';

const transport = nodemailer.createTransport({
  ...envConfig.email.smtp,
  tls: {
    rejectUnauthorized: false, // Ignore certificate validation (not recommended for production)
  },
});

transport
  .verify()
  .then(() => logger.info('Email Server is Connected 😍'))
  .catch(() =>
    logger.warn('Unable to connect to email server. Make sure you have envConfigured the SMTP options in .env'),
  );

export default transport;
