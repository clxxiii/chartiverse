-- AlterTable
ALTER TABLE "Chart" ADD COLUMN     "drive_id" TEXT;

-- CreateTable
CREATE TABLE "Drive" (
    "id" TEXT NOT NULL,
    "drive_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drive_drive_id_key" ON "Drive"("drive_id");

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "Drive"("id") ON DELETE SET NULL ON UPDATE CASCADE;
