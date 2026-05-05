import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Alert, Button, Container, Skeleton, Stack } from '@mui/material';

import { select_auth_error, select_auth_status, select_auth_token, select_auth_user, select_is_authenticated } from './features/auth/auth_selectors.js';
import { clear_auth_error, logout, session_expired } from './features/auth/auth_slice.js';
import { bootstrap_auth } from './features/auth/auth_thunks.js';
import AboutPage from './pages/about.jsx';
import HomePage from './pages/home.jsx';
import PortfolioPage from './pages/portfolio.jsx';
import WelcomePage from './pages/welcome.jsx';
import './styles/app.css';
import { get_auth_token_expiry } from './utils/authStorage.js';

function AuthShell() {
  const dispatch = useDispatch();
  const authError = useSelector(select_auth_error);
  const authStatus = useSelector(select_auth_status);
  const authToken = useSelector(select_auth_token);
  const isAuthenticated = useSelector(select_is_authenticated);
  const authUser = useSelector(select_auth_user);

  useEffect(() => {
    if (authStatus === 'idle') {
      dispatch(bootstrap_auth());
    }
  }, [authStatus, dispatch]);

  useEffect(() => {
    if (!authToken) {
      return undefined;
    }

    const expiryAt = get_auth_token_expiry(authToken);
    const remainingDuration = expiryAt - Date.now();

    if (remainingDuration <= 0) {
      dispatch(session_expired());
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(session_expired());
    }, remainingDuration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [authToken, dispatch]);

  if (authStatus === 'idle' || authStatus === 'loading') {
    return (
      <Container maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 } }}>
        <Stack spacing={2.5}>
          <Skeleton variant="rounded" height={180} />
          <Skeleton variant="rounded" height={240} />
        </Stack>
      </Container>
    );
  }

  return (
    <Stack spacing={2.5}>
      {authError ? (
        <Container maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}>
          <Alert
            severity="error"
            action={
              <Button variant="text" color="secondary" onClick={() => dispatch(clear_auth_error())}>
                Dismiss
              </Button>
            }
          >
            {authError}
          </Alert>
        </Container>
      ) : null}

      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/welcome'} replace />} />
        <Route path="/welcome" element={isAuthenticated ? <Navigate to="/home" replace /> : <WelcomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/home" element={isAuthenticated ? <HomePage user={authUser} onLogout={() => dispatch(logout())} /> : <Navigate to="/welcome" replace />} />
      </Routes>
    </Stack>
  );
}

function App() {
  return <AuthShell />;
}

export default App;
