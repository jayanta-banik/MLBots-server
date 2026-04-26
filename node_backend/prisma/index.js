import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

dotenv.config();

const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
}).$extends(fieldEncryptionExtension({ encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY }));

export default prisma;
