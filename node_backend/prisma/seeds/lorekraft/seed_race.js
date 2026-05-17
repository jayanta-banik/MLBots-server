import prisma from '#prisma';
import { printObject } from '#utils/object_handler';

async function getRaceData() {
  return prisma.race.findMany({
    include: {
      char_images: true,
      race_attributes: true,
      race_affinities: true,
      race_skills: true,
      race_resistances: true,
      race_magic_attributions: true,
      players: true,
    },
  });
}

async function printRaces() {
  const races = await getRaceData();

  printObject({ total: races.length, races });
}

async function main() {
  await printRaces();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
