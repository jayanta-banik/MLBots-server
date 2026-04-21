import {
  Box,
  Button,
  Chip,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import SurfaceCard from './surface_card.jsx';

function formatStatusLabel(value) {
  if (!value) {
    return '--';
  }

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function StatusPanel({ services, isLoading, lastUpdatedAt, loadError, onRetry }) {
  const showEmptyState = !isLoading && services.length === 0 && !loadError;
  const showErrorState = !isLoading && Boolean(loadError);

  return (
    <SurfaceCard tone="secondary" delay={0.16}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Box>
            <Typography variant="overline" color="secondary.main">
              Live endpoints
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mt: 0.8 }}>
              Health probes
            </Typography>
          </Box>
          <Chip
            label={lastUpdatedAt ? `Last checked ${lastUpdatedAt}` : 'No probe completed yet'}
            color="secondary"
            variant="outlined"
          />
        </Stack>

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
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
              <SurfaceCard
                key={`skeleton-${index}`}
                tone={index % 2 === 0 ? 'primary' : 'secondary'}
                contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
                sx={{ minHeight: 224 }}
              >
                <Stack spacing={1.75}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="text" width="42%" height={40} />
                    <Skeleton variant="rounded" width={108} height={32} />
                  </Stack>
                  <Skeleton variant="text" width="88%" />
                  <Skeleton variant="text" width="76%" />
                  <Skeleton variant="rounded" width="52%" height={26} />
                </Stack>
              </SurfaceCard>
            ))
            : null}

          {showEmptyState ? (
            <SurfaceCard tone="primary" contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack spacing={1.25}>
                <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
                  No services to display
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No health probes have been configured for this surface yet.
                </Typography>
              </Stack>
            </SurfaceCard>
          ) : null}

          {showErrorState ? (
            <SurfaceCard tone="secondary" contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack spacing={1.5}>
                <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
                  Unable to confirm endpoint health
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loadError}
                </Typography>
                <Button variant="contained" color="secondary" onClick={onRetry} sx={{ alignSelf: 'flex-start' }}>
                  Retry probes
                </Button>
              </Stack>
            </SurfaceCard>
          ) : null}

          {!isLoading && !showEmptyState && !showErrorState
            ? services.map((service, index) => (
              <SurfaceCard
                key={service.service_name}
                tone={service.reachable ? 'primary' : 'secondary'}
                contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
                sx={{ minHeight: '100%' }}
                delay={0.18 + index * 0.04}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
                      {service.service_name}
                    </Typography>
                    <Chip
                      label={formatStatusLabel(service.status)}
                      color={service.reachable ? 'success' : 'error'}
                      size="small"
                    />
                  </Stack>

                  <Tooltip title={service.message || '--'} placement="top-start">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 44,
                        lineHeight: 1.7,
                      }}
                    >
                      {service.message || '--'}
                    </Typography>
                  </Tooltip>

                  <Typography variant="caption" color="text.secondary">
                    {service.timestamp || '--'}
                  </Typography>
                </Stack>
              </SurfaceCard>
            ))
            : null}
        </Box>
      </Stack>
    </SurfaceCard>
  );
}

export default StatusPanel;
