// scripts/save-batch-images.js
import prisma from '#prisma';
import fs from 'node:fs/promises';
import path from 'node:path';

const inputFile = process.argv[2] || './output.jsonl';
const outputDir = process.argv[3] || '/home/ubuntu/projects/MLBots-server/static/media/images/lorekraft/';

function safeFileName(name) {
  return name.replaceAll(/[^\w.-]+/g, '_');
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const content = await fs.readFile(inputFile, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);

  let saved = 0;
  let skipped = 0;

  for (const [index, line] of lines.entries()) {
    try {
      const row = JSON.parse(line);

      const customId = row.custom_id;
      const statusCode = row.response?.status_code;
      const b64 = row.response?.body?.data?.[0]?.b64_json;

      if (!customId || statusCode !== 200 || !b64) {
        skipped++;
        console.warn(`Skipped line ${index + 1}: missing custom_id or image data`);
        continue;
      }

      const fileName = `${safeFileName(customId)}.jpeg`;
      const filePath = path.join(outputDir, fileName);

      const imageBuffer = Buffer.from(b64, 'base64');
      await fs.writeFile(filePath, imageBuffer);

      const data = {
        race_id: Number(fileName.split('_')[1]),
        character_type: fileName.split('_').pop() === '1' ? 'PLAYER' : 'NPC',
        url: `https://resources.mlbots.in/media/images/lorekraft/${fileName}`,
        alt: fileName.split('_').slice(2, -1).join(' '),
      };
      await prisma.char_image.create({ data });

      saved++;
      console.log(`Saved: ${filePath}`);
    } catch (err) {
      skipped++;
      console.warn(`Skipped line ${index + 1}: ${err.message}`);
    }
  }

  console.log({
    inputFile,
    outputDir,
    totalLines: lines.length,
    saved,
    skipped,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
