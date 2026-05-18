import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button, Chip, Container, Stack, Typography } from '@mui/material';

import SurfaceCard from '../components/surface_card.jsx';

function LoreKraftPage({ user }) {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={2}>
            <Chip label="Game project" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '4rem' }, overflowWrap: 'anywhere' }}>
              LoreKraft
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.8 }}>
              LoreKraft is the game-facing project surface for the world, systems, and narrative direction. Admin users can branch from here into the protected management page.
            </Typography>
            <SurfaceCard tone="primary" delay={0.08}>
              <Stack spacing={1.25}>
                <Chip label="Project focus" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
                  Tabletop-inspired fantasy systems
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  The current surface is positioned for campaign design, race and class systems, and future player-facing tools as the project expands.
                </Typography>
              </Stack>
            </SurfaceCard>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" color="secondary" onClick={() => navigate('/home')}>
                Back to home
              </Button>
              {isAdmin ? (
                <Button variant="outlined" color="secondary" onClick={() => navigate('/lorekraft/admin')}>
                  Open admin
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default LoreKraftPage;
