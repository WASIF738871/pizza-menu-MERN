import { transport, envConfig } from '../config/index.js';

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: envConfig.email.from,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset Password (valid for 10 min)';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${process.env.FRONTEND_BASE_URL}/api/v1/users/reset-password/${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendEmailToAdmin = async (to, seller_info) => {
  const { name, phone, email } = seller_info;

  // Email content
  const subject = 'Seller Onboarding Confirmation';
  const message = `
Hello,

We are pleased to inform you that the following seller has successfully onboarded on our platform:

Seller Name: ${name}
Seller Mobile: ${phone}
Seller Email: ${email}

Please review the seller's details and take any necessary actions.

Thank you,
Your Seller App Team
`;
  await sendEmail(to, subject, message);
};

const sendVerificationEmail = async (to, token, origin) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  // const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const verificationEmailUrl = `${process.env.FRONTEND_BASE_URL}/onboarding?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;

  await sendEmail(to, subject, text);
};

export default {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailToAdmin,
};
