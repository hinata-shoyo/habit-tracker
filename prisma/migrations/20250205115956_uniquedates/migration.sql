/*
  Warnings:

  - A unique constraint covering the columns `[completedOn]` on the table `Completed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Completed_completedOn_key" ON "Completed"("completedOn");
