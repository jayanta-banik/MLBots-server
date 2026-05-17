import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ButtonBase, Chip, Container, Stack, Typography } from '@mui/material';

import HomeTopBar from '../components/home_top_bar.jsx';
import SurfaceCard from '../components/surface_card.jsx';

function HomePage({ onLogout, user }) {
  const navigate = useNavigate();
  const upcomingProjects = [
    {
      title: 'Vectorize repo',
      description: 'Codebase indexing and semantic retrieval workspace for faster engineering search and context lookup.',
    },
    {
      title: 'Apprentice (LLM memory management tool)',
      description: 'Memory workflow tooling for storing, retrieving, and curating long-term LLM context safely.',
    },
    {
      title: 'MCP tool collection',
      description: 'A curated set of Model Context Protocol utilities for common automation and integration flows.',
    },
    {
      title: 'Lorekraft (DND-like game)',
      description: 'Narrative-first world-building and campaign gameplay inspired by tabletop role-playing systems.',
    },
  ];

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <HomeTopBar onLogout={onLogout} user={user} />

        <SurfaceCard tone="primary" delay={0.02}>
          <Stack spacing={2}>
            <Stack spacing={1.5}>
              <Chip label="Authenticated home" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              <Typography variant="h1" sx={{ fontSize: { xs: '2.45rem', sm: '2.9rem', md: '4.4rem' }, overflowWrap: 'anywhere' }}>
                Welcome, {user?.firstName ?? 'there'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.8 }}>
                Your account session is active. This personalized home surface keeps the greeting stable across refreshes and gives signed-in navigation its own responsive top bar.
              </Typography>
            </Stack>
          </Stack>
        </SurfaceCard>

        <ButtonBase onClick={() => navigate('/Visualize/Model')} sx={{ display: 'block', width: '100%', borderRadius: 4, textAlign: 'left' }} aria-label="Open visualize model page">
          <SurfaceCard
            tone="secondary"
            delay={0.06}
            sx={{
              width: '100%',
              transition: 'transform 160ms ease, box-shadow 160ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
            }}
          >
            <Stack spacing={1.5}>
              <Chip label="Model tools" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.25rem' } }}>
                Visualize model
              </Typography>
            </Stack>
          </SurfaceCard>
        </ButtonBase>

        <ButtonBase onClick={() => navigate('/tracking-uni')} sx={{ display: 'block', width: '100%', borderRadius: 4, textAlign: 'left' }} aria-label="Open faculty reachout tracker page">
          <SurfaceCard
            tone="primary"
            delay={0.1}
            sx={{
              width: '100%',
              transition: 'transform 160ms ease, box-shadow 160ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
            }}
          >
            <Stack spacing={1.5}>
              <Chip label="Outreach tools" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.25rem' } }}>
                Faculty reachout tracker
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.75 }}>
                Keep faculty outreach organized with one place to track conversations, follow-ups, and response progress.
              </Typography>
            </Stack>
          </SurfaceCard>
        </ButtonBase>

        <SurfaceCard tone="secondary" delay={0.14}>
          <Stack spacing={2}>
            <Chip label="Roadmap" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
              Coming soon
            </Typography>
            <Stack spacing={1.5}>
              {upcomingProjects.map((project, index) => (
                <SurfaceCard key={project.title} tone={index % 2 === 0 ? 'primary' : 'secondary'} delay={0.18 + index * 0.04}>
                  <Stack spacing={1}>
                    <Chip label="Coming soon" color={index % 2 === 0 ? 'primary' : 'secondary'} variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {project.description}
                    </Typography>
                  </Stack>
                </SurfaceCard>
              ))}
            </Stack>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default HomePage;
