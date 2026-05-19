/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `char_image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "mldb"."char_image_race_id_character_type_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "char_image_url_key" ON "mldb"."char_image"("url");
