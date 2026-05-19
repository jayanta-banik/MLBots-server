/* eslint-disable no-await-in-loop */
import Prisma from '@prisma/client';
import { writeFile } from 'node:fs/promises';

import prisma from '#prisma';
import { titleCase } from '#utils/string_handler';
import { characters, resistanceCategoryMap } from './race_data.js';
import { parseCharacter } from './seed_functions.js';
import enumDBPairs from './seed_helper.js';

const raceCreateData = [];
const pendingRaceAffinities = [];
const pendingRaceAttributes = [];
const pendingRaceCharacterTypes = [];
const pendingRaceResistances = [];
const pendingRaceSkills = [];
const pendingRaceWeaknesses = [];
const pendingSkillsByName = new Map();

const collatedMatches = {
  raceCharacterType: [],
  magicElement: [],
  raceAffinity: [],
  nonStandardAffinity: [],
  unrecognizedAffinityType: [],
  resistanceType: [],
  weaknessType: [],
  weaponType: {},
  skillType: {},
  spellType: {},
  missingRace: [],
  missingSkill: [],
};

function createNameIdMap(records) {
  return new Map(records.map(({ name, id }) => [name, id]));
}

function resolveRaceId(raceIdByName, raceName) {
  const raceId = raceIdByName.get(raceName);

  if (raceId) return raceId;

  collatedMatches.missingRace.push(`Missing race id for ${raceName}`);
  return null;
}

function resolveSkillId(skillIdByName, raceName, skillName) {
  const skillId = skillIdByName.get(skillName);

  if (skillId) return skillId;

  collatedMatches.missingSkill.push(`Missing skill id for ${skillName} on ${raceName}`);
  return null;
}

for (const character of characters) {
  const parsedCharacter = parseCharacter(character);

  if (parsedCharacter === null) continue;

  const { name, description, characterType, raceTypes, attributes, affinity, skills, resistance, weaknesses } = parsedCharacter;
  const raceName = titleCase(name.trim());

  raceCreateData.push({ name: raceName, description });

  // character type
  const resolvedCharacterTypes = await Promise.all(
    characterType.map(async (characterTypeName) => {
      if (characterTypeName in Prisma.CharacterType) return characterTypeName;

      const match = await enumDBPairs.characterType.db.queryString(characterTypeName, 1);
      collatedMatches.raceCharacterType.push(`Querying character type for ${characterTypeName}, found match: ${match[0].id}`);

      return match[0].id;
    }),
  );

  pendingRaceCharacterTypes.push(
    ...resolvedCharacterTypes.map((resolvedCharacterType) => ({
      raceName,
      character_type: resolvedCharacterType,
    })),
  );

  // affinity
  for (const { affinityType, affinityTarget, detail, value } of affinity) {
    let affinityTypeValue = affinityType.trim().toUpperCase();
    let affinityTargetValue = affinityTarget.trim();

    if (!(affinityTypeValue in Prisma.AffinityType)) {
      // affinityType should be one of the AffinityTypes, just get the best match
      const match = await enumDBPairs.affinityType.db.queryString(affinityTypeValue, 1);
      collatedMatches.raceAffinity.push(`Unknown affinity for ${name}. Querying affinity type for ${affinityTypeValue}, found match: ${match[0].id}`);
      affinityTypeValue = match[0].id;
    }

    if (affinityTypeValue === Prisma.AffinityType.ELEMENTAL) {
      // affinityTarget should be one of the MagicElements, just get the best element match
      if (!(affinityTargetValue in Prisma.MagicElement)) {
        const match = await enumDBPairs.magicElementType.db.queryString(affinityTarget, 1); // reducing cost
        collatedMatches.magicElement.push(`For ${name} querying magic element type for ${affinityTarget}, found match: ${match[0].id}`);
        affinityTargetValue = match[0].id;
      }
    } else {
      collatedMatches.nonStandardAffinity.push(`For ${name} non-standard affinity type: ${affinityTypeValue} - ${affinityTargetValue}`);

      if (affinityTypeValue === Prisma.AffinityType.SKILL) collatedMatches.skillType[affinityTarget] = true;
      else if (affinityTypeValue === Prisma.AffinityType.WEAPON) collatedMatches.weaponType[affinityTarget] = true;
      else if (affinityTypeValue === Prisma.AffinityType.SPELL) collatedMatches.spellType[affinityTarget] = true;
      else collatedMatches.unrecognizedAffinityType.push(`For ${name} unrecognized affinity type: ${affinityTypeValue}`);
    }

    pendingRaceAffinities.push({
      raceName,
      affinity_type: affinityTypeValue,
      affinity_target: affinityTargetValue,
      description: detail.trim(),
      value,
    });
  }

  // attribute
  pendingRaceAttributes.push(
    ...Object.entries(attributes).map(([attributeType, value]) => ({
      raceName,
      attribute_type: attributeType,
      value,
    })),
  );

  // If race type is found, then use it. Otherwise, query DB.
  void raceTypes;

  const resolvedResistances = await Promise.all(
    resistance.map(async ({ resistanceKind, detail, amount }) => ({
      name: resistanceKind.trim(),
      type:
        resistanceCategoryMap[resistanceKind] ||
        (await (async () => {
          const match = await enumDBPairs.resistanceType.db.queryString(resistanceKind, 1);
          collatedMatches.resistanceType.push(`For ${name} querying resistance type for ${resistanceKind}, found match: ${match[0].id}`);
          return match[0].id;
        })()),
      description: detail.trim(),
      amount,
    })),
  );

  pendingRaceResistances.push(
    ...resolvedResistances.map((resolvedResistance) => ({
      raceName,
      ...resolvedResistance,
    })),
  );

  for (const skill of skills) {
    const skillName = skill.name.trim();

    if (!pendingSkillsByName.has(skillName)) {
      pendingSkillsByName.set(skillName, {
        name: skillName,
        description: skill.description.trim(),
        ability_type: skill.abilityType.trim().toUpperCase(),
        cooldown_time: skill.cooldownTime,
        cooldown_turns: skill.cooldownTurns,
      });
    }

    pendingRaceSkills.push({
      raceName,
      skillName,
      description: skill.description.trim(),
      cooldown_time: skill.cooldownTime,
      cooldown_turns: skill.cooldownTurns,
    });
  }

  for (const weakness of weaknesses) {
    const { weaknessesType, description, value } = weakness;

    pendingRaceWeaknesses.push({
      raceName,
      name: titleCase(weaknessesType.trim()),
      type: await (async () => {
        const match = await enumDBPairs.resistanceType.db.queryString(weaknessesType?.trim(), 1);
        collatedMatches.weaknessType.push(`For ${name} querying resistance type for ${weaknessesType}, found match: ${match[0].id}`);
        return match[0].id;
      })(),
      description: description.trim(),
      amount: value,
    });
  }
}

