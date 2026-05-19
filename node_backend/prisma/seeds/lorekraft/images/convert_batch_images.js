/* eslint-disable no-console */
// scripts/save-batch-images.js
import prisma from '#prisma';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

import ProgressBar from 'progress';

const inputFile = process.argv[2] || './output.jsonl';
const outputDir = process.argv[3] || '/home/ubuntu/projects/MLBots-server/static/media/images/lorekraft/';

function safeFileName(name) {
  return name.replaceAll(/[^\w.-]+/g, '_');
}

function getCharacterTypeFromCustomId(customId) {
  return customId.endsWith('_1') ? 'PLAYER' : 'NPC';
}

function getAltFromCustomId(customId) {
  return customId.split('_').slice(2, -1).join(' ');
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const { size: totalBytes } = await fs.stat(inputFile);
  const inputStream = createReadStream(inputFile, { encoding: 'utf8' });
  const lineReader = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });
  const progressBar = new ProgressBar('processing [:bar] :percent :etas saved=:saved skipped=:skipped lines=:lines', {
    total: Math.max(totalBytes, 1),
    width: 30,
    complete: '=',
    incomplete: ' ',
  });

  let processedLines = 0;
  let saved = 0;
  let skipped = 0;

  for await (const line of lineReader) {
    processedLines += 1;
    progressBar.tick(Buffer.byteLength(line, 'utf8') + 1, {
      lines: processedLines,
      saved,
      skipped,
    });

    if (!line) continue;

    try {
      const row = JSON.parse(line);

      const customId = row.custom_id;
      const statusCode = row.response?.status_code;
      const b64 = row.response?.body?.data?.[0]?.b64_json;

      if (!customId || statusCode !== 200 || !b64) {
        skipped++;
        console.warn(`Skipped line ${processedLines}: missing custom_id or image data`);
        continue;
      }

      const fileName = `${safeFileName(customId)}.jpeg`;
      const filePath = path.join(outputDir, fileName);

      const imageBuffer = Buffer.from(b64, 'base64');
      await fs.writeFile(filePath, imageBuffer);

      const data = {
        race_id: Number(fileName.split('_')[1]),
        character_type: getCharacterTypeFromCustomId(customId),
        url: `https://resources.mlbots.in/media/images/lorekraft/${fileName}`,
        alt: getAltFromCustomId(customId),
      };
      await prisma.char_image.create({ data });

      saved++;
    } catch (err) {
      skipped++;
      console.warn(`Skipped line ${processedLines}: ${err.message}`);
    }

    progressBar.update(progressBar.curr, {
      lines: processedLines,
      saved,
      skipped,
    });
  }

  if (!progressBar.complete) {
    progressBar.update(progressBar.total, {
      lines: processedLines,
      saved,
      skipped,
    });
  }

  console.log({
    inputFile,
    outputDir,
    totalLines: processedLines,
    saved,
    skipped,
  });

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
