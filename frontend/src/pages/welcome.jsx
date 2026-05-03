import { motion } from 'framer-motion';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Link, Stack, Tab, Tabs, Typography } from '@mui/material';

import StatusPanel from '../components/status_panel.jsx';
import SurfaceCard from '../components/surface_card.jsx';
import { select_auth_error, select_auth_status } from '../features/auth/auth_selectors.js';
import { bootstrap_auth, login, persist_auth_token, signup } from '../features/auth/auth_thunks.js';
import LoginForm from '../features/auth/login_form.jsx';
import SignupForm from '../features/auth/signup_form.jsx';
import { select_service_statuses, select_services_error, select_services_loading, select_services_updated_at } from '../features/status/status_selectors.js';
import { fetch_service_statuses } from '../features/status/status_thunks.js';
import { API_URL } from '../utils/apiClient.js';

const LAYER_ITEMS = [
  {
    name: 'Root repo layer',
    path: '/',
    summary: 'Owns deployment entrypoints, CI workflow files, shared static assets, and Raspberry Pi level server configuration.',
  },
  {
    name: 'Frontend layer',
    path: 'frontend',
    summary: 'Contains the Vite + React application and compiles into the root static folder for serving.',
  },
  {
    name: 'Node layer',
    path: 'node_backend',
    summary: 'Handles Express ESM APIs through routes, services, models, middleware, and utility helpers.',
  },
  {
    name: 'Python layer',
    path: 'python_backend',
    summary: 'Handles FastAPI endpoints and keeps the existing Python-side storage, templates, and legacy support folders together.',
  },
];

const WHAT_WE_ARE_ITEMS = [
  {
    label: 'Platform',
    title: 'A unified MLBots stack',
    summary: 'MLBots brings the public site, authenticated user access, APIs, and service visibility together in one connected product surface.',
  },
  {
    label: 'Deployment',
    title: 'Built for live operations',
    summary: 'The project is structured around frontend, Node, and Python layers so it can run as a practical service instead of a demo-only app.',
  },
  {
    label: 'Purpose',
    title: 'Focused on usable workflows',
    summary: 'Account access, service health, and product structure are presented clearly so users and operators can move through the system without guesswork.',
  },
];

function LoginProgressOverlay() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        backgroundColor: 'rgba(247, 244, 236, 0.78)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <SurfaceCard tone="secondary" delay={0} sx={{ width: '100%', maxWidth: 360 }}>
        <Stack spacing={2.25} alignItems="center" textAlign="center">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                component={motion.span}
                animate={{ opacity: [0.42, 1, 0.42], scale: [1, 1.15, 1], y: [0, -8, 0] }}
                transition={{ duration: 0.72, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === 1 ? 'secondary.main' : 'primary.main',
                }}
              />
            ))}
          </Box>

          <Box>
            <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>
              Logging you in...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.9, lineHeight: 1.7 }}>
              Please wait while we secure your session and prepare your account.
            </Typography>
          </Box>
        </Stack>
      </SurfaceCard>
    </Box>
  );
}

