import { createUser, fetchUser } from '#models/users';
import {
  createAuthToken,
  createSignupVerificationToken,
  doesOtpMatch,
  generateOtp,
  hashPassword,
  validateLoginPayload,
  verifyPassword,
  verifySignupVerificationToken,
} from '#utils/auth_utils';
import { createError } from '#utils/error_utils';

import getEmailHtml from '#services/emails/generate_email_from_template';
import sendEmail from '#services/emails/send_email';
import { activateUser } from '#services/users';

export async function signupUser(payload) {
  const { email, password, username } = payload;
  const existingEmail = await fetchUser({ email });
  const existingUsername = await fetchUser({ username });

  if (existingEmail || existingUsername) {
    return createError({ message: 'An account with that email or username already exists.', statusCode: 409 });
  }

  const user = await createUser({
    ...payload,
    passwordHash: hashPassword(password),
  });
  const otp = generateOtp();
  const verificationToken = createSignupVerificationToken({
    email: user.email,
    otp,
    userId: user.id,
  });
  const html = await getEmailHtml({
    template_name: 'OTP_EMAIL',
    variables: {
      email: user.email,
      firstName: user.first_name ?? 'there',
      otp,
    },
  });

  await sendEmail({
    html,
    subject: 'Verify your MLBots account',
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    to: user.email,
  });

  return {
    email: user.email,
    requiresVerification: true,
    verificationToken,
  };
}

export async function loginUser({ email, password, username }) {
  const parsedPayload = validateLoginPayload({ email, password, username });
  const user = await fetchUser({
    email: parsedPayload.email,
    username: parsedPayload.username,
    includePassword: true,
    is_active: true,
  });

  if (!user || !verifyPassword(parsedPayload.password, user.password)) {
    return createError({ message: 'Invalid email or password.', statusCode: 401 });
  }

  return {
    token: createAuthToken(user),
    userId: user.id,
  };
}

export async function verifySignupOtp({ otp, verificationToken }) {
  const verificationPayload = verifySignupVerificationToken(verificationToken);

  if (verificationPayload.purpose !== 'signup-verification') {
    return createError({ message: 'The verification session is invalid.', statusCode: 400 });
  }

  if (!doesOtpMatch({ otp: Number(otp), otpHash: verificationPayload.otpHash })) {
    return createError({ message: 'That verification code is incorrect.', statusCode: 400 });
  }

  const activatedUser = await activateUser({ userId: Number(verificationPayload.sub) });

  if (activatedUser instanceof Error) return activatedUser;

  return { message: 'Email verified successfully. You can log in now.' };
}

export async function checkUsernameAvailability({ username }) {
  const user = await fetchUser({ username });

  return { available: !user };
}
