import Prisma from '@prisma/client';
import { ZodError, z } from 'zod';

const affinityTypeSchema = z.enum(Prisma.AffinityType);

const affinitySchema = z
  .object({
    affinityType: affinityTypeSchema,
    affinityTarget: z.string(),
    detail: z.string(),
    value: z.number(),
  })
  .strict();

const attributesSchema = z
  .object({
    STRENGTH: z.number(),
    AGILITY: z.number(),
    PHYSICAL_DEFENSE: z.number(),
    MAGICAL_DEFENSE: z.number(),
    MANA: z.number(),
    INTELLIGENCE: z.number(),
    COURAGE: z.number(),
    PATIENCE: z.number(),
    EGO: z.number(),
    PRIDE: z.number(),
  })
  .strict();

const characterSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    characterType: z.array(z.string()),
    // raceTypes: z.array(z.string()).nullable(),
    attributes: attributesSchema,
    affinity: z.array(affinitySchema),
    skills: z.array(z.object({}).passthrough()),
    resistance: z.array(z.object({}).passthrough()),
    weaknesses: z.array(z.object({}).passthrough()),
  })
  .passthrough();

export function parseCharacter(character) {
  try {
    return characterSchema.parse(character);
  } catch (error) {
    if (error instanceof ZodError) {
      for (const issue of error.issues) {
        const fieldPath = issue.path.join('.') || 'root';
        const fieldValue = issue.path.reduce((value, key) => value?.[key], character);

        console.error(`Invalid character field "${fieldPath}":`, fieldValue);
        console.error(`Validation message: ${issue.message}`);
      }

      return null;
    }

    throw error;
  }
}
