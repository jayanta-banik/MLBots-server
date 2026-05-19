import { useEffect, useRef, useState } from 'react';

import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { Box, Button, ButtonBase, Chip, IconButton, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import SurfaceCard from '../components/surface_card.jsx';
import { formatEnumLabel, parseScore, ROSTER_MAX_HEIGHT, ROSTER_MIN_HEIGHT } from './lorekraft_races_helpers.js';

const FLOATING_ATTRIBUTE_ORDER = ['STRENGTH', 'AGILITY', 'PHYSICAL_DEFENSE', 'MAGICAL_DEFENSE', 'MANA', 'INTELLIGENCE', 'COURAGE', 'PATIENCE', 'EGO', 'PRIDE'];
const FLOATING_ATTRIBUTE_LABELS = {
  STRENGTH: 'STR',
  AGILITY: 'AGI',
  PHYSICAL_DEFENSE: 'P.DEF',
  MAGICAL_DEFENSE: 'M.DEF',
  MANA: 'MNA',
  INTELLIGENCE: 'INT',
  COURAGE: 'COU',
  PATIENCE: 'PAT',
  EGO: 'EGO',
  PRIDE: 'PRD',
};

const FLOATING_SURFACE_SX = {
  backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
  backgroundImage: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.7)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  boxShadow: (theme) => `0 24px 58px ${alpha(theme.palette.secondary.main, 0.12)}`,
};

const FLOATING_CONTENT_SX = {
  p: { xs: 2, md: 2.5 },
  '&:last-child': {
    pb: { xs: 2, md: 2.5 },
  },
};

