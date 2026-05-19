/*
  Warnings:

  - You are about to drop the column `character_types` on the `race` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "character_class" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "player" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "player_class" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "player_familiars" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "race" DROP COLUMN "character_types",
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "race_affinity" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "magic_attribution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_base_element" BOOLEAN NOT NULL DEFAULT false,
    "base_element" "MagicElement" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_attribution_component" (
    "id" SERIAL NOT NULL,
    "magic_attribution_id" INTEGER NOT NULL,
    "component_magic_attribution_id" INTEGER NOT NULL,

    CONSTRAINT "magic_attribution_component_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "magic_attribution_name_key" ON "magic_attribution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "magic_attribution_component_magic_attribution_id_component__key" ON "magic_attribution_component"("magic_attribution_id", "component_magic_attribution_id");

-- AddForeignKey
ALTER TABLE "magic_attribution_component" ADD CONSTRAINT "magic_attribution_component_magic_attribution_id_fkey" FOREIGN KEY ("magic_attribution_id") REFERENCES "magic_attribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magic_attribution_component" ADD CONSTRAINT "magic_attribution_component_component_magic_attribution_id_fkey" FOREIGN KEY ("component_magic_attribution_id") REFERENCES "magic_attribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
