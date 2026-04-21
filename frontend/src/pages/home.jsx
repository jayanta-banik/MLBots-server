import { Chip, Container, Stack, Typography } from '@mui/material';

import HomeTopBar from '../components/home_top_bar.jsx';
import SurfaceCard from '../components/surface_card.jsx';

function HomePage({ onLogout, user }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <HomeTopBar onLogout={onLogout} user={user} />

        <SurfaceCard tone="primary" delay={0.02}>
          <Stack spacing={2}>
            <Stack spacing={1.5}>
              <Chip label="Authenticated home" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              <Typography variant="h1" sx={{ fontSize: { xs: '2.9rem', md: '4.4rem' } }}>
                Welcome, {user?.firstName ?? 'there'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.8 }}>
                Your account session is active. This personalized home surface keeps the greeting stable across refreshes and gives signed-in navigation its own responsive top bar.
              </Typography>
            </Stack>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default HomePage;
