import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const envFileName = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env';
const envFile = path.join(currentDirectoryPath, envFileName);

console.info(`Loading environment variables from ${envFile}`);

dotenv.config({ path: envFile });

// Debug: Show which environment file is being loaded
console.debug(`🔹 ENVIRONMENT: ${process.env.ENV}`);
