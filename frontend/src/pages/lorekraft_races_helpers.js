export const ROSTER_MAX_HEIGHT = '72vh';
export const ROSTER_MIN_HEIGHT = 320;
export const ROSTER_OVERSCAN_PX = 480;
export const COLLAPSED_RACE_HEIGHT = 112;
export const EXPANDED_RACE_HEIGHT = 920;
export const RACE_CARD_SPACING = 12;

export function createRowId(prefix) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatEnumLabel(value) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatDateTime(value) {
  if (!value) return 'Unknown';

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) return 'Unknown';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedValue);
}

export function parseScore(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return null;

  return Math.max(0, Math.min(100, numericValue));
}

function normalizeRaceCharacterTypes(race) {
  if (Array.isArray(race?.characterTypes)) return race.characterTypes;
  if (Array.isArray(race?.character_types)) return race.character_types;
  if (Array.isArray(race?.race_character_type)) {
    return race.race_character_type.map((entry) => entry?.characterType ?? entry?.character_type).filter(Boolean);
  }

  return [];
}

function normalizeRaceTypes(race) {
  if (Array.isArray(race?.raceTypes)) return race.raceTypes;
  if (Array.isArray(race?.race_types)) {
    return race.race_types.map((entry) => (typeof entry === 'string' ? entry : entry?.type)).filter(Boolean);
  }

  return [];
}

function normalizeAttributes(race) {
  if (Array.isArray(race?.attributes)) return race.attributes;
  if (Array.isArray(race?.race_attributes)) {
    return race.race_attributes.map((attribute) => ({
      attributeType: attribute?.attributeType ?? attribute?.attribute_type,
      value: attribute?.value,
    }));
  }

  return [];
}

function normalizeAffinities(race) {
  if (Array.isArray(race?.affinities)) return race.affinities;
  if (Array.isArray(race?.race_affinity)) {
    return race.race_affinity.map((affinity) => ({
      affinityType: affinity?.affinityType ?? affinity?.affinity_type,
      affinityTarget: affinity?.affinityTarget ?? affinity?.affinity_target,
      value: affinity?.value,
    }));
  }

  return [];
}

function normalizeSkills(race) {
  if (Array.isArray(race?.skills)) return race.skills;
  if (Array.isArray(race?.race_skills)) {
    return race.race_skills.map((skill) => ({
      skillId: skill?.skillId ?? skill?.skills_id ?? skill?.skill?.id,
      skillName: skill?.skillName ?? skill?.skill?.name ?? '',
      abilityType: skill?.abilityType ?? skill?.skill?.ability_type ?? '',
      cooldownTime: skill?.cooldownTime ?? skill?.cooldown_time ?? skill?.skill?.cooldown_time,
      cooldownTurns: skill?.cooldownTurns ?? skill?.cooldown_turns ?? skill?.skill?.cooldown_turns,
    }));
  }

  return [];
}

function normalizeResistanceEntries(entries) {
  return entries.map((entry) => ({
    kind: entry?.kind ?? entry?.type,
    detail: entry?.detail ?? entry?.description ?? entry?.name ?? '',
    name: entry?.name ?? '',
    amount: entry?.amount,
  }));
}

function normalizeResistances(race) {
  if (Array.isArray(race?.resistances)) return normalizeResistanceEntries(race.resistances);
  if (Array.isArray(race?.race_resistances)) return normalizeResistanceEntries(race.race_resistances);

  return [];
}

function normalizeWeaknesses(race) {
  if (Array.isArray(race?.weaknesses)) return normalizeResistanceEntries(race.weaknesses);
  if (Array.isArray(race?.race_weaknesses)) return normalizeResistanceEntries(race.race_weaknesses);

  return [];
}

function normalizeEvolutionConditions(evolution) {
  if (Array.isArray(evolution?.conditions)) return evolution.conditions;
  if (Array.isArray(evolution?.race_evolution_conditions)) {
    return evolution.race_evolution_conditions.map((condition) => ({
      id: condition?.id,
      conditionType: condition?.conditionType ?? condition?.condition_type,
      conditionValue: condition?.conditionValue ?? condition?.condition_value,
    }));
  }

  return [];
}

function normalizeEvolutions(race) {
  if (Array.isArray(race?.evolutions)) return race.evolutions;
  if (Array.isArray(race?.evolution_to)) {
    return race.evolution_to.map((evolution) => ({
      id: evolution?.id,
      fromRaceId: evolution?.fromRaceId ?? evolution?.from_race_id,
      fromRaceName: evolution?.fromRaceName ?? evolution?.from_race?.name ?? '',
      conditions: normalizeEvolutionConditions(evolution),
    }));
  }

  return [];
}

export function normalizeRaceRecord(race) {
  return {
    ...race,
    characterTypes: normalizeRaceCharacterTypes(race),
    raceTypes: normalizeRaceTypes(race),
    imageUrl: race?.imageUrl ?? race?.char_images?.[0]?.url ?? '',
    playerCount: race?.playerCount ?? race?._count?.players ?? 0,
    attributes: normalizeAttributes(race),
    affinities: normalizeAffinities(race),
    evolutions: normalizeEvolutions(race),
    skills: normalizeSkills(race),
    resistances: normalizeResistances(race),
    weaknesses: normalizeWeaknesses(race),
  };
}

export function createResistanceRow(overrides = {}) {
  return {
    id: createRowId('resistance'),
    kind: '',
    detail: '',
    amount: '0.5',
    ...overrides,
  };
}

export function isElementalResistanceKind(kind) {
  return typeof kind === 'string' && kind.startsWith('ELEMENTAL_');
}

export function createInitialFormState({ attributeTypes, magicElements }) {
  return {
    name: '',
    imageUrl: '',
    imageFile: null,
    imageFileName: '',
    description: '',
    characterTypes: [],
    attributes: Object.fromEntries(attributeTypes.map((attributeType) => [attributeType, '0'])),
    affinities: {
      elemental: Object.fromEntries(magicElements.map((element) => [element, '0'])),
      weapon: '',
    },
    evolutions: [],
    skills: [{ id: createRowId('skill'), skillId: '', cooldownTime: '', cooldownTurns: '' }],
    resistances: [createResistanceRow()],
  };
}

export function createEvolutionCondition() {
  return {
    id: createRowId('condition'),
    conditionType: '',
    conditionValue: '',
  };
}

export function createEvolutionEntry() {
  return {
    id: createRowId('evolution'),
    fromRaceId: '',
    conditions: [createEvolutionCondition()],
  };
}

export function buildExpandedRaceIds(raceRecords) {
  return raceRecords.map((race) => race.id);
}
