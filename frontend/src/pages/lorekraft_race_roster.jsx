import { useEffect, useRef, useState } from 'react';

import PictureInPictureAltOutlinedIcon from '@mui/icons-material/PictureInPictureAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import { Box, Button, ButtonBase, Chip, Collapse, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import SurfaceCard from '../components/surface_card.jsx';
import FloatingRosterView from './lorekraft_race_roster_floating.jsx';
import { COLLAPSED_RACE_HEIGHT, EXPANDED_RACE_HEIGHT, formatEnumLabel, parseScore, RACE_CARD_SPACING, ROSTER_MAX_HEIGHT, ROSTER_MIN_HEIGHT, ROSTER_OVERSCAN_PX } from './lorekraft_races_helpers.js';
import { AttributeMeter, ChevronToggleButton, DetailList } from './lorekraft_races_ui.jsx';

const SECTIONAL_PAGE_SIZE = 9;
const DETAIL_GRID_COLUMNS = { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' };

function getAbilityTypeColor(abilityType) {
  switch (abilityType) {
    case 'PASSIVE':
      return '#2e7d32';
    case 'UNIQUE':
      return '#7b1fa2';
    case 'HEAVY':
      return '#c62828';
    case 'REGULAR':
      return '#1565c0';
    default:
      return '#5f6b7a';
  }
}

function formatRaceTypeSummary(raceTypes) {
  if (!raceTypes?.length) return '';

  return raceTypes.map((raceType) => formatEnumLabel(raceType)).join(', ');
}

function RaceTitleBlock({ race, tone = 'secondary' }) {
  const raceTypeSummary = formatRaceTypeSummary(race.raceTypes);

  return (
    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, minWidth: 0 }}>
          {race.name}
        </Typography>
        {race.characterTypes.length ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            {race.characterTypes.map((characterType) => (
              <Chip key={`${race.id}-${characterType}`} label={formatEnumLabel(characterType)} color={tone} variant="outlined" />
            ))}
          </Stack>
        ) : null}
      </Stack>
      {raceTypeSummary ? (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          Species: {raceTypeSummary}
        </Typography>
      ) : null}
    </Stack>
  );
}

function RaceArtwork({ race, minHeight = 160 }) {
  return (
    <Box
      sx={{
        minHeight,
        borderRadius: 3,
        border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
        background: race?.imageUrl
          ? `linear-gradient(180deg, rgba(23,37,61,0.06), rgba(23,37,61,0.18)), url(${race.imageUrl}) center/cover`
          : 'linear-gradient(145deg, rgba(30,58,47,0.12), rgba(23,37,61,0.16))',
      }}
    />
  );
}

