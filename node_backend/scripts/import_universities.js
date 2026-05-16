import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import '../utils/env_loader.js';

import prisma from '#prisma';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const defaultCsvPath = path.resolve(currentDirectoryPath, '../../static/scripts/top_uni.csv');

function normalizeKey(value) {
  return value.trim().toLowerCase();
}

function parseArguments(argv) {
  const options = {
    csvPath: defaultCsvPath,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (argument === '--csv') {
      const nextValue = argv[index + 1];

      if (!nextValue) {
        throw new Error('Missing value for --csv');
      }

      options.csvPath = path.resolve(process.cwd(), nextValue);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function parseCsvLine(line) {
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (character === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());

  return values;
}

function parseCsv(content) {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return [];
  }

  const lines = trimmedContent.split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const values = parseCsvLine(line);

      return headers.reduce((row, header, index) => {
        row[header] = values[index] ?? '';
        return row;
      }, {});
    });
}

function splitLocation(rawLocation) {
  const segments = rawLocation
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return {
      location: 'Unknown',
      state: 'Unknown',
    };
  }

  if (segments.length === 1) {
    return {
      location: segments[0],
      state: segments[0],
    };
  }

  return {
    location: segments.slice(0, -1).join(', '),
    state: segments.at(-1),
  };
}

function normalizeUniversityRows(rows) {
  const uniqueRows = new Map();

  for (const row of rows) {
    const name = row.University?.trim();
    const rawLocation = row.Location?.trim();

    if (!name || !rawLocation) {
      throw new Error(`Invalid CSV row: ${JSON.stringify(row)}`);
    }

    const normalizedLocation = splitLocation(rawLocation);

    uniqueRows.set(normalizeKey(name), {
      name,
      location: normalizedLocation.location,
      state: normalizedLocation.state,
    });
  }

  return [...uniqueRows.values()];
}

async function loadExistingUniversities(names) {
  const existingRows = await prisma.universities.findMany({
    where: {
      name: {
        in: names,
      },
    },
    select: {
      id: true,
      name: true,
      location: true,
      state: true,
    },
  });

  const existingByName = new Map();

  for (const row of existingRows) {
    const key = normalizeKey(row.name);

    if (existingByName.has(key)) {
      throw new Error(`Duplicate university records already exist in the database for \"${row.name}\".`);
    }

    existingByName.set(key, row);
  }

  return existingByName;
}

async function importUniversities(rows, dryRun) {
  const names = rows.map((row) => row.name);
  const existingByName = await loadExistingUniversities(names);
  const rowsToCreate = [];
  const rowsToUpdate = [];
  let unchangedCount = 0;

  for (const row of rows) {
    const existingRow = existingByName.get(normalizeKey(row.name));

    if (!existingRow) {
      rowsToCreate.push(row);
      continue;
    }

    if (existingRow.location === row.location && existingRow.state === row.state) {
      unchangedCount += 1;
      continue;
    }

    rowsToUpdate.push({
      id: existingRow.id,
      location: row.location,
      state: row.state,
    });
  }

  if (!dryRun) {
    if (rowsToCreate.length > 0) {
      await prisma.universities.createMany({
        data: rowsToCreate,
      });
    }

    for (const row of rowsToUpdate) {
      await prisma.universities.update({
        where: { id: row.id },
        data: {
          location: row.location,
          state: row.state,
        },
      });
    }
  }

  return {
    total: rows.length,
    created: rowsToCreate.length,
    updated: rowsToUpdate.length,
    unchanged: unchangedCount,
    dryRun,
  };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const csvContent = await fs.readFile(options.csvPath, 'utf8');
  const parsedRows = parseCsv(csvContent);
  const universities = normalizeUniversityRows(parsedRows);

  if (universities.length === 0) {
    throw new Error(`No university rows found in ${options.csvPath}`);
  }

  const summary = await importUniversities(universities, options.dryRun);

  console.info(
    [
      `Processed ${summary.total} universities from ${options.csvPath}`,
      `created=${summary.created}`,
      `updated=${summary.updated}`,
      `unchanged=${summary.unchanged}`,
      `dryRun=${summary.dryRun}`,
    ].join(' | '),
  );
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
