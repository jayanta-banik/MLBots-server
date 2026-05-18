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