function RaceDetailContent({ race }) {
  const [activeDetailSection, setActiveDetailSection] = useState('attributes');

  if (!race) {
    return (
      <Typography variant="body2" color="text.secondary">
        Select a race to view its details.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '180px minmax(0, 1fr)' }, pt: 0.5 }}>
      <RaceArtwork race={race} />
      <Stack spacing={2}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {race.description || 'No description yet.'}
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}>
          <Typography variant="body2" color="text.secondary">
            Linked players: {race.playerCount}
          </Typography>
          {[
            { key: 'attributes', label: 'Attributes' },
            { key: 'affinities', label: `Affinities: ${race.affinities.length}` },
            { key: 'skills', label: `Skills: ${race.skills.length}` },
            { key: 'weaknesses', label: `Weaknesses: ${race.weaknesses.length}` },
            { key: 'resistances', label: `Resistances: ${race.resistances.length}` },
            { key: 'evolution', label: `Evolution: ${race.evolutions.length}` },
          ].map((item) => (
            <Button
              key={item.key}
              variant="text"
              color="secondary"
              onClick={() => setActiveDetailSection(item.key)}
              sx={{
                justifyContent: 'flex-start',
                px: 0,
                py: 0,
                minWidth: 'auto',
                textTransform: 'none',
                fontWeight: activeDetailSection === item.key ? 700 : 400,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Divider flexItem />

        {activeDetailSection === 'attributes' ? (
          <Stack spacing={1.25}>
            <Typography variant="subtitle2" color="text.secondary">
              Attributes
            </Typography>
            {!race.attributes.length ? (
              <Typography variant="body2" color="text.secondary">
                No attributes available.
              </Typography>
            ) : null}
            {race.attributes.length ? (
              <Box sx={{ display: 'grid', gap: 0.875, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' } }}>
                {race.attributes.map((attribute) => (
                  <AttributeMeter key={`${race.id}-${attribute.attributeType}`} label={attribute.attributeType} value={attribute.value} />
                ))}
              </Box>
            ) : null}
          </Stack>
        ) : null}

        {activeDetailSection === 'affinities' ? (
          <DetailList
            title="Affinities"
            emptyText="No affinities configured."
            items={race.affinities}
            itemsContainerSx={{ gridTemplateColumns: DETAIL_GRID_COLUMNS, gap: 0.875 }}
            renderItem={(affinity, affinityIndex) => (
              <Box
                key={`${race.id}-affinity-${affinity.affinityType ?? affinityIndex}-${affinity.affinityTarget ?? affinityIndex}`}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatEnumLabel(affinity.affinityType ?? 'UNKNOWN')} · {affinity.affinityTarget || 'Unknown target'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {parseScore(affinity.value) ?? 0}/100
                </Typography>
              </Box>
            )}
          />
        ) : null}

        {activeDetailSection === 'skills' ? (
          <DetailList
            title="Skills"
            emptyText="No skills linked."
            items={race.skills}
            itemsContainerSx={{ gridTemplateColumns: DETAIL_GRID_COLUMNS, gap: 0.875 }}
            renderItem={(skill) => (
              <Box
                key={`${race.id}-skill-${skill.skillId}`}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {skill.skillName || `Skill #${skill.skillId}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                  <Typography component="span" variant="caption" sx={{ color: getAbilityTypeColor(skill.abilityType), fontWeight: 700 }}>
                    {formatEnumLabel(skill.abilityType || 'UNKNOWN')}
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                  Cooldown {skill.cooldownTime ?? 0}s / {skill.cooldownTurns ?? 0} turns
                </Typography>
              </Box>
            )}
          />
        ) : null}

        {activeDetailSection === 'weaknesses' ? (
          <DetailList
            title="Weaknesses"
            emptyText="No weaknesses configured."
            items={race.weaknesses}
            itemsContainerSx={{ gridTemplateColumns: DETAIL_GRID_COLUMNS, gap: 0.875 }}
            renderItem={(weakness, weaknessIndex) => (
              <Box
                key={`${race.id}-weakness-${weakness.kind ?? weaknessIndex}-${weakness.name ?? weaknessIndex}`}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {weakness.name || `Weakness ${weaknessIndex + 1}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                  {formatEnumLabel(weakness.kind || 'UNKNOWN')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                  {parseScore(weakness.amount) ?? 0}/100
                </Typography>
                {weakness.detail ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                    {weakness.detail}
                  </Typography>
                ) : null}
              </Box>
            )}
          />
        ) : null}

        {activeDetailSection === 'resistances' ? (
          <DetailList
            title="Resistances"
            emptyText="No resistances configured."
            items={race.resistances}
            itemsContainerSx={{ gridTemplateColumns: DETAIL_GRID_COLUMNS, gap: 0.875 }}
            renderItem={(resistance, resistanceIndex) => (
              <Box
                key={`${race.id}-resistance-${resistance.kind ?? resistanceIndex}`}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatEnumLabel(resistance.kind || `Resistance ${resistanceIndex + 1}`)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                  {parseScore(resistance.amount) ?? 0}/100
                </Typography>
                {resistance.detail ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                    {resistance.detail}
                  </Typography>
                ) : null}
              </Box>
            )}
          />
        ) : null}

        {activeDetailSection === 'evolution' ? (
          <DetailList
            title="Evolution"
            emptyText="No evolution rules configured."
            items={race.evolutions}
            renderItem={(evolution) => (
              <Box
                key={`${race.id}-evolution-${evolution.id}`}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  From {evolution.fromRaceName || 'Unknown race'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.7 }}>
                  {evolution.conditions.length
                    ? evolution.conditions.map((condition) => `${formatEnumLabel(condition.conditionType)} ${condition.conditionValue}`).join(', ')
                    : 'No conditions listed.'}
                </Typography>
              </Box>
            )}
          />
        ) : null}
      </Stack>
    </Box>
  );
}

function getVirtualizedRaceWindow({ getRaceHeight, races, rosterScrollTop, rosterViewportHeight }) {
  if (!races.length) {
    return {
      endIndex: 0,
      startIndex: 0,
      topSpacerHeight: 0,
      totalHeight: 0,
      visibleHeight: 0,
    };
  }

  const effectiveViewportHeight = rosterViewportHeight || ROSTER_MIN_HEIGHT;
  const raceHeights = races.map((race) => getRaceHeight(race));
  const totalHeight = raceHeights.reduce((sum, raceHeight) => sum + raceHeight, 0);
  const maxScrollTop = Math.max(totalHeight - effectiveViewportHeight, 0);
  const clampedScrollTop = Math.min(rosterScrollTop, maxScrollTop);
  const startOffset = Math.max(clampedScrollTop - ROSTER_OVERSCAN_PX, 0);
  const endOffset = clampedScrollTop + effectiveViewportHeight + ROSTER_OVERSCAN_PX;

  let startIndex = 0;
  let topSpacerHeight = 0;

  while (startIndex < races.length && topSpacerHeight + raceHeights[startIndex] < startOffset) {
    topSpacerHeight += raceHeights[startIndex];
    startIndex += 1;
  }

  if (startIndex >= races.length) {
    startIndex = races.length - 1;
    topSpacerHeight = totalHeight - raceHeights[startIndex];
  }

  let endIndex = startIndex;
  let visibleHeight = 0;

  while (endIndex < races.length && (visibleHeight === 0 || topSpacerHeight + visibleHeight < endOffset)) {
    visibleHeight += raceHeights[endIndex];
    endIndex += 1;
  }

  return {
    endIndex,
    startIndex,
    topSpacerHeight,
    totalHeight,
    visibleHeight,
  };
}

function getAlternatingTone(index) {
  return index % 2 === 0 ? 'primary' : 'secondary';
}

function getSelectedTone(isSelected, index) {
  return isSelected ? 'secondary' : getAlternatingTone(index);
}

function CardRosterView({ bottomSpacerHeight, expandedRaceIds, onToggleRaceCard, registerRaceCardNode, rosterScrollRef, onRosterScroll, startIndex, topSpacerHeight, visibleRaces }) {
  return (
    <Box
      ref={rosterScrollRef}
      onScroll={onRosterScroll}
      sx={{
        maxHeight: ROSTER_MAX_HEIGHT,
        minHeight: ROSTER_MIN_HEIGHT,
        overflowY: 'auto',
        overflowX: 'hidden',
        pr: 0.5,
      }}
    >
      <Box sx={{ height: topSpacerHeight }} />
      {visibleRaces.map((race, visibleIndex) => {
        const raceIndex = startIndex + visibleIndex;

        return (
          <Box key={race.id} ref={registerRaceCardNode(race.id)} sx={{ pb: `${RACE_CARD_SPACING}px` }}>
            <SurfaceCard tone={getAlternatingTone(raceIndex)} delay={0}>
              <Stack spacing={2}>
                <Stack spacing={1.5}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <ChevronToggleButton isOpen={expandedRaceIds.includes(race.id)} label={`Toggle ${race.name} card`} onClick={() => onToggleRaceCard(race.id)} />
                      <RaceTitleBlock race={race} tone={getAlternatingTone(raceIndex)} />
                    </Stack>
                  </Stack>
                </Stack>

                <Collapse in={expandedRaceIds.includes(race.id)}>
                  <RaceDetailContent race={race} />
                </Collapse>
              </Stack>
            </SurfaceCard>
          </Box>
        );
      })}
      <Box sx={{ height: bottomSpacerHeight }} />
    </Box>
  );
}

function SectionalRosterView({
  clampedSectionalPage,
  onNextPage,
  onPreviousPage,
  races,
  sectionalPageCount,
  sectionalVisibleRaces,
  sectionalVisibleRacesEnd,
  sectionalVisibleRacesStart,
  selectedSectionalRace,
  onSelectRace,
}) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 0.92fr) minmax(0, 1.08fr)' }, minHeight: ROSTER_MIN_HEIGHT }}>
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%', minHeight: 32, justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', minHeight: 32, lineHeight: 1.2 }}>
            Showing {sectionalVisibleRaces.length ? sectionalVisibleRacesStart + 1 : 0}-{Math.min(sectionalVisibleRacesEnd, races.length)} of {races.length}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0, minHeight: 32, justifyContent: 'space-between' }}>
            <Button variant="text" color="secondary" size="small" disabled={clampedSectionalPage === 0} onClick={onPreviousPage} sx={{ minHeight: 32, py: 0.5 }}>
              Prev
            </Button>
            <Button variant="text" color="secondary" size="small" disabled={clampedSectionalPage >= sectionalPageCount - 1} onClick={onNextPage} sx={{ minHeight: 32, py: 0.5 }}>
              Next
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, alignContent: 'start' }}>
          {sectionalVisibleRaces.map((race, index) => (
            <SurfaceCard key={race.id} tone={getSelectedTone(selectedSectionalRace?.id === race.id, index)} delay={0}>
              <ButtonBase onClick={() => onSelectRace(race.id)} sx={{ width: '100%', display: 'block', textAlign: 'left', borderRadius: 3, overflow: 'hidden' }}>
                <Stack spacing={1.25}>
                  <RaceArtwork race={race} minHeight={108} />
                  <Typography variant="body2" sx={{ fontWeight: 600, px: 0.5, pb: 0.5 }}>
                    {race.name}
                  </Typography>
                </Stack>
              </ButtonBase>
            </SurfaceCard>
          ))}
        </Box>
      </Stack>

      <SurfaceCard tone="primary" delay={0}>
        <Stack spacing={1.5} sx={{ height: '100%' }}>
          {selectedSectionalRace ? <RaceTitleBlock race={selectedSectionalRace} tone="secondary" /> : null}
          {!selectedSectionalRace ? (
            <Typography variant="h3" sx={{ fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
              Race details
            </Typography>
          ) : null}
          <Box sx={{ maxHeight: ROSTER_MAX_HEIGHT, overflowY: 'auto', pr: 0.5 }}>
            <RaceDetailContent key={selectedSectionalRace?.id ?? 'empty-race'} race={selectedSectionalRace} />
          </Box>
        </Stack>
      </SurfaceCard>
    </Box>
  );
}

