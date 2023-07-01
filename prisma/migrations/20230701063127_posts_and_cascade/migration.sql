/*
  Warnings:

  - You are about to drop the column `time_code_end` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `time_code_start` on the `Post` table. All the data in the column will be lost.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "chart_id" TEXT,
    "user_id" TEXT NOT NULL,
    "date_posted" DATETIME NOT NULL,
    "time_code" INTEGER,
    "reply_to_id" TEXT,
    CONSTRAINT "Post_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "Chart" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "PostReplies" ("parent_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("chart_id", "date_posted", "id", "reply_to_id", "user_id") SELECT "chart_id", "date_posted", "id", "reply_to_id", "user_id" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT,
    "user_id" TEXT,
    "last_used" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("id", "last_used", "token", "user_id") SELECT "id", "last_used", "token", "user_id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE TABLE "new_PostReplies" (
    "parent_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "PostReplies_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostReplies" ("parent_id") SELECT "parent_id" FROM "PostReplies";
DROP TABLE "PostReplies";
ALTER TABLE "new_PostReplies" RENAME TO "PostReplies";
CREATE UNIQUE INDEX "PostReplies_parent_id_key" ON "PostReplies"("parent_id");
CREATE TABLE "new_OauthToken" (
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "key_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "OauthToken_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "Key" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OauthToken" ("access_token", "expires_at", "key_id", "refresh_token", "scope", "token_type") SELECT "access_token", "expires_at", "key_id", "refresh_token", "scope", "token_type" FROM "OauthToken";
DROP TABLE "OauthToken";
ALTER TABLE "new_OauthToken" RENAME TO "OauthToken";
CREATE UNIQUE INDEX "OauthToken_key_id_key" ON "OauthToken"("key_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
