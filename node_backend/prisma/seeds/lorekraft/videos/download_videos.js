// download_videos.js
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { pipeline } from 'node:stream/promises';

const INPUT_FILE = process.argv[2] || './output.jsonl';
const OUT_DIR = process.argv[3] || '/home/ubuntu/projects/MLBots-server/static/media/videos/lorekraft/';

await fs.promises.mkdir(OUT_DIR, { recursive: true });

const rl = readline.createInterface({
  input: fs.createReadStream(INPUT_FILE),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  if (!line.trim()) continue;

  const row = JSON.parse(line);
  const video = row.response?.body;

  if (!video || video.status !== 'completed') {
    console.log('Skipping:', row.custom_id, video?.status);
    continue;
  }

  const videoId = video.id;
  const filename = `${row.custom_id || videoId}.mp4`;
  const outPath = path.join(OUT_DIR, filename);

  const res = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Download failed for ${videoId}: ${res.status} ${await res.text()}`);
  }

  await pipeline(res.body, fs.createWriteStream(outPath));
  console.log('Saved:', outPath);
}
