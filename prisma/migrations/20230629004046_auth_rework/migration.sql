/*
  Warnings:

  - You are about to drop the `DiscordOauth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitchOauth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `discord_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitch_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Session` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DiscordOauth";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitchOauth";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Key" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OauthToken" (
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "key_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "OauthToken_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "Key" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LoginProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "href" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "avatar_url" TEXT,
    "colortheme" TEXT,
    "highlight_color" TEXT
);
INSERT INTO "new_User" ("avatar_url", "colortheme", "highlight_color", "id", "username") SELECT "avatar_url", "colortheme", "highlight_color", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT,
    "user_id" TEXT,
    "last_used" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("id", "last_used", "user_id") SELECT "id", "last_used", "user_id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chart_id" TEXT,
    "user_id" TEXT NOT NULL,
    "date_posted" DATETIME NOT NULL,
    "time_code_start" INTEGER NOT NULL,
    "time_code_end" INTEGER NOT NULL,
    "reply_to_id" TEXT,
    CONSTRAINT "Post_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "Chart" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "PostReplies" ("parent_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("date_posted", "id", "reply_to_id", "time_code_end", "time_code_start", "user_id") SELECT "date_posted", "id", "reply_to_id", "time_code_end", "time_code_start", "user_id" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Key_id_key" ON "Key"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OauthToken_key_id_key" ON "OauthToken"("key_id");

-- CreateIndex
CREATE UNIQUE INDEX "LoginProcess_id_key" ON "LoginProcess"("id");
