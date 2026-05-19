-- AddForeignKey
ALTER TABLE "race_types" ADD CONSTRAINT "race_types_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
