/*
  Warnings:

  - You are about to drop the column `album_type` on the `Chart` table. All the data in the column will be lost.
  - You are about to drop the column `audio_type` on the `Chart` table. All the data in the column will be lost.
  - You are about to drop the column `background_type` on the `Chart` table. All the data in the column will be lost.
  - You are about to drop the column `background_url` on the `Chart` table. All the data in the column will be lost.
  - You are about to drop the column `icon_type` on the `Chart` table. All the data in the column will be lost.
  - You are about to drop the column `icon_url` on the `Chart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[song_url]` on the table `Chart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chart_url]` on the table `Chart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[album_url]` on the table `Chart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chart" DROP COLUMN "album_type",
DROP COLUMN "audio_type",
DROP COLUMN "background_type",
DROP COLUMN "background_url",
DROP COLUMN "icon_type",
DROP COLUMN "icon_url";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "can_upload" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "md5sum" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "drive_id" TEXT,
    "chart_id" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_md5sum_key" ON "File"("md5sum");

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "File"("url");

-- CreateIndex
CREATE UNIQUE INDEX "File_drive_id_key" ON "File"("drive_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chart_song_url_key" ON "Chart"("song_url");

-- CreateIndex
CREATE UNIQUE INDEX "Chart_chart_url_key" ON "Chart"("chart_url");

-- CreateIndex
CREATE UNIQUE INDEX "Chart_album_url_key" ON "Chart"("album_url");

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_song_url_fkey" FOREIGN KEY ("song_url") REFERENCES "File"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_chart_url_fkey" FOREIGN KEY ("chart_url") REFERENCES "File"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_album_url_fkey" FOREIGN KEY ("album_url") REFERENCES "File"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "Chart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
