/*
  Warnings:

  - You are about to drop the column `familiar_id` on the `player` table. All the data in the column will be lost.
  - You are about to drop the `familiar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `race_attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `race_magic_attribution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `race_resistance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `race_skill` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "evolution_condition_type" AS ENUM ('LEVEL', 'ITEM', 'AFFINITY', 'ATTRIBUTE', 'TIME_OF_DAY');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CharacterType" ADD VALUE 'BOSS';
ALTER TYPE "CharacterType" ADD VALUE 'SUPPORT_CHARACTER';

-- DropForeignKey
ALTER TABLE "familiar" DROP CONSTRAINT "familiar_char_image_id_fkey";

-- DropForeignKey
ALTER TABLE "player" DROP CONSTRAINT "player_familiar_id_fkey";

-- DropForeignKey
ALTER TABLE "race_attribute" DROP CONSTRAINT "race_attribute_race_id_fkey";

-- DropForeignKey
ALTER TABLE "race_magic_attribution" DROP CONSTRAINT "race_magic_attribution_race_id_fkey";

-- DropForeignKey
ALTER TABLE "race_resistance" DROP CONSTRAINT "race_resistance_race_id_fkey";

-- DropForeignKey
ALTER TABLE "race_skill" DROP CONSTRAINT "race_skill_race_id_fkey";

-- DropIndex
DROP INDEX "player_familiar_id_idx";

-- AlterTable
ALTER TABLE "magic_item" ADD COLUMN     "attribute_agment" "AttributeType",
ADD COLUMN     "attribute_bonus" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "player" DROP COLUMN "familiar_id",
ADD COLUMN     "player_classId" INTEGER,
ADD COLUMN     "player_familiar_id" INTEGER;

-- AlterTable
ALTER TABLE "race" ADD COLUMN     "character_types" "CharacterType"[] DEFAULT ARRAY[]::"CharacterType"[];

-- AlterTable
ALTER TABLE "race_affinity" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0.14;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "familiar";

-- DropTable
DROP TABLE "race_attribute";

-- DropTable
DROP TABLE "race_magic_attribution";

-- DropTable
DROP TABLE "race_resistance";

-- DropTable
DROP TABLE "race_skill";

-- CreateTable
CREATE TABLE "character_class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_attributes" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "attribute_type" "AttributeType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "race_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_evolutions" (
    "id" SERIAL NOT NULL,
    "from_race_id" INTEGER NOT NULL,
    "to_race_id" INTEGER NOT NULL,

    CONSTRAINT "race_evolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_evolution_conditions" (
    "id" SERIAL NOT NULL,
    "evolution_id" INTEGER NOT NULL,
    "condition_type" "evolution_condition_type" NOT NULL,
    "condition_value" TEXT NOT NULL,

    CONSTRAINT "race_evolution_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_resistances" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "kind" "ResistanceKind" NOT NULL,
    "detail" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "race_resistances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_skills" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "skills_id" INTEGER NOT NULL,
    "cooldown_time" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "cooldown_turns" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "race_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ability_type" "AbilityType" NOT NULL,
    "cooldown_time" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "cooldown_turns" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_class" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_familiars" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "race_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_familiars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_inventory" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "player_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_side_job_history" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "occupation_id" INTEGER NOT NULL,
    "salary_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "buff_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_side_job_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "character_class_name_key" ON "character_class"("name");

-- CreateIndex
CREATE INDEX "race_attributes_race_id_idx" ON "race_attributes"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_attributes_race_id_attribute_type_key" ON "race_attributes"("race_id", "attribute_type");

-- CreateIndex
CREATE INDEX "race_evolutions_from_race_id_idx" ON "race_evolutions"("from_race_id");

-- CreateIndex
CREATE INDEX "race_evolutions_to_race_id_idx" ON "race_evolutions"("to_race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_evolutions_from_race_id_to_race_id_key" ON "race_evolutions"("from_race_id", "to_race_id");

-- CreateIndex
CREATE INDEX "race_evolution_conditions_evolution_id_idx" ON "race_evolution_conditions"("evolution_id");

-- CreateIndex
CREATE INDEX "race_resistances_race_id_idx" ON "race_resistances"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_resistances_race_id_kind_detail_key" ON "race_resistances"("race_id", "kind", "detail");

-- CreateIndex
CREATE INDEX "race_skills_race_id_idx" ON "race_skills"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_skills_race_id_skills_id_key" ON "race_skills"("race_id", "skills_id");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "player_familiars_name_key" ON "player_familiars"("name");

-- CreateIndex
CREATE INDEX "player_inventory_player_id_idx" ON "player_inventory"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_inventory_player_id_item_name_key" ON "player_inventory"("player_id", "item_name");

-- CreateIndex
CREATE INDEX "player_side_job_history_player_id_idx" ON "player_side_job_history"("player_id");

-- CreateIndex
CREATE INDEX "player_side_job_history_occupation_id_idx" ON "player_side_job_history"("occupation_id");

-- CreateIndex
CREATE INDEX "player_player_familiar_id_idx" ON "player"("player_familiar_id");

-- AddForeignKey
ALTER TABLE "race_attributes" ADD CONSTRAINT "race_attributes_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_evolutions" ADD CONSTRAINT "race_evolutions_from_race_id_fkey" FOREIGN KEY ("from_race_id") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_evolutions" ADD CONSTRAINT "race_evolutions_to_race_id_fkey" FOREIGN KEY ("to_race_id") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_evolution_conditions" ADD CONSTRAINT "race_evolution_conditions_evolution_id_fkey" FOREIGN KEY ("evolution_id") REFERENCES "race_evolutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_resistances" ADD CONSTRAINT "race_resistances_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_skills" ADD CONSTRAINT "race_skills_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_skills" ADD CONSTRAINT "race_skills_skills_id_fkey" FOREIGN KEY ("skills_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_player_familiar_id_fkey" FOREIGN KEY ("player_familiar_id") REFERENCES "player_familiars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_player_classId_fkey" FOREIGN KEY ("player_classId") REFERENCES "player_class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_familiars" ADD CONSTRAINT "player_familiars_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_inventory" ADD CONSTRAINT "player_inventory_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_side_job_history" ADD CONSTRAINT "player_side_job_history_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_side_job_history" ADD CONSTRAINT "player_side_job_history_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
