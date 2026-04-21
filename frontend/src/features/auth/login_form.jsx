import { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';

function LoginForm({ isSubmitting, onSubmit }) {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  return (
    <Stack
      component="form"
      spacing={1.5}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(formValues);
      }}
    >
      <TextField required label="Email" type="email" value={formValues.email} onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))} />
      <TextField required label="Password" type="password" value={formValues.password} onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))} />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Log in'}
      </Button>
    </Stack>
  );
}

export default LoginForm;
