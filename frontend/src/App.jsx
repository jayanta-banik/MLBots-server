import { useCallback, useEffect, useState } from 'react';

import { Box, Chip, Container, Stack, Typography } from '@mui/material';
import moment from 'moment';

import StatusPanel from './components/status_panel.jsx';
import SurfaceCard from './components/surface_card.jsx';
import './styles/app.css';
import { fetch_service_statuses } from './utils/api_client.js';

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

function App() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');
  const [loadError, setLoadError] = useState('');

  const loadServices = useCallback(async () => {
    setIsLoading(true);

    const nextServices = await fetch_service_statuses();

    setServices(nextServices);
    setLastUpdatedAt(moment().format('hh:mm A'));
    setLoadError(
      nextServices.some((service) => service.reachable)
        ? ''
        : 'All monitored services are currently unavailable. Retry when the endpoints are reachable again.',
    );
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
      setLoadError(
        nextServices.some((service) => service.reachable)
          ? ''
          : 'All monitored services are currently unavailable. Retry when the endpoints are reachable again.',
      );
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
          <Stack spacing={2.5}>
            <Chip label="Monorepo service layout" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.9rem', md: '4.8rem' }, maxWidth: '11ch' }}>
              MLBots control surface
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '66ch', lineHeight: 1.8 }}>
              A professional overview for the repo layers that keeps the interface calm, readable, and operationally clear while the health probes update in place.
            </Typography>
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

        <StatusPanel
          services={services}
          isLoading={isLoading}
          lastUpdatedAt={lastUpdatedAt}
          loadError={loadError}
          onRetry={loadServices}
        />
      </Stack>
    </Container>
  );
}

export default App;
