/*
  Warnings:

  - You are about to drop the column `salt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN "salt" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "username" TEXT,
    "avatar_url" TEXT,
    "colortheme" TEXT,
    "highlight_color" TEXT,
    "transfer_code" TEXT,
    "has_picked_username" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("avatar_url", "colortheme", "email", "has_picked_username", "highlight_color", "id", "transfer_code", "username") SELECT "avatar_url", "colortheme", "email", "has_picked_username", "highlight_color", "id", "transfer_code", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
