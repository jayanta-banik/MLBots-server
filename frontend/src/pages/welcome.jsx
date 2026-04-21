import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Chip, Container, Stack, Tab, Tabs, Typography } from '@mui/material';

import StatusPanel from '../components/status_panel.jsx';
import SurfaceCard from '../components/surface_card.jsx';
import { select_auth_error, select_auth_status } from '../features/auth/auth_selectors.js';
import { login, signup } from '../features/auth/auth_thunks.js';
import LoginForm from '../features/auth/login_form.jsx';
import SignupForm from '../features/auth/signup_form.jsx';
import { fetch_service_statuses } from '../utils/api_client.js';

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

function WelcomePage() {
  const dispatch = useDispatch();
  const authError = useSelector(select_auth_error);
  const authStatus = useSelector(select_auth_status);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const isSubmitting = authStatus === 'submitting';

  const loadServices = useCallback(async () => {
    setIsLoading(true);

    const nextServices = await fetch_service_statuses();

    setServices(nextServices);
    setLastUpdatedAt(moment().format('hh:mm A'));
    setLoadError(nextServices.some((service) => service.reachable) ? '' : 'All monitored services are currently unavailable. Retry when the endpoints are reachable again.');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadServicesSafely = async () => {
      const nextServices = await fetch_service_statuses();

      if (!isMounted) {
        return;
      }

      setServices(nextServices);
      setLastUpdatedAt(moment().format('hh:mm A'));
      setLoadError(nextServices.some((service) => service.reachable) ? '' : 'All monitored services are currently unavailable. Retry when the endpoints are reachable again.');
      setIsLoading(false);
    };

    loadServicesSafely();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
              <Stack spacing={2.5} sx={{ flex: 1 }}>
                <Chip label="Monorepo service layout" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '2.9rem', md: '4.8rem' }, maxWidth: '11ch' }}>
                  MLBots control surface
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '66ch', lineHeight: 1.8 }}>
                  A professional overview for the repo layers that keeps the interface calm, readable, and operationally clear while the health probes update in place.
                </Typography>
              </Stack>

              <SurfaceCard tone="primary" delay={0.06} sx={{ minWidth: { lg: 360 }, width: '100%', maxWidth: 420 }} contentSx={{ p: { xs: 2.25, md: 2.75 } }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="overline" color="primary.main">
                      Account access
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.65rem', md: '1.9rem' }, mt: 0.6 }}>
                      Start with login or signup
                    </Typography>
                  </Box>

                  <Tabs value={activeTab} onChange={(_event, nextValue) => setActiveTab(nextValue)}>
                    <Tab label="Log in" value="login" />
                    <Tab label="Sign up" value="signup" />
                  </Tabs>

                  {authError ? <Alert severity="error">{authError}</Alert> : null}

                  {activeTab === 'login' ? (
                    <LoginForm
                      isSubmitting={isSubmitting}
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
                </Stack>
              </SurfaceCard>
            </Stack>
          </Stack>
        </SurfaceCard>

        <SurfaceCard delay={0.08}>
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

        <StatusPanel services={services} isLoading={isLoading} lastUpdatedAt={lastUpdatedAt} loadError={loadError} onRetry={loadServices} />
      </Stack>
    </Container>
  );
}

export default WelcomePage;
