/*
  Warnings:

  - A unique constraint covering the columns `[mapId]` on the table `MapState` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MapState_mapId_key" ON "MapState"("mapId");