await prisma.race.createMany({ data: raceCreateData, skipDuplicates: true });

const raceRecords = await prisma.race.findMany({
  where: { name: { in: [...new Set(raceCreateData.map(({ name }) => name))] } },
  select: { id: true, name: true },
});

await prisma.skills.createMany({
  data: [...pendingSkillsByName.values()],
  skipDuplicates: true,
});

const skillRecords = await prisma.skills.findMany({
  where: { name: { in: [...pendingSkillsByName.keys()] } },
  select: { id: true, name: true },
});

const raceIdByName = createNameIdMap(raceRecords);
const skillIdByName = createNameIdMap(skillRecords);

await prisma.race_resistances.createMany({
  data: pendingRaceResistances.flatMap(({ raceName, ...raceResistance }) => {
    const raceId = resolveRaceId(raceIdByName, raceName);
    return raceId ? [{ race_id: raceId, ...raceResistance }] : [];
  }),
  skipDuplicates: true,
});

await prisma.race_affinity.createMany({
  data: pendingRaceAffinities.flatMap(({ raceName, ...raceAffinity }) => {
    const raceId = resolveRaceId(raceIdByName, raceName);
    return raceId ? [{ race_id: raceId, ...raceAffinity }] : [];
  }),
  skipDuplicates: true,
});

await prisma.race_attributes.createMany({
  data: pendingRaceAttributes.flatMap(({ raceName, ...raceAttribute }) => {
    const raceId = resolveRaceId(raceIdByName, raceName);
    return raceId ? [{ race_id: raceId, ...raceAttribute }] : [];
  }),
  skipDuplicates: true,
});

await prisma.race_character_type.createMany({
  data: pendingRaceCharacterTypes.flatMap(({ raceName, ...raceCharacterType }) => {
    const raceId = resolveRaceId(raceIdByName, raceName);
    return raceId ? [{ race_id: raceId, ...raceCharacterType }] : [];
  }),
  skipDuplicates: true,
});

await prisma.race_skills.createMany({
  data: pendingRaceSkills.flatMap(({ raceName, skillName, ...raceSkill }) => {
    const raceId = resolveRaceId(raceIdByName, raceName);
    const skillId = resolveSkillId(skillIdByName, raceName, skillName);

    return raceId && skillId ? [{ race_id: raceId, skills_id: skillId, ...raceSkill }] : [];
  }),
  skipDuplicates: true,
});

await prisma.race_weaknesses.createMany({
  data: pendingRaceWeaknesses.flatMap(({ raceName, ...raceWeakness }) => {
    const raceId = resolveRaceId(raceIdByName, raceName);
    return raceId ? [{ race_id: raceId, ...raceWeakness }] : [];
  }),
  skipDuplicates: true,
});

await writeFile(
  new URL('./seed.log', import.meta.url),
  JSON.stringify(
    {
      collatedMatches,
      skillSet: [...pendingSkillsByName.keys()],
      weaponSet: Object.keys(collatedMatches.weaponType),
      spellSet: Object.keys(collatedMatches.spellType),
    },
    null,
    2,
  ),
);
