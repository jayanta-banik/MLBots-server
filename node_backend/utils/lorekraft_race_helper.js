import { AffinityType, AttributeType, CharacterType, MagicElement, ResistanceKind, evolution_condition_type } from '@prisma/client';

import { createError } from '#utils/error_utils';

const ATTRIBUTE_TYPES = Object.values(AttributeType);
const CHARACTER_TYPES = Object.values(CharacterType);
const EVOLUTION_CONDITION_TYPES = Object.values(evolution_condition_type);
const MAGIC_ELEMENTS = Object.values(MagicElement);
const RESISTANCE_KINDS = Object.values(ResistanceKind);

function parseNumericValue(value, fallbackValue = 0) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

export function serializeRace(race) {
  return {
    id: race.id,
    name: race.name,
    characterTypes: race.character_types,
    description: race.description,
    createdAt: race.created_at,
    imageUrl: race.char_images[0]?.url ?? '',
    playerCount: race._count?.players ?? 0,
    evolutions: race.evolution_to.map((evolution) => ({
      id: evolution.id,
      fromRaceId: evolution.from_race_id,
      fromRaceName: evolution.from_race?.name ?? '',
      conditions: evolution.race_evolution_conditions.map((condition) => ({
        id: condition.id,
        conditionType: condition.condition_type,
        conditionValue: condition.condition_value,
      })),
    })),
    attributes: race.race_attributes.map((attribute) => ({
      attributeType: attribute.attribute_type,
      value: attribute.value,
    })),
    affinities: race.race_affinity.map((affinity) => ({
      affinityType: affinity.affinity_type,
      affinityTarget: affinity.affinity_target,
      value: affinity.value,
    })),
    skills: race.race_skills.map((skill) => ({
      skillId: skill.skills_id,
      skillName: skill.skill?.name ?? '',
      abilityType: skill.skill?.ability_type ?? '',
      cooldownTime: skill.cooldown_time,
      cooldownTurns: skill.cooldown_turns,
    })),
    resistances: race.race_resistances.map((resistance) => ({
      kind: resistance.kind,
      detail: resistance.detail,
      amount: resistance.amount,
    })),
  };
}

export function serializeSkill(skill) {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    abilityType: skill.ability_type,
    cooldownTime: skill.cooldown_time,
    cooldownTurns: skill.cooldown_turns,
  };
}

function normalizeCharacterTypes(payload) {
  const inputValues = Array.isArray(payload?.characterTypes) ? payload.characterTypes : payload?.characterType ? [payload.characterType] : [];
  const characterTypes = [...new Set(inputValues.filter((value) => CHARACTER_TYPES.includes(value)))];

  if (!characterTypes.length) {
    return createError({ message: 'At least one character type is required.', statusCode: 400 });
  }

  return characterTypes;
}

function normalizeAttributes(payload) {
  const inputAttributes = payload?.attributes && typeof payload.attributes === 'object' ? payload.attributes : {};

  return ATTRIBUTE_TYPES.map((attributeType) => ({
    attributeType,
    value: parseNumericValue(inputAttributes[attributeType], 0),
  }));
}

function normalizeAffinities(payload) {
  const elementalAffinities = payload?.affinities?.elemental && typeof payload.affinities.elemental === 'object' ? payload.affinities.elemental : {};
  const weaponAffinity = typeof payload?.affinities?.weapon === 'string' ? payload.affinities.weapon.trim() : '';
  const affinities = MAGIC_ELEMENTS.map((element) => ({
    affinityType: AffinityType.ELEMENTAL,
    affinityTarget: element,
    value: parseNumericValue(elementalAffinities[element], 0),
  }));

  if (weaponAffinity) {
    affinities.push({
      affinityType: AffinityType.WEAPON,
      affinityTarget: weaponAffinity,
      value: 1,
    });
  }

  return affinities;
}

