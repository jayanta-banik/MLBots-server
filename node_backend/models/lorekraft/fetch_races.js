import prisma from '#prisma';

export default async function fetchRaces() {
  return prisma.race.findMany({
    orderBy: [{ name: 'asc' }],
    include: {
      char_images: true,
      _count: { select: { players: true } },
      race_affinity: true,
      race_attributes: true,
      race_resistances: true,
      evolution_from: { include: { from_race: true, race_evolution_conditions: true } },
      evolution_to: { include: { from_race: true, race_evolution_conditions: true } },
      race_skills: { include: { skill: true } },
    },
  });
}
