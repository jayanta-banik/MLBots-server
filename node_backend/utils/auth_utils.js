import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';
import { z } from 'zod';

const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';

const signupSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
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

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString('hex');

  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedValue) {
  if (!storedValue) {
    return false;
  }

  const [salt, storedHash] = storedValue.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const computedHash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString('hex');

  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(computedHash, 'hex'));
}

export function buildUsername(email) {
  return email.split('@')[0];
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
  };
}
