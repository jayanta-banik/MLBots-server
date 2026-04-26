import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';
import { z } from 'zod';

const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';

const USERNAME_PATTERN = /^[A-Za-z0-9]+$/;
const LAST_NAME_PATTERN = /^\S+$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#.])[A-Za-z0-9@#.]{5,}$/;

function parseDateOfBirth(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return Number.NaN;
  }

  const parsedDate = new Date(`${trimmedValue}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return Number.NaN;
  }

  return parsedDate;
}

const signupSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1).regex(LAST_NAME_PATTERN, 'Last name cannot contain whitespace.'),
  dateOfBirth: z.preprocess(
    parseDateOfBirth,
    z.date().max(new Date(), 'Date of birth must be in the past.'),
  ),
  username: z.string().trim().min(1).regex(USERNAME_PATTERN, 'Username can contain only letters and numbers.'),
  password: z.string().regex(PASSWORD_PATTERN, 'Password must be at least 5 characters long and include uppercase, lowercase, and one of @ # . without spaces.'),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const usernameAvailabilitySchema = z.object({
  username: z.string().trim().min(1).regex(USERNAME_PATTERN, 'Username can contain only letters and numbers.'),
});

function getAuthSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET;

  if (!secret) {
    throw new Error('AUTH_TOKEN_SECRET is required');
  }

  return secret;
}

export function validateSignupPayload(payload) {
  return signupSchema.parse(payload);
}

export function validateLoginPayload(payload) {
  return loginSchema.parse(payload);
}

export function validateUsernameAvailabilityPayload(payload) {
  return usernameAvailabilitySchema.parse(payload);
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

export function createAuthToken({ id, email, first_name }) {
  return jwt.sign({ sub: id, email, firstName: first_name ?? null }, getAuthSecret(), { expiresIn: '7d' });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getAuthSecret());
}

export function buildUserProfile(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name ?? null,
    lastName: user.last_name ?? null,
    dateOfBirth: user.dob ? user.dob.toISOString().slice(0, 10) : null,
    username: user.username,
  };
}
