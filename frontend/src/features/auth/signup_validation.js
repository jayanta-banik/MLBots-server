const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9]+$/;
const PASSWORD_ALLOWED_PATTERN = /^[A-Za-z0-9@#.]*$/;
const PASSWORD_SCORE_RULES = [
  {
    key: 'minLength',
    test: (password) => password.length >= 5,
    weight: 25,
    error: 'Use at least 5 characters.',
  },
  {
    key: 'hasUppercase',
    test: (password) => /[A-Z]/.test(password),
    weight: 15,
    error: 'Add at least one uppercase letter.',
  },
  {
    key: 'hasLowercase',
    test: (password) => /[a-z]/.test(password),
    weight: 15,
    error: 'Add at least one lowercase letter.',
  },
  {
    key: 'hasSpecialSymbol',
    test: (password) => /[@#.]/.test(password),
    weight: 20,
    error: 'Add one of these symbols: @ # .',
  },
  {
    key: 'hasAllowedCharactersOnly',
    test: (password) => PASSWORD_ALLOWED_PATTERN.test(password),
    weight: 15,
    error: 'Use only letters, numbers, and the symbols @ # .',
  },
  {
    key: 'hasNoWhitespace',
    test: (password) => !/\s/.test(password),
    weight: 10,
    error: 'Password cannot contain whitespace.',
  },
];
const PASSWORD_LABEL_RULES = [
  { minimum: 80, label: 'Strong' },
  { minimum: 55, label: 'Moderate' },
  { minimum: 1, label: 'Weak' },
];

function normalizeValue(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function passwordContains(password, candidate) {
  const normalizedCandidate = normalizeValue(candidate);

  return normalizedCandidate.length >= 2 && password.toLowerCase().includes(normalizedCandidate);
}

function getDateTokens(dateOfBirth) {
  if (!dateOfBirth) {
    return [];
  }

  const normalizedDate = String(dateOfBirth).trim();
  const year = normalizedDate.slice(0, 4);
  const compactDate = normalizedDate.replace(/-/g, '');

  return [normalizedDate, compactDate, year].filter((value, index, values) => value && values.indexOf(value) === index);
}

export function validateEmail(email) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return 'Email is required.';
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function validateFirstName(firstName) {
  if (!firstName.trim()) {
    return 'First name is required.';
  }

  return '';
}

export function validateLastName(lastName) {
  if (!lastName.trim()) {
    return 'Last name is required.';
  }

  if (/\s/.test(lastName)) {
    return 'Last name cannot contain whitespace.';
  }

  return '';
}

export function validateDateOfBirth(dateOfBirth) {
  if (!dateOfBirth) {
    return 'Date of birth is required.';
  }

  const parsedDate = new Date(`${dateOfBirth}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Enter a valid date of birth.';
  }

  if (parsedDate > new Date()) {
    return 'Date of birth must be in the past.';
  }

  return '';
}

export function validateUsername(username) {
  if (!username.trim()) {
    return 'Username is required.';
  }

  if (/\s/.test(username)) {
    return 'Username cannot contain whitespace.';
  }

  if (!USERNAME_PATTERN.test(username)) {
    return 'Username can contain only letters and numbers.';
  }

  return '';
}

export function getPasswordAssessment({ dateOfBirth, email, firstName, lastName, password, username }) {
  const checks = Object.fromEntries(PASSWORD_SCORE_RULES.map((rule) => [rule.key, rule.test(password)]));
  const emailParts = [email, email.split('@')[0]].filter(Boolean);
  const dateTokens = getDateTokens(dateOfBirth);
  const penaltyRules = [
    { matches: passwordContains(password, firstName), message: 'Contains your first name.' },
    { matches: passwordContains(password, lastName), message: 'Contains your last name.' },
    { matches: passwordContains(password, username), message: 'Contains your username.' },
    { matches: emailParts.some((value) => passwordContains(password, value)), message: 'Contains your email address.' },
    { matches: dateTokens.some((value) => passwordContains(password, value)), message: 'Contains your date of birth or birth year.' },
  ];
  const penalties = penaltyRules.filter((rule) => rule.matches).map((rule) => rule.message);

  const baseScore = PASSWORD_SCORE_RULES.reduce((total, rule) => total + (checks[rule.key] ? rule.weight : 0), 0);
  const score = Math.max(0, Math.min(100, baseScore - penalties.length * 15));
  const label = PASSWORD_LABEL_RULES.find((rule) => score >= rule.minimum)?.label ?? 'Too weak';

  const meetsPolicy = Object.values(checks).every(Boolean);
  const errors = PASSWORD_SCORE_RULES.filter((rule) => !checks[rule.key]).map((rule) => rule.error);

  return {
    checks,
    errors,
    label,
    meetsPolicy,
    penalties,
    score,
  };
}
