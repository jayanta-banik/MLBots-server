// scripts/create-race-image-batch.js
import fs from 'node:fs/promises';
import OpenAI from 'openai';

import prisma from '#prisma';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const OUT_FILE = './race-image-batch.jsonl';

function racePrompt(race, variantIndex) {
  return `
Create a high-quality fantasy RPG character concept image.

Race payload:
${JSON.stringify(race, null, 2)}

Image variant: ${variantIndex}

Requirements:
- Show the race clearly as a full-body fantasy character
- Use details from race attributes, affinities, resistances, weaknesses, skills, and type
- Cinematic fantasy concept art
- No text, no watermark, no UI
- Clean character silhouette
- Highly detailed costume, anatomy, weapon, aura, and environment
- create 3 distinct variants of the character based on the same race data, varying pose, facial expression, Gender (if applicable), lighting but keeping the character design consistent across variants.
- create a 4th variant that has multiple of the same character in a dynamic action pose, showcasing the character's design and skills in motion.
`.trim();
}

async function main() {
  const races = await prisma.race.findMany({
    orderBy: [{ name: 'asc' }],
    take: 2, // limit to 2 for testing - remove or increase for full batch
    select: {
      name: true,
      description: true,
      race_affinity: true,
      race_attributes: true,
      race_character_type: true, // convert to list
      race_resistances: true,
      race_types: true, // convert to list
      race_weaknesses: true,
      //   evolution_from: {
      //     select: {
      //       from_race: true,
      //       race_evolution_conditions: true,
      //     },
      //   },
      //   evolution_to: {
      //     select: {
      //       from_race: true,
      //       race_evolution_conditions: true,
      //     },
      //   },
      race_skills: { select: { skill: true } }, // convert to list with skill details
    },
  });

  const lines = [];

  for (const race of races) {
    for (let i = 1; i <= 3; i++) {
      lines.push(
        JSON.stringify({
          custom_id: `race_${race.id}_${race.name.replaceAll(/\s+/g, '_').toLowerCase()}_image_${i}`,
          method: 'POST',
          url: '/v1/images/generations',
          body: {
            model: 'gpt-image-2',
            prompt: racePrompt(race, i),
            n: 1,
            size: '1024x1024',
          },
        }),
      );
    }
  }

  await fs.writeFile(OUT_FILE, lines.join('\n'));

  const uploadedFile = await openai.files.create({
    file: await fs.open(OUT_FILE),
    purpose: 'batch',
  });

  const batch = await openai.batches.create({
    input_file_id: uploadedFile.id,
    endpoint: '/v1/images/generations',
    completion_window: '24h',
  });

  console.log({
    totalRaces: races.length,
    totalImages: races.length * 3,
    batchFile: OUT_FILE,
    uploadedFileId: uploadedFile.id,
    batchId: batch.id,
    status: batch.status,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
