-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CharacterType" ADD VALUE 'MINION';
ALTER TYPE "CharacterType" ADD VALUE 'SLAVE';

-- CreateTable
CREATE TABLE "race_character_type" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "character_type" "CharacterType" NOT NULL,

    CONSTRAINT "race_character_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "race_character_type_race_id_idx" ON "race_character_type"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_character_type_race_id_character_type_key" ON "race_character_type"("race_id", "character_type");

-- AddForeignKey
ALTER TABLE "race_character_type" ADD CONSTRAINT "race_character_type_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
