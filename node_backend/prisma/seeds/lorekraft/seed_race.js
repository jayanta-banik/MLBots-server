import prisma from '#prisma';
import { printObject } from '#utils/object_handler';

async function printRaces() {
	const races = await prisma.race.findMany({
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

	printObject(races);
}

printRaces()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
