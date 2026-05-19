import '../../utils/env_loader.js';

import prisma from '#prisma';

const UNIVERSITIES = [
  { name: 'San Francisco State University', city: 'San Francisco', state: 'CA' },
  { name: 'University of Hawaii at Hilo', city: 'Hilo', state: 'HI' },
  { name: 'University of Missouri Saint Louis', city: 'St. Louis', state: 'MO' },
  { name: 'University of the Pacific', city: 'Stockton', state: 'CA' },
  { name: 'University of San Diego', city: 'San Diego', state: 'CA' },
  { name: 'University of San Francisco', city: 'San Francisco', state: 'CA' },
  { name: 'University of South Alabama', city: 'Mobile', state: 'AL' },
  { name: 'Seattle University', city: 'Seattle', state: 'WA' },
  { name: 'California Polytechnic State University', city: 'San Luis Obispo', state: 'CA' },
  { name: 'Miami University', city: 'Oxford', state: 'OH' },
  { name: 'University of Denver', city: 'Denver', state: 'CO' },
  { name: 'University of Idaho', city: 'Moscow', state: 'ID' },
  { name: 'University of Louisville', city: 'Louisville', state: 'KY' },
  { name: 'University of Mississippi', city: 'Oxford', state: 'MS' },
  { name: 'University of Missouri, Kansas City', city: 'Kansas City', state: 'MO' },
  { name: 'University of Nevada - Reno', city: 'Reno', state: 'NV' },
  { name: 'University of New Hampshire', city: 'Durham', state: 'NH' },
  { name: 'University of North Carolina at Charlotte', city: 'Charlotte', state: 'NC' },
  { name: 'University of Texas at Arlington', city: 'Arlington', state: 'TX' },
];

async function upsertUniversityByName({ city, name, state }) {
  const existingUniversity = await prisma.universities.findUnique({
    where: {
      name,
    },
    select: {
      location: true,
      state: true,
    },
  });

  await prisma.universities.upsert({
    where: {
      name,
    },
    create: {
      name,
      location: city,
      state,
    },
    update: {
      location: city,
      state,
    },
  });

  if (!existingUniversity) {
    return 'created';
  }

  if (existingUniversity.location === city && existingUniversity.state === state) {
    return 'unchanged';
  }

  return 'updated';
}

async function main() {
  let createdCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;

  for (const university of UNIVERSITIES) {
    const result = await upsertUniversityByName(university);

    if (result === 'created') {
      createdCount += 1;
      continue;
    }

    if (result === 'updated') {
      updatedCount += 1;
      continue;
    }

    unchangedCount += 1;
  }

  console.info(`Processed ${UNIVERSITIES.length} universities | created=${createdCount} | updated=${updatedCount} | unchanged=${unchangedCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
