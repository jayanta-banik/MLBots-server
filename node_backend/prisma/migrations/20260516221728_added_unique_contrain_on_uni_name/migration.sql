/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `universities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "universities_name_key" ON "universities"("name");