const FLOATING_PANEL_SX = {
  p: { xs: 1.75, md: 2 },
  borderRadius: 4,
  color: 'text.primary',
  backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.82),
  backgroundImage: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.3)} 0%, ${alpha(theme.palette.background.paper, 0.94)} 100%)`,
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  boxShadow: (theme) => `0 14px 32px ${alpha(theme.palette.secondary.main, 0.08)}`,
};

const FLOATING_METRIC_TEXT_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  minWidth: 0,
  flex: 1,
  minHeight: 34,
};

const FLOATING_METRIC_TITLE_SX = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'primary.main',
  fontSize: '1.125rem',
  lineHeight: 1.25,
};

const FLOATING_METRIC_SUBTITLE_SX = {
  flexShrink: 0,
  color: 'text.secondary',
  fontStyle: 'italic',
  fontWeight: 400,
  lineHeight: 1.25,
};

function getDisplayScore(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return 0;

  const normalizedValue = numericValue > 0 && numericValue <= 1 ? numericValue * 100 : numericValue;

  return parseScore(normalizedValue) ?? 0;
}

function getFloatingAbilityTypeTheme(abilityType) {
  switch (abilityType) {
    case 'HEAVY':
      return {
        accentToken: 'warning.main',
        badgeBackground: (theme) => alpha(theme.palette.warning.main, 0.16),
        iconBackground: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.warning.light ?? theme.palette.warning.main, 0.2)}, ${alpha(theme.palette.warning.main, 0.3)})`,
      };
    case 'UNIQUE':
      return {
        accentToken: 'secondary.main',
        badgeBackground: (theme) => alpha(theme.palette.secondary.main, 0.14),
        iconBackground: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.secondary.light, 0.16)}, ${alpha(theme.palette.secondary.main, 0.26)})`,
      };
    case 'PASSIVE':
      return {
        accentToken: 'success.main',
        badgeBackground: (theme) => alpha(theme.palette.success.main, 0.16),
        iconBackground: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.success.light ?? theme.palette.success.main, 0.16)}, ${alpha(theme.palette.success.main, 0.28)})`,
      };
    case 'REGULAR':
    default:
      return {
        accentToken: 'text.primary',
        badgeBackground: (theme) => alpha(theme.palette.text.primary, 0.08),
        iconBackground: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.7)}, ${alpha(theme.palette.background.default, 0.94)})`,
      };
  }
}

function getFloatingTierMeta(powerIndex) {
  if (powerIndex >= 800) {
    return {
      label: 'Tier S',
      color: (theme) => theme.palette.warning.main,
      background: (theme) => alpha(theme.palette.warning.main, 0.14),
      border: (theme) => alpha(theme.palette.warning.main, 0.28),
    };
  }

  if (powerIndex >= 700) {
    return {
      label: 'Tier A',
      color: (theme) => theme.palette.error.main,
      background: (theme) => alpha(theme.palette.error.main, 0.12),
      border: (theme) => alpha(theme.palette.error.main, 0.26),
    };
  }

  if (powerIndex >= 600) {
    return {
      label: 'Tier B',
      color: (theme) => theme.palette.secondary.light,
      background: (theme) => alpha(theme.palette.secondary.main, 0.1),
      border: (theme) => alpha(theme.palette.secondary.light, 0.24),
    };
  }

  if (powerIndex >= 500) {
    return {
      label: 'Tier C',
      color: (theme) => theme.palette.primary.main,
      background: (theme) => alpha(theme.palette.primary.main, 0.1),
      border: (theme) => alpha(theme.palette.primary.main, 0.22),
    };
  }

  if (powerIndex >= 400) {
    return {
      label: 'Tier D',
      color: (theme) => theme.palette.text.primary,
      background: (theme) => alpha(theme.palette.text.primary, 0.08),
      border: (theme) => alpha(theme.palette.text.primary, 0.16),
    };
  }

  if (powerIndex >= 300) {
    return {
      label: 'Tier E',
      color: (theme) => theme.palette.text.secondary,
      background: (theme) => alpha(theme.palette.secondary.main, 0.06),
      border: (theme) => alpha(theme.palette.text.secondary, 0.16),
    };
  }

  return {
    label: 'Tier F',
    color: (theme) => theme.palette.success.main,
    background: (theme) => alpha(theme.palette.success.main, 0.1),
    border: (theme) => alpha(theme.palette.success.main, 0.24),
  };
}

function getFloatingRacePowerIndex(race) {
  return Math.round(race.attributes.reduce((sum, attribute) => sum + getDisplayScore(attribute.value), 0));
}

function getFloatingChipSx({ emphasis = false }) {
  return {
    height: 22,
    borderRadius: 999,
    border: (theme) => `1px solid ${alpha(emphasis ? theme.palette.secondary.main : theme.palette.primary.main, emphasis ? 0.2 : 0.12)}`,
    backgroundColor: (theme) => (emphasis ? alpha(theme.palette.secondary.main, 0.08) : alpha(theme.palette.background.default, 0.7)),
    color: emphasis ? 'secondary.main' : 'text.primary',
    '& .MuiChip-label': {
      px: 1,
    },
  };
}

function getFloatingArtworkBackground(race) {
  return race?.imageUrl
    ? `linear-gradient(180deg, rgba(255, 253, 248, 0.16), rgba(23, 37, 61, 0.12)), url(${race.imageUrl}) center/cover`
    : 'linear-gradient(145deg, rgba(71, 100, 85, 0.18), rgba(23, 37, 61, 0.12))';
}

function getFloatingTone(isSelected, index) {
  if (isSelected) return 'secondary';

  return index % 2 === 0 ? 'primary' : 'secondary';
}

function FloatingSectionHeading({ title }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.9375rem' }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
    </Stack>
  );
}

function FloatingPanel({ children, title }) {
  return (
    <Box sx={FLOATING_PANEL_SX}>
      <FloatingSectionHeading title={title} />
      {children}
    </Box>
  );
}

function FloatingRosterCarousel({ onSelectFloatingRace, races, selectedFloatingRace }) {
  const scrollRef = useRef(null);
  const [scrollElement, setScrollElement] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!scrollElement) return undefined;

    const updateScrollState = () => {
      const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

      setCanScrollLeft(scrollElement.scrollLeft > 4);
      setCanScrollRight(scrollElement.scrollLeft < maxScrollLeft - 4);
    };

    updateScrollState();

    scrollElement.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      scrollElement.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [races.length, scrollElement]);

  const handleScroll = (direction) => () => {
    if (!scrollElement) return;

    scrollElement.scrollBy({
      left: direction * Math.max(scrollElement.clientWidth * 0.72, 220),
      behavior: 'smooth',
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .floating-carousel-nav': {
          opacity: 1,
        },
      }}
    >
      <Box
        ref={(node) => {
          scrollRef.current = node;
          setScrollElement(node);
        }}
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: { xs: 'minmax(176px, 78%)', sm: '220px', lg: '240px' },
          gap: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x proximity',
          scrollbarWidth: 'none',
          pb: 0.5,
          px: { xs: 0.5, md: 0.75 },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {races.map((race, index) => {
          const isActive = selectedFloatingRace?.id === race.id;

          return (
            <SurfaceCard
              key={race.id}
              tone={getFloatingTone(isActive, index)}
              delay={0}
              sx={{
                ...FLOATING_SURFACE_SX,
                scrollSnapAlign: 'start',
                border: (theme) => `1px solid ${alpha(isActive ? theme.palette.secondary.main : theme.palette.primary.main, isActive ? 0.24 : 0.12)}`,
                backgroundImage: (theme) =>
                  isActive
                    ? `linear-gradient(180deg, ${alpha(theme.palette.secondary.light, 0.14)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`
                    : FLOATING_SURFACE_SX.backgroundImage(theme),
                boxShadow: (theme) => (isActive ? `0 16px 36px ${alpha(theme.palette.secondary.main, 0.14)}` : FLOATING_SURFACE_SX.boxShadow(theme)),
              }}
              contentSx={{
                p: 1.25,
                '&:last-child': {
                  pb: 1.25,
                },
              }}
            >
              <ButtonBase
                onClick={() => onSelectFloatingRace(race.id)}
                sx={{
                  width: '100%',
                  display: 'block',
                  textAlign: 'left',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Stack spacing={1.1}>
                  <Box
                    sx={{
                      minHeight: 112,
                      borderRadius: 3,
                      border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                      background: getFloatingArtworkBackground(race),
                    }}
                  />
                  <Typography variant="subtitle1" color="text.primary" sx={{ px: 0.25, pb: 0.25 }}>
                    {race.name}
                  </Typography>
                </Stack>
              </ButtonBase>
            </SurfaceCard>
          );
        })}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: 0.5,
          pointerEvents: 'none',
          opacity: canScrollLeft ? 1 : 0,
          transition: 'opacity 160ms ease',
          background: (theme) => `linear-gradient(90deg, ${alpha(theme.palette.background.default, 0.96)} 0%, ${alpha(theme.palette.background.default, 0)} 100%)`,
        }}
      >
        <IconButton
          className="floating-carousel-nav"
          onClick={handleScroll(-1)}
          aria-label="Scroll races left"
          sx={{
            pointerEvents: canScrollLeft ? 'auto' : 'none',
            opacity: 0.82,
            transition: 'opacity 160ms ease, background-color 160ms ease',
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
            boxShadow: (theme) => `0 10px 24px ${alpha(theme.palette.secondary.main, 0.1)}`,
            '&:hover': {
              opacity: 1,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.98),
            },
          }}
        >
          <ChevronLeftRounded />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: 0.5,
          pointerEvents: 'none',
          opacity: canScrollRight ? 1 : 0,
          transition: 'opacity 160ms ease',
          background: (theme) => `linear-gradient(270deg, ${alpha(theme.palette.background.default, 0.96)} 0%, ${alpha(theme.palette.background.default, 0)} 100%)`,
        }}
      >
        <IconButton
          className="floating-carousel-nav"
          onClick={handleScroll(1)}
          aria-label="Scroll races right"
          sx={{
            pointerEvents: canScrollRight ? 'auto' : 'none',
            opacity: 0.82,
            transition: 'opacity 160ms ease, background-color 160ms ease',
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
            boxShadow: (theme) => `0 10px 24px ${alpha(theme.palette.secondary.main, 0.1)}`,
            '&:hover': {
              opacity: 1,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.98),
            },
          }}
        >
          <ChevronRightRounded />
        </IconButton>
      </Box>
    </Box>
  );
}

function FloatingAttributeRadar({ attributes }) {
  const theme = useTheme();
  const attributeByType = new Map(attributes.map((attribute) => [attribute.attributeType, getDisplayScore(attribute.value)]));
  const chartAttributes = FLOATING_ATTRIBUTE_ORDER.map((attributeType) => ({
    label: FLOATING_ATTRIBUTE_LABELS[attributeType],
    value: attributeByType.get(attributeType) ?? 0,
  }));
  const size = 280;
  const center = size / 2;
  const radius = 92;
  const angles = chartAttributes.map((_, index) => (Math.PI * 2 * index) / chartAttributes.length - Math.PI / 2);
  const rings = [20, 40, 60, 80, 100];
  const dataPoints = chartAttributes.map((attribute, index) => {
    const pointRadius = (attribute.value / 100) * radius;

    return {
      x: center + Math.cos(angles[index]) * pointRadius,
      y: center + Math.sin(angles[index]) * pointRadius,
    };
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: 280, height: 'auto' }} role="img" aria-label="Race attribute radar chart">
        {rings.map((ring) => {
          const ringRadius = (ring / 100) * radius;
          const points = angles.map((angle) => `${(center + Math.cos(angle) * ringRadius).toFixed(1)},${(center + Math.sin(angle) * ringRadius).toFixed(1)}`).join(' ');

          return <polygon key={ring} points={points} fill="none" stroke={alpha(theme.palette.divider, 0.95)} strokeWidth="0.75" />;
        })}

        {angles.map((angle, index) => (
          <line
            key={`floating-axis-${FLOATING_ATTRIBUTE_ORDER[index]}`}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * radius}
            y2={center + Math.sin(angle) * radius}
            stroke={alpha(theme.palette.divider, 0.95)}
            strokeWidth="0.75"
          />
        ))}

        <polygon
          points={dataPoints.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')}
          fill={alpha(theme.palette.primary.main, 0.1)}
          stroke={alpha(theme.palette.primary.main, 0.72)}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {dataPoints.map((point, index) => (
          <circle key={`floating-point-${FLOATING_ATTRIBUTE_ORDER[index]}`} cx={point.x} cy={point.y} r="2.5" fill={theme.palette.primary.main} />
        ))}

        {chartAttributes.map((attribute, index) => {
          const labelRadius = radius + 18;
          const x = center + Math.cos(angles[index]) * labelRadius;
          const y = center + Math.sin(angles[index]) * labelRadius;
          let textAnchor = 'middle';

          if (x < center - 6) textAnchor = 'end';
          if (x > center + 6) textAnchor = 'start';

          return (
            <text
              key={`floating-label-${FLOATING_ATTRIBUTE_ORDER[index]}`}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fill={theme.palette.text.secondary}
              fontSize="11"
              fontWeight="500"
            >
              {attribute.label}
            </text>
          );
        })}
      </svg>
    </Box>
  );
}

function FloatingRacePortrait({ race }) {
  return (
    <Box
      sx={{
        width: { xs: 76, md: 84 },
        height: { xs: 76, md: 84 },
        borderRadius: 3,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        background: getFloatingArtworkBackground(race),
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {!race.imageUrl ? (
        <Typography variant="h3" color="text.primary">
          {race.name?.charAt(0) ?? '?'}
        </Typography>
      ) : null}
    </Box>
  );
}

function FloatingRaceDetailContent({ race }) {
  const theme = useTheme();

  if (!race) {
    return (
      <Typography variant="body2" color="text.secondary">
        Select a race to view its codex details.
      </Typography>
    );
  }

  const powerIndex = getFloatingRacePowerIndex(race);
  const tierMeta = getFloatingTierMeta(powerIndex);
  const displayedSkills = [...race.skills];
  const speciesLabel = race.raceTypes.length ? race.raceTypes.map((raceType) => formatEnumLabel(raceType)).join(', ') : 'Unknown';

  const sortedAffinities = [...race.affinities].sort((left, right) => getDisplayScore(right.value) - getDisplayScore(left.value));
  const sortedResistances = [...race.resistances].sort((left, right) => getDisplayScore(right.amount) - getDisplayScore(left.amount));
  const sortedWeaknesses = [...race.weaknesses].sort((left, right) => getDisplayScore(right.amount) - getDisplayScore(left.amount));

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '88px minmax(0, 1fr) auto' },
          gap: 2,
          alignItems: 'flex-start',
          p: { xs: 2, md: 2.25 },
          borderRadius: 4,
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.74),
          backgroundImage: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.secondary.light, 0.08)} 0%, ${alpha(theme.palette.common.white, 0.58)} 100%)`,
        }}
      >
        <FloatingRacePortrait race={race} />

        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Typography variant="h4" color="text.primary">
            {race.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Species: {speciesLabel}
          </Typography>

          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            {race.raceTypes.map((raceType) => (
              <Chip key={`${race.id}-floating-race-${raceType}`} label={formatEnumLabel(raceType)} size="small" sx={getFloatingChipSx({ emphasis: true })} />
            ))}
            {race.characterTypes.map((characterType) => (
              <Chip key={`${race.id}-floating-character-${characterType}`} label={formatEnumLabel(characterType)} size="small" sx={getFloatingChipSx({})} />
            ))}
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {race.description || 'No description yet.'}
          </Typography>
        </Stack>

        <Stack spacing={0.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }} sx={{ minWidth: { md: 112 } }}>
          <Typography variant="overline" color="text.secondary">
            Power index
          </Typography>
          <Typography variant="h2" color="text.primary" sx={{ fontFamily: 'inherit', letterSpacing: 'normal' }}>
            {powerIndex}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.2,
              py: 0.35,
              minWidth: 76,
              borderRadius: 999,
              border: `1px solid ${tierMeta.border(theme)}`,
              backgroundColor: tierMeta.background(theme),
              color: tierMeta.color(theme),
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
              boxShadow: `0 0 16px ${alpha(tierMeta.color(theme), 0.12)}`,
            }}
          >
            {tierMeta.label}
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
        <FloatingPanel title="Attributes">
          {race.attributes.length ? (
            <FloatingAttributeRadar attributes={race.attributes} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No attributes available.
            </Typography>
          )}
        </FloatingPanel>

        <FloatingPanel title="Affinities">
          {sortedAffinities.length ? (
            <Stack spacing={1.5}>
              {sortedAffinities.map((affinity, affinityIndex) => {
                const affinityScore = getDisplayScore(affinity.value);
                const affinityLabel = formatEnumLabel(affinity.affinityType || 'Unknown');

                return (
                  <Stack key={`${race.id}-floating-affinity-${affinity.affinityType ?? affinityIndex}-${affinity.affinityTarget ?? affinityIndex}`} spacing={0.7}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="baseline">
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 1.5,
                            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.78),
                            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                            display: 'grid',
                            placeItems: 'center',
                            color: 'text.secondary',
                            flexShrink: 0,
                          }}
                        >
                          {affinityLabel.charAt(0)}
                        </Box>
                        <Box sx={FLOATING_METRIC_TEXT_ROW_SX}>
                          <Typography variant="subtitle1" sx={FLOATING_METRIC_TITLE_SX}>
                            {affinity.affinityTarget || 'Unknown target'}
                          </Typography>
                          <Typography variant="subtitle2" sx={FLOATING_METRIC_SUBTITLE_SX}>
                            {affinityLabel}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="subtitle1" color="text.primary" sx={{ flexShrink: 0, textAlign: 'right' }}>
                        {affinityScore}
                      </Typography>
                    </Stack>
                    <Box sx={{ height: 5, borderRadius: 999, backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08), overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${affinityScore}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: (theme) => `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.72)}, ${alpha(theme.palette.primary.main, 0.5)})`,
                        }}
                      />
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No affinities configured.
            </Typography>
          )}
        </FloatingPanel>
      </Box>

      <Stack spacing={1}>
        <FloatingSectionHeading title="Skill loadout" />
        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' } }}>
          {displayedSkills.map((skill) => {
            const abilityTheme = getFloatingAbilityTypeTheme(skill.abilityType);
            const abilityColor = theme.palette[abilityTheme.accentToken.split('.')[0]][abilityTheme.accentToken.split('.')[1]];
            const cooldownLabel =
              skill.abilityType === 'PASSIVE'
                ? 'Always active'
                : Number(skill.cooldownTurns) > 0
                  ? `${skill.cooldownTurns} turn cd`
                  : Number(skill.cooldownTime) > 0
                    ? `${skill.cooldownTime}s cooldown`
                    : 'Ready every turn';

            return (
              <Box
                key={`${race.id}-floating-skill-${skill.skillId}`}
                sx={{
                  ...FLOATING_PANEL_SX,
                  minHeight: 168,
                  textAlign: 'center',
                }}
              >
                <Stack spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: abilityTheme.iconBackground(theme),
                      color: abilityColor,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Box sx={{ width: 12, height: 14, border: `1px solid ${alpha(abilityColor, 0.72)}`, borderRadius: 0.5 }} />
                  </Box>

                  <Typography variant="body1" color="text.primary">
                    {skill.skillName || `Skill #${skill.skillId}`}
                  </Typography>

                  <Box
                    sx={{
                      px: 1,
                      py: 0.3,
                      borderRadius: 999,
                      backgroundColor: abilityTheme.badgeBackground(theme),
                      color: abilityColor,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {formatEnumLabel(skill.abilityType || 'Unknown')}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {cooldownLabel}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Stack>

      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
        <FloatingPanel title="Resistances">
          {sortedResistances.length ? (
            <Stack spacing={1.75}>
              {sortedResistances.map((resistance, resistanceIndex) => {
                const resistanceScore = getDisplayScore(resistance.amount);

                return (
                  <Stack key={`${race.id}-floating-resistance-${resistance.kind ?? resistanceIndex}-${resistance.name ?? resistanceIndex}`} spacing={0.6}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="baseline">
                      <Box sx={FLOATING_METRIC_TEXT_ROW_SX}>
                        <Typography variant="subtitle1" sx={FLOATING_METRIC_TITLE_SX}>
                          {resistance.name || `Resistance ${resistanceIndex + 1}`}
                        </Typography>
                        <Typography variant="subtitle2" sx={FLOATING_METRIC_SUBTITLE_SX}>
                          {formatEnumLabel(resistance.kind || 'Resistance')}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="success.main" sx={{ flexShrink: 0, textAlign: 'right' }}>
                        +{resistanceScore}
                      </Typography>
                    </Stack>
                    <Box sx={{ height: 4, borderRadius: 999, backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08), overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${resistanceScore}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: (theme) => `linear-gradient(90deg, ${alpha(theme.palette.success.main, 0.42)}, ${alpha(theme.palette.success.main, 0.68)})`,
                        }}
                      />
                    </Box>
                    {resistance.detail ? (
                      <Typography variant="body2" color="text.secondary">
                        {resistance.detail}
                      </Typography>
                    ) : null}
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No resistances configured.
            </Typography>
          )}
        </FloatingPanel>

        <FloatingPanel title="Weaknesses">
          {sortedWeaknesses.length ? (
            <Stack spacing={1.75}>
              {sortedWeaknesses.map((weakness, weaknessIndex) => {
                const weaknessScore = getDisplayScore(weakness.amount);

                return (
                  <Stack key={`${race.id}-floating-weakness-${weakness.kind ?? weaknessIndex}-${weakness.name ?? weaknessIndex}`} spacing={0.6}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="baseline">
                      <Box sx={FLOATING_METRIC_TEXT_ROW_SX}>
                        <Typography variant="subtitle1" sx={FLOATING_METRIC_TITLE_SX}>
                          {weakness.name || `Weakness ${weaknessIndex + 1}`}
                        </Typography>
                        <Typography variant="subtitle2" sx={FLOATING_METRIC_SUBTITLE_SX}>
                          {formatEnumLabel(weakness.kind || 'Weakness')}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="error.main" sx={{ flexShrink: 0, textAlign: 'right' }}>
                        -{weaknessScore}
                      </Typography>
                    </Stack>
                    <Box sx={{ height: 4, borderRadius: 999, backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08), overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${weaknessScore}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: (theme) => `linear-gradient(90deg, ${alpha(theme.palette.error.main, 0.4)}, ${alpha(theme.palette.error.main, 0.66)})`,
                        }}
                      />
                    </Box>
                    {weakness.detail ? (
                      <Typography variant="body2" color="text.secondary">
                        {weakness.detail}
                      </Typography>
                    ) : null}
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No weaknesses configured.
            </Typography>
          )}
        </FloatingPanel>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
        <Button
          variant="outlined"
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.88),
            '&:hover': {
              borderColor: 'secondary.main',
              backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.06),
            },
          }}
        >
          Compare
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: 'secondary.main',
            color: 'secondary.main',
            backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.06),
            boxShadow: (theme) => `0 0 18px ${alpha(theme.palette.secondary.main, 0.08)}`,
            '&:hover': {
              borderColor: 'secondary.dark',
              backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.12),
            },
          }}
        >
          Add to roster
        </Button>
      </Stack>
    </Stack>
  );
}

export default function FloatingRosterView({ onSelectFloatingRace, races, selectedFloatingRace }) {
  return (
    <Stack spacing={1.5} sx={{ minHeight: ROSTER_MIN_HEIGHT }}>
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Select a race to open the floating codex display.
        </Typography>
        <FloatingRosterCarousel onSelectFloatingRace={onSelectFloatingRace} races={races} selectedFloatingRace={selectedFloatingRace} />
      </Stack>

      <SurfaceCard tone="secondary" delay={0} sx={FLOATING_SURFACE_SX} contentSx={FLOATING_CONTENT_SX}>
        <Box sx={{ maxHeight: ROSTER_MAX_HEIGHT, overflowY: 'auto', pr: 0.5 }}>
          <FloatingRaceDetailContent key={selectedFloatingRace?.id ?? 'empty-floating-race'} race={selectedFloatingRace} />
        </Box>
      </SurfaceCard>
    </Stack>
  );
}
