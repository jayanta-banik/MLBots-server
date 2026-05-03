const AUTH_TOKEN_KEY = 'mlbots.auth.token';
const AUTH_TOKEN_EXPIRY_KEY = 'mlbots.auth.token.expiry';
const AUTH_USER_KEY = 'mlbots.auth.user';
const SESSION_AUTH_TOKEN_KEY = 'mlbots.auth.session.token';
const SESSION_AUTH_TOKEN_EXPIRY_KEY = 'mlbots.auth.session.token.expiry';
const SESSION_AUTH_USER_KEY = 'mlbots.auth.session.user';
const LEGACY_SESSION_AUTH_TOKEN_KEY = 'wrongToken';
const REMEMBER_LOGIN_KEY = 'mlbots.auth.remember';
const TOKEN_CACHE_DURATION_MS = 2 * 24 * 60 * 60 * 1000;

function can_use_browser_storage() {
  return typeof window !== 'undefined';
}

function safe_parse_user(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalize_expiry_value(value) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function decode_token_payload(token) {
  if (!token) {
    return null;
  }

  const tokenSegments = token.split('.');

  if (tokenSegments.length < 2) {
    return null;
  }

  try {
    const normalizedPayload = tokenSegments[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decodedPayload = globalThis.atob(paddedPayload);

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function get_auth_token_expiry(token) {
  const payload = decode_token_payload(token);

  if (payload?.exp) {
    return Number(payload.exp) * 1000;
  }

  return Date.now() + TOKEN_CACHE_DURATION_MS;
}

function is_expired(expiryAt) {
  return typeof expiryAt === 'number' && Date.now() >= expiryAt;
}

export function get_remember_login_preference() {
  if (!can_use_browser_storage()) {
    return true;
  }

  if (window.localStorage.getItem(REMEMBER_LOGIN_KEY) === 'true') {
    return true;
  }

  return Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY));
}

export function persist_auth_token(token, { remember = get_remember_login_preference() } = {}) {
  if (!can_use_browser_storage()) {
    return;
  }

  if (!token) {
    clear_auth_token();
    return;
  }

  const expiryAt = get_auth_token_expiry(token);

  window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, token);
  window.sessionStorage.setItem(SESSION_AUTH_TOKEN_EXPIRY_KEY, String(expiryAt));
  window.sessionStorage.removeItem(LEGACY_SESSION_AUTH_TOKEN_KEY);

  if (remember) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, String(expiryAt));
    window.localStorage.setItem(REMEMBER_LOGIN_KEY, 'true');
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
  window.localStorage.removeItem(REMEMBER_LOGIN_KEY);
}

export function persist_auth_user(user, { remember = get_remember_login_preference() } = {}) {
  if (!can_use_browser_storage()) {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_USER_KEY);
    window.sessionStorage.removeItem(SESSION_AUTH_USER_KEY);
    return;
  }

  const serializedUser = JSON.stringify(user);

  window.sessionStorage.setItem(SESSION_AUTH_USER_KEY, serializedUser);

  if (remember) {
    window.localStorage.setItem(AUTH_USER_KEY, serializedUser);
    return;
  }

  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function persist_auth_session({ token, user }, { remember = get_remember_login_preference() } = {}) {
  persist_auth_token(token, { remember });
  persist_auth_user(user, { remember });
}

export function clear_auth_token() {
  if (!can_use_browser_storage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(REMEMBER_LOGIN_KEY);
  window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_EXPIRY_KEY);
  window.sessionStorage.removeItem(SESSION_AUTH_USER_KEY);
  window.sessionStorage.removeItem(LEGACY_SESSION_AUTH_TOKEN_KEY);
}

export function get_persisted_auth_token() {
  if (!can_use_browser_storage()) {
    return null;
  }

  const sessionToken = window.sessionStorage.getItem(SESSION_AUTH_TOKEN_KEY);
  const sessionExpiry = normalize_expiry_value(window.sessionStorage.getItem(SESSION_AUTH_TOKEN_EXPIRY_KEY)) ?? (sessionToken ? get_auth_token_expiry(sessionToken) : null);

  if (sessionToken) {
    if (is_expired(sessionExpiry)) {
      clear_auth_token();
      return null;
    }

    if (sessionExpiry) {
      window.sessionStorage.setItem(SESSION_AUTH_TOKEN_EXPIRY_KEY, String(sessionExpiry));
    }

    return sessionToken;
  }

  const legacySessionToken = window.sessionStorage.getItem(LEGACY_SESSION_AUTH_TOKEN_KEY);

  if (legacySessionToken) {
    const legacyExpiry = get_auth_token_expiry(legacySessionToken);

    if (is_expired(legacyExpiry)) {
      clear_auth_token();
      return null;
    }

    window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, legacySessionToken);
    window.sessionStorage.setItem(SESSION_AUTH_TOKEN_EXPIRY_KEY, String(legacyExpiry));
    window.sessionStorage.removeItem(LEGACY_SESSION_AUTH_TOKEN_KEY);
    return legacySessionToken;
  }

  const localToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const localExpiry = normalize_expiry_value(window.localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY)) ?? (localToken ? get_auth_token_expiry(localToken) : null);

  if (localToken && is_expired(localExpiry)) {
    clear_auth_token();
    return null;
  }

  if (localToken && get_remember_login_preference()) {
    window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, localToken);

    if (localExpiry) {
      window.localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, String(localExpiry));
      window.sessionStorage.setItem(SESSION_AUTH_TOKEN_EXPIRY_KEY, String(localExpiry));
    }
  }

  return get_remember_login_preference() ? localToken : null;
}

export function get_persisted_auth_user() {
  if (!can_use_browser_storage()) {
    return null;
  }

  const sessionUser = safe_parse_user(window.sessionStorage.getItem(SESSION_AUTH_USER_KEY));

  if (sessionUser) {
    return sessionUser;
  }

  if (!get_remember_login_preference()) {
    return null;
  }

  const persistedUser = safe_parse_user(window.localStorage.getItem(AUTH_USER_KEY));

  if (persistedUser) {
    window.sessionStorage.setItem(SESSION_AUTH_USER_KEY, JSON.stringify(persistedUser));
  }

  return persistedUser;
}

export function get_persisted_auth_session() {
  return {
    token: get_persisted_auth_token(),
    user: get_persisted_auth_user(),
  };
}
