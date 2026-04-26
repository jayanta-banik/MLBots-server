import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { createError } from '#utils/error_utils';

const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';
const USERNAME_PATTERN = /^[A-Za-z0-9]+$/;

const loginSchema = z
  .object({
    email: z.string().trim().email().optional(),
    password: z.string().min(1, 'Password is required.'),
    username: z.string().trim().regex(USERNAME_PATTERN, 'Username can contain only letters and numbers.').optional(),
  })
  .superRefine((payload, context) => {
    if ((payload.email && payload.username) || (!payload.email && !payload.username)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide either an email or a username.',
        path: ['email'],
      });
    }
  });

function getAuthSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) throw new Error('SESSION_SECRET is required');

  return secret;
}

function getVerificationSecret() {
  return `${getAuthSecret()}:signup-verification`;
}

function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function validateLoginPayload(payload) {
  return loginSchema.parse(payload);
}

export function generateOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

export function createSignupVerificationToken({ email, otp, userId }) {
  return jwt.sign(
    {
      email,
      otpHash: hashValue(otp),
      purpose: 'signup-verification',
      sub: userId,
    },
    getVerificationSecret(),
    { expiresIn: '10m' },
  );
}

export function verifySignupVerificationToken(token) {
  return jwt.verify(token, getVerificationSecret(), { algorithms: ['HS256'] });
}

export function doesOtpMatch({ otp, otpHash }) {
  return hashValue(otp) === otpHash;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString('hex');

  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedValue) {
  if (!storedValue) return false;

  const [salt, storedHash] = storedValue.split(':');

  if (!salt || !storedHash) return false;

  const computedHash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString('hex');

  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(computedHash, 'hex'));
}

export function createAuthToken({ id, email, dob }) {
  return jwt.sign({ sub: id, email, dob: dob ? dob.toISOString().slice(0, 10) : null }, getAuthSecret(), { expiresIn: '2d' });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getAuthSecret(), { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.error('Authentication Error:', err);
      if (err.name === 'TokenExpiredError') {
        return createError({ message: 'Token expired', statusCode: 401 });
      }
      return createError({ message: 'The current session is invalid.', statusCode: 403 });
    }

    return decoded;
  });
}
