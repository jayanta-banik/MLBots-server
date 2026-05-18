import prisma from '#prisma';

function buildCharImages({ characterTypes, imageUrl, name }) {
  if (!imageUrl) return undefined;

  return {
    create: characterTypes.map((characterType) => ({
      alt: `${name} image`,
      character_type: characterType,
      url: imageUrl,
    })),
  };
}

function buildEvolutions(evolutions) {
  if (!evolutions.length) return undefined;

  return {
    create: evolutions.map((evolution) => ({
      from_race_id: evolution.fromRaceId,
      race_evolution_conditions: {
        create: evolution.conditions.map((condition) => ({
          condition_type: condition.conditionType,
          condition_value: condition.conditionValue,
        })),
      },
    })),
  };
}

function buildAttributes(attributes) {
  return {
    create: attributes.map((attribute) => ({
      attribute_type: attribute.attributeType,
      value: attribute.value,
    })),
  };
}

function buildAffinities(affinities) {
  if (!affinities.length) return undefined;

  return {
    create: affinities.map((affinity) => ({
      affinity_type: affinity.affinityType,
      affinity_target: affinity.affinityTarget,
      value: affinity.value,
    })),
  };
}

function buildSkills(skills) {
  if (!skills.length) return undefined;

  return {
    create: skills.map((skill) => ({
      skills_id: skill.skillId,
      cooldown_time: skill.cooldownTime,
      cooldown_turns: skill.cooldownTurns,
    })),
  };
}

function buildResistances(resistances) {
  if (!resistances.length) return undefined;

  return {
    create: resistances.map((resistance) => ({
      kind: resistance.kind,
      detail: resistance.detail,
      amount: resistance.amount,
    })),
  };
}

export default async function createRace({ affinities, attributes, characterTypes, description, evolutions, imageUrl, name, resistances, skills }) {
  return prisma.race.create({
    data: {
      character_types: characterTypes,
      description,
      char_images: buildCharImages({ characterTypes, imageUrl, name }),
      evolution_to: buildEvolutions(evolutions),
      race_attributes: buildAttributes(attributes),
      race_affinity: buildAffinities(affinities),
      race_skills: buildSkills(skills),
      race_resistances: buildResistances(resistances),
      name,
    },
    include: {
      char_images: {
        orderBy: [{ id: 'asc' }],
      },
      _count: { select: { players: true } },
      race_affinity: true,
      race_attributes: true,
      race_resistances: true,
      evolution_to: {
        include: {
          from_race: true,
          race_evolution_conditions: true,
        },
      },
      race_skills: { include: { skill: true } },
    },
  });
}
