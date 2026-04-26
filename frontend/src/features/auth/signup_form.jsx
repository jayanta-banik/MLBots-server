import { useEffect, useRef, useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Alert, Box, Button, IconButton, InputAdornment, LinearProgress, Stack, TextField, Typography } from '@mui/material';

import { check_username_availability } from './auth_thunks.js';
import { getPasswordAssessment, validateDateOfBirth, validateEmail, validateFirstName, validateLastName, validateUsername } from './signup_validation.js';

const INITIAL_FORM_VALUES = {
  dateOfBirth: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  username: '',
};

const EMPTY_USERNAME_AVAILABILITY = {
  message: '',
  status: 'idle',
};

function getUsernameAvailabilityState(username, rawUsernameError, usernameAvailability) {
  if (!username) {
    return EMPTY_USERNAME_AVAILABILITY;
  }

  if (rawUsernameError) {
    return {
      message: rawUsernameError,
      status: 'invalid',
    };
  }

  return usernameAvailability;
}

function getUsernameAvailabilityColor(status) {
  if (status === 'available') {
    return 'success.main';
  }

  if (status === 'checking') {
    return 'secondary.main';
  }

  return 'error.main';
}

function getFieldError(value, hasAttemptedSubmit, validator) {
  if (!hasAttemptedSubmit && value.length === 0) {
    return '';
  }

  return validator(value);
}

function getSignupFormState({ formValues, hasAttemptedSubmit, isSubmitting, passwordAssessment, usernameAvailability }) {
  const fieldErrors = {
    firstName: getFieldError(formValues.firstName, hasAttemptedSubmit, validateFirstName),
    lastName: getFieldError(formValues.lastName, hasAttemptedSubmit, validateLastName),
    dateOfBirth: getFieldError(formValues.dateOfBirth, hasAttemptedSubmit, validateDateOfBirth),
    email: getFieldError(formValues.email, hasAttemptedSubmit, validateEmail),
    username: getFieldError(formValues.username, hasAttemptedSubmit, validateUsername),
  };
  const hasEmptyRequiredField = Object.values(formValues).some((value) => !value.trim());
  const hasFieldError = Object.values(fieldErrors).some(Boolean);
  const isPasswordInvalid = !passwordAssessment.meetsPolicy;
  const isUsernameUnavailable = ['checking', 'taken', 'error', 'invalid'].includes(usernameAvailability.status);

  return {
    fieldErrors,
    isSubmitDisabled: isSubmitting || hasEmptyRequiredField || hasFieldError || isPasswordInvalid || isUsernameUnavailable,
    shouldShowPasswordFeedback: hasAttemptedSubmit || formValues.password.length > 0,
  };
}

function PasswordSection({ formValues, isPasswordVisible, onPasswordChange, onTogglePasswordVisibility, passwordAssessment, shouldShowPasswordFeedback }) {
  const passwordStrengthColor = passwordAssessment.label === 'Strong' ? 'success.main' : passwordAssessment.label === 'Moderate' ? 'warning.main' : 'error.main';
  const passwordStrengthMeterColor = passwordAssessment.label === 'Strong' ? 'success' : passwordAssessment.label === 'Moderate' ? 'warning' : 'error';

  return (
    <Stack spacing={1}>
      <TextField
        required
        label="Password"
        type={isPasswordVisible ? 'text' : 'password'}
        value={formValues.password}
        error={shouldShowPasswordFeedback && passwordAssessment.errors.length > 0}
        helperText={passwordAssessment.errors[0] || 'No spaces. Allowed symbols: @ # .'}
        onChange={(event) => onPasswordChange(event.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label={isPasswordVisible ? 'Hide password' : 'Show password'} edge="end" onClick={onTogglePasswordVisibility}>
                  {isPasswordVisible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          Password strength
        </Typography>
        <Typography variant="caption" sx={{ color: passwordStrengthColor, fontWeight: 700 }}>
          {formValues.password ? `${passwordAssessment.label} (${passwordAssessment.score}%)` : 'Start typing'}
        </Typography>
      </Stack>

      <LinearProgress variant="determinate" value={formValues.password ? passwordAssessment.score : 0} color={passwordStrengthMeterColor} sx={{ height: 10, borderRadius: 999 }} />

      {shouldShowPasswordFeedback ? (
        <Box
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 0.65,
            px: 1.5,
            py: 1.25,
            backgroundColor: 'background.default',
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mb: 0.6 }}>
            Password rules
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: passwordAssessment.checks.minLength ? 'success.main' : 'text.secondary' }}>
            At least 5 characters
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: passwordAssessment.checks.hasUppercase ? 'success.main' : 'text.secondary' }}>
            At least one uppercase letter
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: passwordAssessment.checks.hasLowercase ? 'success.main' : 'text.secondary' }}>
            At least one lowercase letter
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: passwordAssessment.checks.hasSpecialSymbol ? 'success.main' : 'text.secondary' }}>
            One of these symbols: @ # .
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: passwordAssessment.checks.hasAllowedCharactersOnly && passwordAssessment.checks.hasNoWhitespace ? 'success.main' : 'text.secondary' }}
          >
            No whitespace and no other special characters
          </Typography>
        </Box>
      ) : null}

      {passwordAssessment.penalties.length > 0 ? <Alert severity="warning">{passwordAssessment.penalties.join(' ')}</Alert> : null}
    </Stack>
  );
}

