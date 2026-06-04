/*
  Warnings:

  - A unique constraint covering the columns `[resourceId]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobilityResourceId]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "isOccupied" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_resourceId_key" ON "Sensor"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_mobilityResourceId_key" ON "Sensor"("mobilityResourceId");