function normalizeEvolutions(payload) {
  const inputEvolutions = Array.isArray(payload?.evolutions) ? payload.evolutions : [];
  const evolutions = [];

  for (const evolution of inputEvolutions) {
    const fromRaceId = Number(evolution?.fromRaceId);
    const inputConditions = Array.isArray(evolution?.conditions) ? evolution.conditions : [];
    const hasEvolutionValues = Boolean(evolution?.fromRaceId || inputConditions.length);

    if (!hasEvolutionValues) continue;

    if (!Number.isInteger(fromRaceId) || fromRaceId <= 0) {
      return createError({ message: 'Each evolution entry needs a valid source race.', statusCode: 400 });
    }

    const conditions = [];

    for (const condition of inputConditions) {
      const conditionType = typeof condition?.conditionType === 'string' ? condition.conditionType.trim() : '';
      const conditionValue = typeof condition?.conditionValue === 'string' ? condition.conditionValue.trim() : '';
      const hasConditionValues = Boolean(conditionType || conditionValue);

      if (!hasConditionValues) continue;

      if (!EVOLUTION_CONDITION_TYPES.includes(conditionType) || !conditionValue) {
        return createError({ message: 'Each evolution condition needs a valid type and value.', statusCode: 400 });
      }

      conditions.push({ conditionType, conditionValue });
    }

    if (!conditions.length) {
      return createError({ message: 'Each evolution entry needs at least one required condition.', statusCode: 400 });
    }

    evolutions.push({ fromRaceId, conditions });
  }

  return evolutions;
}

function normalizeResistances(payload) {
  const inputResistances = Array.isArray(payload?.resistances) ? payload.resistances : [];
  const resistances = [];

  for (const resistance of inputResistances) {
    const kind = typeof resistance?.kind === 'string' ? resistance.kind.trim() : '';
    const detail = typeof resistance?.detail === 'string' ? resistance.detail.trim() : '';
    const hasResistanceValues = Boolean(kind || detail || resistance?.amount !== undefined);

    if (!hasResistanceValues) continue;

    if (!RESISTANCE_KINDS.includes(kind)) {
      return createError({ message: 'Each resistance needs a valid type.', statusCode: 400 });
    }

    resistances.push({
      kind,
      detail: detail || null,
      amount: parseNumericValue(resistance.amount, 0.5),
    });
  }

  return resistances;
}

function normalizeSkills(payload, skillCatalog) {
  const inputSkills = Array.isArray(payload?.skills) ? payload.skills : [];
  const skillMap = new Map(skillCatalog.map((skill) => [skill.id, skill]));
  const skills = [];

  for (const skill of inputSkills) {
    const skillId = Number(skill?.skillId);
    const hasSkillValues = Boolean(skill?.skillId || skill?.cooldownTime || skill?.cooldownTurns);

    if (!hasSkillValues) continue;

    if (!Number.isInteger(skillId) || !skillMap.has(skillId)) {
      return createError({ message: 'Each skill row needs a valid skill selection.', statusCode: 400 });
    }

    const selectedSkill = skillMap.get(skillId);

    skills.push({
      skillId,
      cooldownTime: parseNumericValue(skill.cooldownTime, selectedSkill.cooldown_time),
      cooldownTurns: parseNumericValue(skill.cooldownTurns, selectedSkill.cooldown_turns),
    });
  }

  return skills;
}

export function normalizeRacePayload(payload, { races, skills }) {
  const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
  const description = typeof payload?.description === 'string' ? payload.description.trim() : '';
  const imageUrl = typeof payload?.imageUrl === 'string' ? payload.imageUrl.trim() : '';

  if (!name) {
    return createError({ message: 'Race name is required.', statusCode: 400 });
  }

  const duplicateRace = races.find((race) => race.name.toLowerCase() === name.toLowerCase());

  if (duplicateRace) {
    return createError({ message: 'A race with that name already exists.', statusCode: 409 });
  }

  const characterTypes = normalizeCharacterTypes(payload);

  if (characterTypes instanceof Error) return characterTypes;

  const evolutions = normalizeEvolutions(payload);

  if (evolutions instanceof Error) return evolutions;

  const raceIds = new Set(races.map((race) => race.id));

  for (const evolution of evolutions) {
    if (!raceIds.has(evolution.fromRaceId)) {
      return createError({ message: 'Evolution source race was not found.', statusCode: 400 });
    }
  }

  const resistances = normalizeResistances(payload);

  if (resistances instanceof Error) return resistances;

  const normalizedSkills = normalizeSkills(payload, skills);

  if (normalizedSkills instanceof Error) return normalizedSkills;

  return {
    name,
    description: description || null,
    imageUrl: imageUrl || null,
    characterTypes,
    evolutions,
    attributes: normalizeAttributes(payload),
    affinities: normalizeAffinities(payload),
    skills: normalizedSkills,
    resistances,
  };
}