function WelcomePage() {
  const dispatch = useDispatch();
  const authError = useSelector(select_auth_error);
  const authStatus = useSelector(select_auth_status);
  const services = useSelector(select_service_statuses);
  const isLoading = useSelector(select_services_loading);
  const lastUpdatedAt = useSelector(select_services_updated_at);
  const loadError = useSelector(select_services_error);
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [socialAuthError] = useState(() => new URL(window.location.href).searchParams.get('authError') ?? '');

  const isSubmitting = authStatus === 'submitting';
  const isLoginSubmitting = isSubmitting && activeTab === 'login';

  useEffect(() => {
    dispatch(fetch_service_statuses());
  }, [dispatch]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const authToken = currentUrl.searchParams.get('authToken');
    const authErrorMessage = currentUrl.searchParams.get('authError');

    if (!authToken && !authErrorMessage) {
      return;
    }

    currentUrl.searchParams.delete('authToken');
    currentUrl.searchParams.delete('authError');
    window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);

    if (authToken) {
      persist_auth_token(authToken);
      dispatch(bootstrap_auth());
    }
  }, [dispatch]);

  return (
    <Container maxWidth={false} disableGutters aria-busy={isLoginSubmitting} sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
              <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
                <Chip label="Monorepo service layout" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '2.45rem', sm: '2.9rem', md: '4.8rem' }, maxWidth: '11ch', overflowWrap: 'anywhere' }}>
                  MLBots control surface
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '66ch', lineHeight: 1.8 }}>
                  A professional overview for the repo layers that keeps the interface calm, readable, and operationally clear while the health probes update in place.
                </Typography>
              </Stack>

              <SurfaceCard tone="primary" delay={0.06} sx={{ minWidth: 0, width: '100%', maxWidth: 420, flexShrink: 1 }} contentSx={{ p: { xs: 2.25, md: 2.75 }, minWidth: 0 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="overline" color="primary.main">
                      Account access
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.65rem', md: '1.9rem' }, mt: 0.6 }}>
                      Start with login or signup
                    </Typography>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(_event, nextValue) => {
                      if (isSubmitting) {
                        return;
                      }

                      setActiveTab(nextValue);
                    }}
                    variant="fullWidth"
                    sx={{ minWidth: 0 }}
                  >
                    <Tab label="Log in" value="login" disabled={isSubmitting} />
                    <Tab label="Sign up" value="signup" disabled={isSubmitting} />
                  </Tabs>

                  <Box component={motion.div} layout transition={{ duration: 0.15 }} sx={{ overflow: 'hidden' }}>
                    {authError || socialAuthError ? <Alert severity="error">{authError || socialAuthError}</Alert> : null}

                    {activeTab === 'login' ? (
                      <LoginForm
                        isSubmitting={isSubmitting}
                        onForgotPassword={() => setIsForgotPasswordOpen(true)}
                        onGoogleSignIn={() => {
                          const returnTo = `${window.location.origin}/welcome`;
                          window.location.assign(`${API_URL}/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
                        }}
                        onSubmit={(payload) => {
                          dispatch(login(payload));
                        }}
                      />
                    ) : (
                      <SignupForm
                        isSubmitting={isSubmitting}
                        onSubmit={(payload) => {
                          dispatch(signup(payload));
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </SurfaceCard>
            </Stack>
          </Stack>
        </SurfaceCard>

        <Dialog open={isForgotPasswordOpen} onClose={isSubmitting ? undefined : () => setIsForgotPasswordOpen(false)} fullWidth maxWidth="xs" disableEscapeKeyDown={isSubmitting}>
          <DialogTitle>Forgot password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5, lineHeight: 1.8 }}>
              Password reset is not self-service yet. Please contact an administrator to reset your account password, then return here to log in.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsForgotPasswordOpen(false)} variant="contained" color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <SurfaceCard delay={0.08} tone="secondary">
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="secondary.main">
                What we are
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mt: 0.8 }}>
                A working service platform
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.2, maxWidth: '68ch', lineHeight: 1.8 }}>
                MLBots is not just a single page or a single API. It is a connected service platform that combines the public app, authenticated account access, backend services, and operational
                monitoring.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                minWidth: 0,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              {WHAT_WE_ARE_ITEMS.map((item, index) => (
                <SurfaceCard key={item.title} tone={index === 1 ? 'secondary' : 'primary'} delay={0.1 + index * 0.04} sx={{ minHeight: '100%' }} contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Stack spacing={1.4}>
                    <Chip label={item.label} color={index === 1 ? 'secondary' : 'primary'} size="small" sx={{ alignSelf: 'flex-start' }} />
                    <Typography variant="h3" sx={{ fontSize: '1.1rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {item.summary}
                    </Typography>
                  </Stack>
                </SurfaceCard>
              ))}
            </Box>
          </Stack>
        </SurfaceCard>

        <SurfaceCard delay={0.12}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="primary.main">
                Four layers
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mt: 0.8 }}>
                Folder roles
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                minWidth: 0,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                },
              }}
            >
              {LAYER_ITEMS.map((layerItem, index) => (
                <SurfaceCard
                  key={layerItem.name}
                  tone={index % 2 === 0 ? 'primary' : 'secondary'}
                  delay={0.12 + index * 0.04}
                  sx={{ minHeight: '100%' }}
                  contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
                >
                  <Stack spacing={1.5}>
                    <Chip label={layerItem.path} color={index % 2 === 0 ? 'primary' : 'secondary'} size="small" sx={{ alignSelf: 'flex-start' }} />
                    <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
                      {layerItem.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {layerItem.summary}
                    </Typography>
                  </Stack>
                </SurfaceCard>
              ))}
            </Box>
          </Stack>
        </SurfaceCard>

        <StatusPanel
          services={services}
          isLoading={isLoading}
          lastUpdatedAt={lastUpdatedAt ? moment(lastUpdatedAt).format('hh:mm A') : ''}
          loadError={loadError}
          onRetry={() => dispatch(fetch_service_statuses())}
        />

        <Box component="footer" sx={{ px: { xs: 0.5, md: 1 }, pb: { xs: 0.5, md: 1 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-end', md: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <Link href="https://resources.mlbots.in/public/policy.html" target="_blank" rel="noreferrer" underline="hover" color="secondary.main" sx={{ fontWeight: 600 }}>
                Privacy Policy
              </Link>
              {' | '}
              Copyright {new Date().getFullYear()} MLBots. All rights reserved.
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {isLoginSubmitting ? <LoginProgressOverlay /> : null}
    </Container>
  );
}

export default WelcomePage;
