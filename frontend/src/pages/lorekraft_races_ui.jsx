import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { formatEnumLabel, parseScore } from './lorekraft_races_helpers.js';

function getScoreColor(value) {
  if (value >= 70) return '#2e7d32';
  if (value >= 40) return '#c58b00';
  return '#c62828';
}

export function AttributeMeter({ label, value }) {
  const normalizedValue = parseScore(value) ?? 0;
  const filledBoxCount = Math.round(normalizedValue / 10);
  const filledColor = getScoreColor(normalizedValue);

  return (
    <Stack
      spacing={1}
      sx={{
        p: 1.25,
        borderRadius: 3,
        border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.62),
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatEnumLabel(label)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {normalizedValue}/100
        </Typography>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0, 1fr))', gap: 0.5 }}>
        {Array.from({ length: 10 }, (_, index) => (
          <Box
            key={`${label}-${index}`}
            sx={{
              height: 3,
              borderRadius: 999,
              backgroundColor: index < filledBoxCount ? filledColor : 'rgba(120, 128, 140, 0.22)',
            }}
          />
        ))}
      </Box>
    </Stack>
  );
}

export function DetailList({ emptyText, items, itemsContainerSx, renderItem, title }) {
  return (
    <Stack spacing={1.25}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      {!items.length ? (
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      ) : null}
      {items.length ? (
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            ...itemsContainerSx,
          }}
        >
          {items.map(renderItem)}
        </Box>
      ) : null}
    </Stack>
  );
}

export function SectionBlock({ action, children, description, title }) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.66),
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Stack spacing={0.75}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {description}
            </Typography>
          ) : null}
        </Stack>
        {action}
      </Stack>
      {children}
    </Stack>
  );
}

export function ChevronToggleButton({ isOpen, label, onClick }) {
  return (
    <Button
      variant="text"
      color="secondary"
      onClick={onClick}
      aria-label={label}
      sx={{
        minWidth: 'auto',
        px: 1,
        fontSize: '1.25rem',
        lineHeight: 1,
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        transformOrigin: 'center',
      }}
    >
      {'>'}
    </Button>
  );
}
