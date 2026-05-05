import { useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, Button, Checkbox, Divider, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { get_remember_login_preference } from '../../utils/authStorage.js';

function GoogleMark() {
  return (
    <Box component="span" aria-hidden="true" sx={{ display: 'inline-flex', height: 18, width: 18, flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <path d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.796 2.7164v2.2582h2.9087c1.7018-1.5668 2.6837-3.8741 2.6837-6.6155z" fill="#4285F4" />
        <path
          d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1791l-2.9087-2.2582c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5827-5.0364-3.7091H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
          fill="#34A853"
        />
        <path d="M3.9636 10.7127C3.7832 10.1727 3.6818 9.5959 3.6818 9s.1014-1.1727.2818-1.7127V4.9555H.9573C.3477 6.1705 0 7.5482 0 9s.3477 2.8295.9573 4.0445l3.0063-2.3318z" fill="#FBBC05" />
        <path
          d="M9 3.5782c1.3214 0 2.5077.4541 3.4405 1.3459l2.5804-2.5805C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9555l3.0063 2.3318C4.6718 5.1609 6.6559 3.5782 9 3.5782z"
          fill="#EA4335"
        />
      </svg>
    </Box>
  );
}

function LoginForm({ isSubmitting, onForgotPassword, onGoogleSignIn, onSubmit }) {
  const [formValues, setFormValues] = useState({
    identifier: '',
    password: '',
    rememberMe: get_remember_login_preference(),
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack
      component="form"
      spacing={1.5}
      sx={{ mt: 2 }}
      onSubmit={(event) => {
        event.preventDefault();

        if (isSubmitting) {
          return;
        }

        onSubmit(formValues);
      }}
    >
      <TextField
        required
        disabled={isSubmitting}
        label="Email or username"
        value={formValues.identifier}
        onChange={(event) => setFormValues((current) => ({ ...current, identifier: event.target.value }))}
      />
      <TextField
        required
        disabled={isSubmitting}
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formValues.password}
        onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" disabled={isSubmitting} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControlLabel
        control={<Checkbox checked={formValues.rememberMe} disabled={isSubmitting} onChange={(event) => setFormValues((current) => ({ ...current, rememberMe: event.target.checked }))} />}
        label="Keep me logged in"
        sx={{ alignSelf: 'flex-start', mt: -0.25 }}
      />

      <Box
        component="button"
        type="button"
        disabled={isSubmitting}
        onClick={onForgotPassword}
        sx={{
          alignSelf: 'flex-start',
          border: 0,
          p: 0,
          background: 'transparent',
          color: 'secondary.main',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          font: 'inherit',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: isSubmitting ? 'none' : 'underline',
          },
          '&:disabled': {
            opacity: 0.62,
          },
        }}
      >
        Forgot password?
      </Box>
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Log in'}
      </Button>

      <Stack spacing={1.25} sx={{ pt: 0.5 }}>
        <Divider>
          <Typography variant="caption" color="text.secondary" sx={{ px: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Or continue with
          </Typography>
        </Divider>

        <Box
          component="button"
          type="button"
          onClick={onGoogleSignIn}
          disabled={isSubmitting}
          aria-label="Sign in with Google"
          sx={{
            width: '100%',
            minHeight: 40,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: '20px',
            border: '1px solid #dadce0',
            backgroundColor: '#ffffff',
            color: '#3c4043',
            boxShadow: '0 1px 2px rgba(60, 64, 67, 0.2)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'Roboto, Arial, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.43,
            transition: 'background-color 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
            '&:hover': {
              backgroundColor: isSubmitting ? '#ffffff' : '#f8f9fa',
              boxShadow: isSubmitting ? '0 1px 2px rgba(60, 64, 67, 0.2)' : '0 1px 3px rgba(60, 64, 67, 0.3)',
            },
            '&:focus-visible': {
              outline: '3px solid rgba(26, 115, 232, 0.28)',
              outlineOffset: 2,
            },
            '&:disabled': {
              opacity: 0.62,
            },
          }}
        >
          <GoogleMark />
          <Box component="span">Sign in with Google</Box>
        </Box>
      </Stack>
    </Stack>
  );
}
export default LoginForm;
