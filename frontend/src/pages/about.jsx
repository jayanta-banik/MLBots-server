import { useNavigate } from 'react-router-dom';

import { Box, Chip, Container, Link, Stack, Tab, Tabs, Typography } from '@mui/material';

import SurfaceCard from '../components/surface_card.jsx';

const ABOUT_ITEMS = [
  {
    label: 'Platform',
    title: 'Connected service surface',
    summary: 'MLBots combines the public web interface, account access, backend APIs, and operational visibility into one product surface.',
  },
  {
    label: 'Infrastructure',
    title: 'Built across multiple layers',
    summary: 'The project is organized across frontend, Node, and Python layers so each part of the stack has a clear runtime role.',
  },
  {
    label: 'Use',
    title: 'Designed for real workflows',
    summary: 'The goal is to keep the system understandable and usable for both product users and operators working with the service.',
  },
];

function AboutPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack spacing={3}>
        <SurfaceCard delay={0.02} tone="secondary" contentSx={{ p: { xs: 1, md: 1.25 } }}>
          <Tabs
            value="about"
            onChange={(_event, nextValue) => {
              if (nextValue === 'welcome') {
                navigate('/welcome');
                return;
              }

              navigate('/about');
            }}
            variant="fullWidth"
            sx={{ minWidth: 0 }}
          >
            <Tab label="Welcome" value="welcome" />
            <Tab label="About" value="about" />
          </Tabs>
        </SurfaceCard>

        <SurfaceCard tone="secondary" delay={0.06}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="secondary.main">
                About MLBots
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.3rem', md: '4.1rem' }, mt: 0.8, maxWidth: '10ch', overflowWrap: 'anywhere' }}>
                A service platform, not just a page
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.2, maxWidth: '70ch', lineHeight: 1.8 }}>
                MLBots is a live application surface built to connect public pages, authentication, backend services, and system visibility in one place. The project is structured to support real
                runtime usage rather than a single isolated frontend.
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
              {ABOUT_ITEMS.map((item, index) => (
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
          <Stack spacing={2}>
            <Box>
              <Typography variant="overline" color="primary.main">
                Public information
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.35rem' }, mt: 0.8 }}>
                Useful links
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Read the public privacy notice here:{' '}
              <Link href="https://resources.mlbots.in/public/policy.html" target="_blank" rel="noreferrer" underline="hover" color="secondary.main" sx={{ fontWeight: 600 }}>
                Privacy Policy
              </Link>
              .
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Learn more about the creator here:{' '}
              <Link component="button" type="button" underline="hover" color="secondary.main" sx={{ fontWeight: 600 }} onClick={() => navigate('/portfolio')}>
                About Creator
              </Link>
              .
            </Typography>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default AboutPage;