function RosterViewSwitcher({
  bottomSpacerHeight,
  clampedSectionalPage,
  onNextSectionalPage,
  onPreviousSectionalPage,
  onSelectFloatingRace,
  onSelectSectionalRace,
  onToggleRaceCard,
  races,
  registerRaceCardNode,
  rosterScrollRef,
  rosterViewMode,
  selectedFloatingRace,
  selectedSectionalRace,
  sectionalPageCount,
  sectionalVisibleRaces,
  sectionalVisibleRacesEnd,
  sectionalVisibleRacesStart,
  startIndex,
  topSpacerHeight,
  visibleRaces,
  expandedRaceIds,
  onRosterScroll,
}) {
  if (rosterViewMode === 'card') {
    return (
      <CardRosterView
        bottomSpacerHeight={bottomSpacerHeight}
        expandedRaceIds={expandedRaceIds}
        onToggleRaceCard={onToggleRaceCard}
        registerRaceCardNode={registerRaceCardNode}
        rosterScrollRef={rosterScrollRef}
        onRosterScroll={onRosterScroll}
        startIndex={startIndex}
        topSpacerHeight={topSpacerHeight}
        visibleRaces={visibleRaces}
      />
    );
  }

  if (rosterViewMode === 'sectional') {
    return (
      <SectionalRosterView
        clampedSectionalPage={clampedSectionalPage}
        onNextPage={onNextSectionalPage}
        onPreviousPage={onPreviousSectionalPage}
        races={races}
        sectionalPageCount={sectionalPageCount}
        sectionalVisibleRaces={sectionalVisibleRaces}
        sectionalVisibleRacesEnd={sectionalVisibleRacesEnd}
        sectionalVisibleRacesStart={sectionalVisibleRacesStart}
        selectedSectionalRace={selectedSectionalRace}
        onSelectRace={onSelectSectionalRace}
      />
    );
  }

  return <FloatingRosterView onSelectFloatingRace={onSelectFloatingRace} races={races} selectedFloatingRace={selectedFloatingRace} />;
}