function useUsernameAvailability(username) {
  const [usernameAvailability, setUsernameAvailability] = useState(EMPTY_USERNAME_AVAILABILITY);
  const requestSequence = useRef(0);
  const rawUsernameError = validateUsername(username);

  useEffect(() => {
    if (!username || rawUsernameError) {
      return undefined;
    }

    const nextRequestId = requestSequence.current + 1;
    requestSequence.current = nextRequestId;
    let isActive = true;

    check_username_availability(username)
      .then((result) => {
        if (!isActive || requestSequence.current !== nextRequestId) {
          return;
        }

        setUsernameAvailability({
          message: result.available ? 'Username is available.' : 'That username is already taken.',
          status: result.available ? 'available' : 'taken',
        });
      })
      .catch((error) => {
        if (!isActive || requestSequence.current !== nextRequestId) {
          return;
        }

        setUsernameAvailability({
          message: error.response?.data?.message ?? 'Unable to verify that username right now.',
          status: 'error',
        });
      });

    return () => {
      isActive = false;
    };
  }, [username, rawUsernameError]);

  function updateUsernameAvailability(nextUsername) {
    const nextUsernameError = validateUsername(nextUsername);

    if (!nextUsername) {
      setUsernameAvailability(EMPTY_USERNAME_AVAILABILITY);
      return;
    }

    if (nextUsernameError) {
      setUsernameAvailability({
        message: nextUsernameError,
        status: 'invalid',
      });
      return;
    }

    setUsernameAvailability({
      message: 'Checking username availability...',
      status: 'checking',
    });
  }

  return {
    rawUsernameError,
    updateUsernameAvailability,
    usernameAvailability,
  };
}

function SignupForm({ isSubmitting, onSubmit }) {
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { rawUsernameError, updateUsernameAvailability, usernameAvailability } = useUsernameAvailability(formValues.username);
  const passwordAssessment = getPasswordAssessment(formValues);
  const derivedUsernameAvailability = getUsernameAvailabilityState(formValues.username, rawUsernameError, usernameAvailability);
  const { fieldErrors, isSubmitDisabled, shouldShowPasswordFeedback } = getSignupFormState({
    formValues,
    hasAttemptedSubmit,
    isSubmitting,
    passwordAssessment,
    usernameAvailability: derivedUsernameAvailability,
  });
  const usernameColor = getUsernameAvailabilityColor(derivedUsernameAvailability.status);

  function updateField(fieldName, value) {
    setFormValues((current) => ({
      ...current,
      [fieldName]: value,
    }));
  }

  function handleUsernameChange(value) {
    updateUsernameAvailability(value);
    updateField('username', value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isSubmitDisabled) {
      onSubmit(formValues);
    }
  }

  return (
    <Stack component="form" spacing={1.5} sx={{ mt: 1 }} onSubmit={handleSubmit}>
      <TextField
        required
        label="First name"
        value={formValues.firstName}
        error={Boolean(fieldErrors.firstName)}
        helperText={fieldErrors.firstName}
        onChange={(event) => updateField('firstName', event.target.value)}
      />
      <TextField
        required
        label="Last name"
        value={formValues.lastName}
        error={Boolean(fieldErrors.lastName)}
        helperText={fieldErrors.lastName}
        onChange={(event) => updateField('lastName', event.target.value)}
      />
      <TextField
        required
        label="Date of birth"
        type="date"
        value={formValues.dateOfBirth}
        error={Boolean(fieldErrors.dateOfBirth)}
        helperText={fieldErrors.dateOfBirth}
        onChange={(event) => updateField('dateOfBirth', event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        required
        label="Email"
        type="email"
        value={formValues.email}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email}
        onChange={(event) => updateField('email', event.target.value)}
      />
      <TextField
        required
        label="Username"
        value={formValues.username}
        error={Boolean(fieldErrors.username) || ['taken', 'error', 'invalid'].includes(derivedUsernameAvailability.status)}
        helperText={''}
        onChange={(event) => handleUsernameChange(event.target.value)}
      />
      <Typography variant="caption" sx={{ color: usernameColor, mt: -1 }}>
        {derivedUsernameAvailability.message || 'Choose a unique username.'}
      </Typography>
      <PasswordSection
        formValues={formValues}
        isPasswordVisible={isPasswordVisible}
        onPasswordChange={(value) => updateField('password', value)}
        onTogglePasswordVisibility={() => setIsPasswordVisible((current) => !current)}
        passwordAssessment={passwordAssessment}
        shouldShowPasswordFeedback={shouldShowPasswordFeedback}
      />

      {hasAttemptedSubmit && isSubmitDisabled ? <Alert severity="error">Fix the highlighted signup fields before creating the account.</Alert> : null}

      <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </Button>
    </Stack>
  );
}

export default SignupForm;
