// scripts/create-race-image-batch.js
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';

import OpenAI from 'openai';

import prisma from '#prisma';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const OUT_FILE = './race-image-batch.jsonl';

function formatEnumLabel(value) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatRacePromptPayload(race) {
  return {
    name: race.name,
    description: race.description || 'No description provided.',
    species: race.race_types.map((entry) => entry.type).join(', '),
    characterTypes: race.race_character_type[Math.floor(Math.random() * race.race_character_type.length)].character_type,
    affinities: race.race_affinity.reduce((acc, affinity) => {
      if (!acc[affinity.affinity_type]) acc[affinity.affinity_type] = [];
      acc[affinity.affinity_type].push(affinity.affinity_target);
      return acc;
    }, {}),
    attributes: race.race_attributes.map((attribute) => ({ [formatEnumLabel(attribute.attribute_type)]: attribute.value })),
    weaknesses: race.race_weaknesses.map((weakness) => `${weakness.name}, ${weakness.description}`),
    skills: race.race_skills.flatMap(({ skill }) => `${skill?.name} (${skill?.ability_type})`),
  };
}

function racePrompt(racePayload, variantIndex, artStyle) {
  return `
Create a RPG character concept image.

Race payload:
${JSON.stringify(racePayload, null, 2)}

Art style: ${artStyle}

Requirements:
- Show the race clearly as a full-body character
- Use details from race attributes, affinities, resistances, weaknesses, skills, and type
- No text, no watermark, no UI
- Clean character silhouette
- Highly detailed costume, anatomy, weapon, aura, and environment
- create 3 distinct variants of the character based on the same race data, varying pose, facial expression, gender (if applicable), lighting but keeping the character design consistent across variants.
- create a 4th variant that has multiple of the same character in a dynamic action pose, showcasing the character's design and skills in motion.
`.trim();
}

async function main() {
  const races = await prisma.race.findMany({
    orderBy: [{ name: 'asc' }],
    // take: 1, // limit to 2 for testing - remove or increase for full batch
    select: {
      id: true,
      name: true,
      description: true,
      race_affinity: {
        select: {
          affinity_type: true,
          description: true,
          affinity_target: true,
        },
      },
      race_attributes: {
        select: {
          attribute_type: true,
          value: true,
        },
      },
      race_character_type: {
        select: {
          character_type: true,
        },
      },
      race_resistances: {
        select: {
          name: true,
          type: true,
          description: true,
        },
      },
      race_types: {
        select: {
          type: true,
        },
      },
      race_weaknesses: {
        select: {
          name: true,
          type: true,
          description: true,
        },
      },
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
      race_skills: { select: { skill: true } },
    },
  });

  const lines = [];

  const artStyle = [
    'cinematic AAA fantasy RPG realism, dramatic lighting, realistic anatomy, detailed armor, volumetric shadows, high-end game trailer look',

    'highly detailed fantasy concept art, painterly rendering, intricate costume design, ornate weapons, expressive character silhouette, premium artbook style',

    'isekai less details, simple anime arts style, shonen jump, generic fantasy anime protagonist design, simple cel shading, low-detail clothing, slightly bright magical aura effects, overpowered RPG adventurer vibe, light novel cover aesthetic, cheap seasonal anime quality, exaggerated anime expressions, basic fantasy town or dungeon atmosphere, colorful but slightly flat rendering, anime MMORPG intro scene energy',

    // 'extremely pixelated retro fantasy game art, 8-bit and 16-bit RPG sprite aesthetic, chunky visible pixels, minecraft-inspired blocky design, low-resolution fantasy character, simple animation frame look, old-school SNES and NES RPG vibe, minimal shading, tiny sprite proportions, retro dungeon crawler style, intentionally low fidelity, pixel-perfect retro game appearance',

    // 'Retro 2D pixel-art anime RPG/fighting-game sprite scene, early-2000s MUGEN/Flash/RPG Maker style. Extremely low-res, chunky visible pixels, limited 8/16-bit palette, jagged hard edges, no anti-aliasing. Side-view sprite on simple flat platform with retro background. Small-scale character in dynamic combat pose/attack/stance. Minimal frame-animation feel, compressed nostalgic fan-game aesthetic inspired by Naruto/Bleach/DBZ MUGEN games. Flat shading only. No HD pixel art, no smooth shading, no modern lighting, no realism, no 3D, no high detail.',
  ];

  for (const race of races) {
    const racePayload = formatRacePromptPayload(race);

    for (let i = 1; i <= 3; i++) {
      lines.push(
        JSON.stringify({
          custom_id: `race_${race.id}_${race.name.replaceAll(/\s+/g, '_').toLowerCase()}_image_${i}`,
          method: 'POST',
          url: '/v1/images/generations',
          body: {
            model: 'gpt-image-2',
            prompt: racePrompt(racePayload, i, artStyle[i - 1]),
            n: 1,
            size: '1024x1024',
          },
        }),
      );
    }
  }

  await fs.writeFile(OUT_FILE, lines.join('\n'));

  const uploadedFile = await openai.files.create({
    file: createReadStream(OUT_FILE),
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