export default function LoreKraftRaceRoster({ expandedRaceIds, isLoading, isRaceRosterOpen, onCollapseAllRaceCards, onExpandAllRaceCards, onSetIsRaceRosterOpen, onToggleRaceCard, races }) {
  const rosterScrollRef = useRef(null);
  const raceResizeObserversRef = useRef(new Map());
  const raceCardNodesRef = useRef(new Map());
  const raceCardRefCallbacksRef = useRef(new Map());
  const [rosterViewMode, setRosterViewMode] = useState('card');
  const [sectionalPage, setSectionalPage] = useState(0);
  const [selectedSectionalRaceId, setSelectedSectionalRaceId] = useState(null);
  const [selectedFloatingRaceId, setSelectedFloatingRaceId] = useState(null);
  const [measuredRaceHeights, setMeasuredRaceHeights] = useState({});
  const [rosterScrollTop, setRosterScrollTop] = useState(0);
  const [rosterViewportHeight, setRosterViewportHeight] = useState(0);

  useEffect(() => {
    const rosterNode = rosterScrollRef.current;

    if (!rosterNode || typeof ResizeObserver === 'undefined') {
      setRosterViewportHeight(rosterNode?.clientHeight ?? 0);
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      setRosterViewportHeight(rosterNode.clientHeight);
    });

    resizeObserver.observe(rosterNode);
    setRosterViewportHeight(rosterNode.clientHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isRaceRosterOpen]);

  useEffect(
    () => () => {
      raceResizeObserversRef.current.forEach((observer) => observer.disconnect());
      raceResizeObserversRef.current.clear();
      raceCardNodesRef.current.clear();
      raceCardRefCallbacksRef.current.clear();
    },
    [],
  );

  function getRaceCardHeight(race) {
    const measuredHeight = measuredRaceHeights[race.id];

    if (measuredHeight) return measuredHeight;

    return (expandedRaceIds.includes(race.id) ? EXPANDED_RACE_HEIGHT : COLLAPSED_RACE_HEIGHT) + RACE_CARD_SPACING;
  }

  function handleRosterScroll(event) {
    setRosterScrollTop(event.currentTarget.scrollTop);
  }

  function handleChangeRosterViewMode(nextViewMode) {
    setRosterViewMode(nextViewMode);
  }

  function registerRaceCardNode(raceId) {
    if (raceCardRefCallbacksRef.current.has(raceId)) {
      return raceCardRefCallbacksRef.current.get(raceId);
    }

    const callback = (node) => {
      const previousNode = raceCardNodesRef.current.get(raceId);

      if (previousNode === node) return;

      const existingObserver = raceResizeObserversRef.current.get(raceId);

      if (existingObserver) {
        existingObserver.disconnect();
        raceResizeObserversRef.current.delete(raceId);
      }

      if (!node) {
        raceCardNodesRef.current.delete(raceId);
        return;
      }

      raceCardNodesRef.current.set(raceId, node);

      const updateHeight = () => {
        const nextHeight = Math.ceil(node.getBoundingClientRect().height) + RACE_CARD_SPACING;

        setMeasuredRaceHeights((currentHeights) => {
          if (currentHeights[raceId] === nextHeight) return currentHeights;

          return {
            ...currentHeights,
            [raceId]: nextHeight,
          };
        });
      };

      updateHeight();

      if (typeof ResizeObserver === 'undefined') return;

      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });

      resizeObserver.observe(node);
      raceResizeObserversRef.current.set(raceId, resizeObserver);
    };

    raceCardRefCallbacksRef.current.set(raceId, callback);

    return callback;
  }

  const { endIndex, startIndex, topSpacerHeight, totalHeight, visibleHeight } = getVirtualizedRaceWindow({
    getRaceHeight: getRaceCardHeight,
    races,
    rosterScrollTop,
    rosterViewportHeight,
  });
  const visibleRaces = races.slice(startIndex, Math.max(endIndex, startIndex + 1));
  const bottomSpacerHeight = Math.max(totalHeight - topSpacerHeight - visibleHeight, 0);
  const maxSectionalPage = Math.max(Math.ceil(races.length / SECTIONAL_PAGE_SIZE) - 1, 0);
  const clampedSectionalPage = Math.min(sectionalPage, maxSectionalPage);
  const sectionalPageCount = Math.max(Math.ceil(races.length / SECTIONAL_PAGE_SIZE), 1);
  const sectionalVisibleRacesStart = clampedSectionalPage * SECTIONAL_PAGE_SIZE;
  const sectionalVisibleRacesEnd = sectionalVisibleRacesStart + SECTIONAL_PAGE_SIZE;
  const sectionalVisibleRaces = races.slice(sectionalVisibleRacesStart, sectionalVisibleRacesEnd);
  const selectedSectionalRace = sectionalVisibleRaces.find((race) => race.id === selectedSectionalRaceId) ?? sectionalVisibleRaces[0] ?? null;
  const selectedFloatingRace = races.find((race) => race.id === selectedFloatingRaceId) ?? races[0] ?? null;
  const handlePreviousSectionalPage = () => setSectionalPage((currentPage) => Math.max(currentPage - 1, 0));
  const handleNextSectionalPage = () => setSectionalPage((currentPage) => Math.min(currentPage + 1, sectionalPageCount - 1));

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%', minWidth: 0, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap" sx={{ minWidth: 0, flex: 1 }}>
          <ChevronToggleButton isOpen={isRaceRosterOpen} label="Toggle race roster section" onClick={() => onSetIsRaceRosterOpen((currentValue) => !currentValue)} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, lineHeight: 1 }}>
            Race roster
          </Typography>
          <Button variant="text" color="secondary" onClick={onExpandAllRaceCards} disabled={!races.length || !isRaceRosterOpen || rosterViewMode !== 'card'} sx={{ alignSelf: 'center' }}>
            Expand all
          </Button>
          <Button variant="text" color="secondary" onClick={onCollapseAllRaceCards} disabled={!races.length || !isRaceRosterOpen || rosterViewMode !== 'card'} sx={{ alignSelf: 'center' }}>
            Collapse all
          </Button>
          <Chip label={`${races.length} ${races.length === 1 ? 'race' : 'races'}`} color="secondary" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ ml: 'auto', flexShrink: 0, justifyContent: 'flex-end' }}>
          <ToggleButtonGroup
            exclusive
            value={rosterViewMode}
            onChange={(_, nextViewMode) => {
              if (!nextViewMode) return;

              handleChangeRosterViewMode(nextViewMode);
            }}
            aria-label="Roster view mode"
            size="small"
            sx={{
              ml: { xs: 0, sm: 'auto' },
              borderRadius: 999,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.88),
              border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.14)}`,
              boxShadow: (theme) => `0 10px 24px ${alpha(theme.palette.secondary.main, 0.08)}`,
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: '999px !important',
                px: 1.2,
                py: 0.55,
                color: 'text.secondary',
                textTransform: 'none',
                gap: 0.5,
              },
              '& .Mui-selected': {
                color: 'secondary.main',
                backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.12),
              },
              '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                ml: 0.25,
              },
            }}
          >
            <ToggleButton value="card" aria-label="Card view">
              <ViewAgendaOutlinedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="sectional" aria-label="Sectional view">
              <SpaceDashboardOutlinedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="floating" aria-label="Floating display">
              <PictureInPictureAltOutlinedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Collapse in={isRaceRosterOpen}>
        <Stack spacing={1.5} sx={{ pt: 0.5 }}>
          {isLoading ? <Typography color="text.secondary">Loading races...</Typography> : null}
          {!isLoading && !races.length ? <Typography color="text.secondary">No races yet. Add the first one above.</Typography> : null}
          <RosterViewSwitcher
            bottomSpacerHeight={bottomSpacerHeight}
            clampedSectionalPage={clampedSectionalPage}
            onNextSectionalPage={handleNextSectionalPage}
            onPreviousSectionalPage={handlePreviousSectionalPage}
            onSelectFloatingRace={setSelectedFloatingRaceId}
            onSelectSectionalRace={setSelectedSectionalRaceId}
            onToggleRaceCard={onToggleRaceCard}
            races={races}
            registerRaceCardNode={registerRaceCardNode}
            rosterScrollRef={rosterScrollRef}
            rosterViewMode={rosterViewMode}
            selectedFloatingRace={selectedFloatingRace}
            selectedSectionalRace={selectedSectionalRace}
            sectionalPageCount={sectionalPageCount}
            sectionalVisibleRaces={sectionalVisibleRaces}
            sectionalVisibleRacesEnd={sectionalVisibleRacesEnd}
            sectionalVisibleRacesStart={sectionalVisibleRacesStart}
            startIndex={startIndex}
            topSpacerHeight={topSpacerHeight}
            visibleRaces={visibleRaces}
            expandedRaceIds={expandedRaceIds}
            onRosterScroll={handleRosterScroll}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}
