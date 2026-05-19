// scripts/create-race-video-batch.js

import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import OpenAI from 'openai';

import prisma from '#prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OUT_FILE = './race-video-batch.jsonl';

function formatEnumLabel(value) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildRacePayload(race) {
  return {
    name: race.name,
    description: race.description || '',
    raceTypes: race.race_types.map((x) => formatEnumLabel(x.type)),
    characterTypes: race.race_character_type.map((x) => formatEnumLabel(x.character_type)),
    affinities: race.race_affinity.map((x) => ({
      type: formatEnumLabel(x.affinity_type),
      target: x.affinity_target,
    })),
    attributes: race.race_attributes.map((x) => ({
      type: formatEnumLabel(x.attribute_type),
      value: x.value,
    })),
    skills: race.race_skills.map(({ skill }) => ({
      name: skill?.name,
      description: skill?.description,
      abilityType: skill?.ability_type ? formatEnumLabel(skill.ability_type) : '',
    })),
  };
}

function createVideoPrompt(race) {
  const payload = buildRacePayload(race);

  return `
Create a cinematic AAA fantasy RPG character selection screen animation.

The video is exactly 3.5 seconds long.

Scene:
A dark fantasy game character selection environment with dramatic atmospheric lighting.
A circular elevated platform exists in the center of the scene.
The character stands heroically in the middle of the platform.

Character Data:
${JSON.stringify(payload, null, 2)}

Animation behavior:
The character performs a stylish action sequence that reflects their identity, abilities, race, combat style, and magical affinity.

Possible actions include:
- weapon swings
- magical aura casting
- elemental effects
- backflips
- teleport dashes
- aerial movement
- stance changes
- quick-step dodges
- cape or wing motion
- summoning effects
- combat flourish animation

Requirements:
- highly cinematic
- game-ready presentation
- realistic motion physics
- dynamic camera movement
- subtle idle breathing motion
- fantasy RPG atmosphere
- no text
- no subtitles
- no UI
- no watermark
- one character only
- full body visible throughout most of the animation
- smooth looping feel
- high detail character design
- dramatic shadows and volumetric lighting
- visually impressive hero showcase animation
`.trim();
}

async function main() {
  const races = await prisma.race.findMany({
    orderBy: [{ name: 'asc' }],
    take: 1, // limit to 2 for testing - remove or increase for full batch
    select: {
      id: true,
      name: true,
      description: true,
      char_images: { where: { character_type: 'PLAYER' }, take: 1, select: { url: true } },
      race_affinity: { select: { affinity_type: true, affinity_target: true } },
      race_attributes: { select: { attribute_type: true, value: true } },
      race_character_type: { select: { character_type: true } },
      race_types: { select: { type: true } },
      race_skills: { select: { skill: true } },
    },
  });

  const lines = [];

  for (const race of races) {
    lines.push(
      JSON.stringify({
        custom_id: `race_${race.id}_${race.name.replaceAll(/\s+/g, '_').toLowerCase()}_video_1`,
        method: 'POST',
        url: '/v1/videos',
        body: {
          model: 'sora-2',
          prompt: createVideoPrompt(race),
          seconds: '4',
          size: '1280x720',
          //   input_reference: { image_url: race.char_image?.[0]?.url },
        },
      }),
    );
  }

  await fs.writeFile(OUT_FILE, lines.join('\n'));

  const uploadedFile = await openai.files.create({
    file: createReadStream(OUT_FILE),
    purpose: 'batch',
  });

  const batch = await openai.batches.create({
    input_file_id: uploadedFile.id,
    endpoint: '/v1/videos',
    completion_window: '24h',
  });

  console.log({
    totalRaces: races.length,
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
