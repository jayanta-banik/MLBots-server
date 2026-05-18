import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, Chip, Container, Stack, Typography } from '@mui/material';

import SurfaceCard from '../components/surface_card.jsx';
import apiClient from '../utils/apiClient.js';

function LoreKraftAdminPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadOverview() {
      try {
        const response = await apiClient().get('/lorekraft/admin/overview');

        if (!isActive) return;

        setOverview(response.data);
      } catch (error) {
        if (!isActive) return;

        setLoadError(error.response?.data?.message || 'LoreKraft admin data could not be loaded.');
      }
    }

    loadOverview();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={2}>
            <Chip label="Admin tools" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '4rem' }, overflowWrap: 'anywhere' }}>
              LoreKraft Admin
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.8 }}>
              This surface is restricted to admin users and is connected to an admin-only Node API route.
            </Typography>
            {loadError ? <Alert severity="error">{loadError}</Alert> : null}
            {overview ? (
              <SurfaceCard tone="primary" delay={0.08}>
                <Stack spacing={1.25}>
                  <Chip label={overview.section} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
                    Access granted
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {overview.message}
                  </Typography>
                </Stack>
              </SurfaceCard>
            ) : null}
            <SurfaceCard tone="secondary" delay={0.12}>
              <Stack spacing={1.25}>
                <Chip label="Races" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
                  Race management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  View the current LoreKraft race roster and keep adding new races from one admin page.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained" color="secondary" onClick={() => navigate('/lorekraft/admin/races')}>
                    Open races
                  </Button>
                </Stack>
              </Stack>
            </SurfaceCard>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" onClick={() => navigate('/home')}>
                Back to home
              </Button>
            </Stack>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default LoreKraftAdminPage;
