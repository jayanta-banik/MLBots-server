-- AlterTable
ALTER TABLE "player_skill" ADD COLUMN     "cooldown_time" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "cooldown_turns" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "race_skill" ADD COLUMN     "cooldown_time" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "cooldown_turns" INTEGER NOT NULL DEFAULT 2;
