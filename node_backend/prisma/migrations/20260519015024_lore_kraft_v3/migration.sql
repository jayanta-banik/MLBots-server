/*
  Warnings:

  - You are about to drop the column `detail` on the `player_resistance` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `player_resistance` table. All the data in the column will be lost.
  - You are about to drop the column `detail` on the `race_resistances` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `race_resistances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player_id,type,element]` on the table `player_resistance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[race_id,type]` on the table `race_resistances` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `player_resistance` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `condition_type` on the `race_evolution_conditions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `race_resistances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `race_resistances` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResistanceType" AS ENUM ('PHYSICAL', 'MAGIC', 'SPELLS', 'DEBUFF', 'MENTAL', 'VITALITY', 'ELEMENTAL', 'RADIANT', 'LEVEL_NULL');

-- CreateEnum
CREATE TYPE "RaceType" AS ENUM ('CELESTIAL', 'BEAST', 'BEASTFOLK', 'DEMON', 'DRAGON', 'DWARF', 'ELEMENTAL', 'ELF', 'GIANT', 'GOBLIN', 'HUMAN', 'MACHINE', 'ORC', 'SPIRIT', 'PLANT', 'UNDEAD');

-- CreateEnum
CREATE TYPE "EvolutionConditionType" AS ENUM ('LEVEL', 'ITEM', 'AFFINITY', 'ATTRIBUTE', 'TIME_OF_DAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AttributeType" ADD VALUE 'PATIENCE';
ALTER TYPE "AttributeType" ADD VALUE 'EGO';
ALTER TYPE "AttributeType" ADD VALUE 'PRIDE';

-- DropIndex
DROP INDEX "player_resistance_player_id_kind_element_detail_key";

-- DropIndex
DROP INDEX "race_resistances_race_id_kind_detail_key";

-- AlterTable
ALTER TABLE "player_resistance" DROP COLUMN "detail",
DROP COLUMN "kind",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" "ResistanceType" NOT NULL;

-- AlterTable
ALTER TABLE "race_evolution_conditions" DROP COLUMN "condition_type",
ADD COLUMN     "condition_type" "EvolutionConditionType" NOT NULL;

-- AlterTable
ALTER TABLE "race_resistances" DROP COLUMN "detail",
DROP COLUMN "kind",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" "ResistanceType" NOT NULL;

-- AlterTable
ALTER TABLE "race_skills" ADD COLUMN     "description" TEXT;

-- DropEnum
DROP TYPE "ResistanceKind";

-- DropEnum
DROP TYPE "evolution_condition_type";

-- CreateTable
CREATE TABLE "race_weaknesses" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ResistanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "race_weaknesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "race_weaknesses_race_id_idx" ON "race_weaknesses"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_weaknesses_race_id_name_key" ON "race_weaknesses"("race_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "player_resistance_player_id_type_element_key" ON "player_resistance"("player_id", "type", "element");

-- CreateIndex
CREATE UNIQUE INDEX "race_resistances_race_id_type_key" ON "race_resistances"("race_id", "type");

-- AddForeignKey
ALTER TABLE "race_weaknesses" ADD CONSTRAINT "race_weaknesses_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
