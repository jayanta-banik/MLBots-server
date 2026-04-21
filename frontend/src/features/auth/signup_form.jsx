import { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';

function SignupForm({ isSubmitting, onSubmit }) {
  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
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
      <TextField required label="First name" value={formValues.firstName} onChange={(event) => setFormValues((current) => ({ ...current, firstName: event.target.value }))} />
      <TextField required label="Email" type="email" value={formValues.email} onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))} />
      <TextField required label="Password" type="password" value={formValues.password} onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))} />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </Button>
    </Stack>
  );
}

export default SignupForm;
