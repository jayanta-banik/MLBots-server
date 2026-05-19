-- CreateTable
CREATE TABLE "race_types" (
    "id" SERIAL NOT NULL,
    "race_id" INTEGER NOT NULL,
    "type" "RaceType" NOT NULL,

    CONSTRAINT "race_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "race_types_race_id_idx" ON "race_types"("race_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_types_race_id_type_key" ON "race_types"("race_id", "type");
