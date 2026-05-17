-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('STRENGTH', 'AGILITY', 'PHYSICAL_DEFENSE', 'MAGICAL_DEFENSE', 'MANA', 'INTELLIGENCE', 'COURAGE');

-- CreateEnum
CREATE TYPE "CharacterType" AS ENUM ('PLAYER', 'ENEMY', 'NPC', 'FAMILIAR');

-- CreateEnum
CREATE TYPE "MagicElement" AS ENUM ('FIRE', 'WATER', 'AIR', 'EARTH', 'AETHER', 'LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "AbilityType" AS ENUM ('REGULAR', 'HEAVY', 'UNIQUE', 'PASSIVE');

-- CreateEnum
CREATE TYPE "AffinityType" AS ENUM ('ELEMENTAL', 'WEAPON', 'SPELL', 'SKILL');

-- CreateEnum
CREATE TYPE "ResistanceKind" AS ENUM ('POISON', 'STATUS_EFFECT', 'ELEMENTAL_FIRE', 'ELEMENTAL_WATER', 'ELEMENTAL_AIR', 'ELEMENTAL_EARTH', 'ELEMENTAL_AETHER', 'ELEMENTAL_LIGHT', 'ELEMENTAL_DARK', 'PHYSICAL', 'NECROTIC', 'RADIANT', 'LEVEL_NULL');

-- CreateTable
CREATE TABLE "char_image" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "character_type" "CharacterType" NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "char_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_attribute" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "attribute_type" "AttributeType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "race_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_affinity" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "affinity_type" "AffinityType" NOT NULL,
    "affinity_target" TEXT NOT NULL,

    CONSTRAINT "race_affinity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_skill" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "ability_type" "AbilityType" NOT NULL,
    "skill_name" TEXT NOT NULL,

    CONSTRAINT "race_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_resistance" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "kind" "ResistanceKind" NOT NULL,
    "detail" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "race_resistance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_magic_attribution" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "element" "MagicElement" NOT NULL,
    "potency" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "race_magic_attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familiar" (
    "id" SERIAL NOT NULL,
    "char_image_id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occupation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "familiar_id" INTEGER,
    "occupation_id" INTEGER,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_attribute" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "attribute_type" "AttributeType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "player_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_affinity" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "affinity_type" "AffinityType" NOT NULL,
    "affinity_target" TEXT NOT NULL,

    CONSTRAINT "player_affinity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_skill" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "ability_type" "AbilityType" NOT NULL,
    "skill_name" TEXT NOT NULL,

    CONSTRAINT "player_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_resistance" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "kind" "ResistanceKind" NOT NULL,
    "element" "MagicElement",
    "detail" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "player_resistance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_magic_attribution" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "element" "MagicElement" NOT NULL,
    "potency" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "player_magic_attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_side_job" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "occupation_id" INTEGER NOT NULL,
    "salary_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "buff_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "player_side_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_item" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ability_type" "AbilityType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "magic_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "char_image_race_id_idx" ON "char_image"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "char_image_race_id_character_type_url_key" ON "char_image"("race_id", "character_type", "url");

-- CreateIndex
CREATE UNIQUE INDEX "race_name_key" ON "race"("name");

-- CreateIndex
CREATE INDEX "race_attribute_race_id_idx" ON "race_attribute"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_attribute_race_id_attribute_type_key" ON "race_attribute"("race_id", "attribute_type");

-- CreateIndex
CREATE INDEX "race_affinity_race_id_idx" ON "race_affinity"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_affinity_race_id_affinity_type_affinity_target_key" ON "race_affinity"("race_id", "affinity_type", "affinity_target");

-- CreateIndex
CREATE INDEX "race_skill_race_id_idx" ON "race_skill"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_skill_race_id_skill_name_key" ON "race_skill"("race_id", "skill_name");

-- CreateIndex
CREATE INDEX "race_resistance_race_id_idx" ON "race_resistance"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_resistance_race_id_kind_detail_key" ON "race_resistance"("race_id", "kind", "detail");

-- CreateIndex
CREATE INDEX "race_magic_attribution_race_id_idx" ON "race_magic_attribution"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_magic_attribution_race_id_element_key" ON "race_magic_attribution"("race_id", "element");

-- CreateIndex
CREATE UNIQUE INDEX "familiar_name_key" ON "familiar"("name");

-- CreateIndex
CREATE UNIQUE INDEX "occupation_name_key" ON "occupation"("name");

-- CreateIndex
CREATE INDEX "player_race_id_idx" ON "player"("race_id");

-- CreateIndex
CREATE INDEX "player_familiar_id_idx" ON "player"("familiar_id");

-- CreateIndex
CREATE INDEX "player_occupation_id_idx" ON "player"("occupation_id");

-- CreateIndex
CREATE INDEX "player_attribute_player_id_idx" ON "player_attribute"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_attribute_player_id_attribute_type_key" ON "player_attribute"("player_id", "attribute_type");

-- CreateIndex
CREATE INDEX "player_affinity_player_id_idx" ON "player_affinity"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_affinity_player_id_affinity_type_affinity_target_key" ON "player_affinity"("player_id", "affinity_type", "affinity_target");

-- CreateIndex
CREATE INDEX "player_skill_player_id_idx" ON "player_skill"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_skill_player_id_skill_name_key" ON "player_skill"("player_id", "skill_name");

-- CreateIndex
CREATE INDEX "player_resistance_player_id_idx" ON "player_resistance"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_resistance_player_id_kind_element_detail_key" ON "player_resistance"("player_id", "kind", "element", "detail");

-- CreateIndex
CREATE INDEX "player_magic_attribution_player_id_idx" ON "player_magic_attribution"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_magic_attribution_player_id_element_key" ON "player_magic_attribution"("player_id", "element");

-- CreateIndex
CREATE INDEX "player_side_job_player_id_idx" ON "player_side_job"("player_id");

-- CreateIndex
CREATE INDEX "player_side_job_occupation_id_idx" ON "player_side_job"("occupation_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_side_job_player_id_occupation_id_key" ON "player_side_job"("player_id", "occupation_id");

-- CreateIndex
CREATE INDEX "magic_item_player_id_idx" ON "magic_item"("player_id");

-- AddForeignKey
ALTER TABLE "char_image" ADD CONSTRAINT "char_image_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_attribute" ADD CONSTRAINT "race_attribute_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_affinity" ADD CONSTRAINT "race_affinity_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_skill" ADD CONSTRAINT "race_skill_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_resistance" ADD CONSTRAINT "race_resistance_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_magic_attribution" ADD CONSTRAINT "race_magic_attribution_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiar" ADD CONSTRAINT "familiar_char_image_id_fkey" FOREIGN KEY ("char_image_id") REFERENCES "char_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_familiar_id_fkey" FOREIGN KEY ("familiar_id") REFERENCES "familiar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "occupation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_attribute" ADD CONSTRAINT "player_attribute_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_affinity" ADD CONSTRAINT "player_affinity_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_skill" ADD CONSTRAINT "player_skill_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_resistance" ADD CONSTRAINT "player_resistance_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_magic_attribution" ADD CONSTRAINT "player_magic_attribution_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_side_job" ADD CONSTRAINT "player_side_job_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_side_job" ADD CONSTRAINT "player_side_job_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magic_item" ADD CONSTRAINT "magic_item_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
