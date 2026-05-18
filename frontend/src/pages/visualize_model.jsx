import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button, Chip, Container, Stack, Typography } from '@mui/material';

import SurfaceCard from '../components/surface_card.jsx';

function VisualizeModelPage() {
  const navigate = useNavigate();

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={2}>
            <Chip label="Model tools" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '4rem' }, overflowWrap: 'anywhere' }}>
              Visualize model
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.8 }}>
              This route is now connected from the home page card. Add your model visualization UI here.
            </Typography>
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

export default VisualizeModelPage;
