/*
  Warnings:

  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[state]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN "state" TEXT;

-- CreateTable
CREATE TABLE "TwitchOauth" (
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "user_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "TwitchOauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "avatar_url" TEXT,
    "discord_id" TEXT,
    "twitch_id" TEXT
);
INSERT INTO "new_User" ("avatar_url", "id", "username") SELECT "avatar_url", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");
CREATE TABLE "new_Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Unknown Title',
    "artist" TEXT NOT NULL DEFAULT 'Unknown Artist',
    "charter" TEXT NOT NULL DEFAULT 'Unknown Charter',
    "date_added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tag" TEXT NOT NULL DEFAULT 'WIP',
    "album" TEXT NOT NULL DEFAULT 'Unknown Album',
    "genre" TEXT NOT NULL DEFAULT 'Unknown Genre',
    "year" TEXT NOT NULL DEFAULT 'Unknown Year',
    "song_length" INTEGER NOT NULL DEFAULT 0,
    "preview_start_time" INTEGER NOT NULL DEFAULT 0,
    "loading_phrase" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '0',
    "modchart" INTEGER NOT NULL DEFAULT 0,
    "album_track" INTEGER NOT NULL DEFAULT 16000,
    "playlist_track" INTEGER NOT NULL DEFAULT 16000,
    "diff_band" INTEGER NOT NULL DEFAULT -1,
    "diff_guitar" INTEGER NOT NULL DEFAULT -1,
    "diff_bass" INTEGER NOT NULL DEFAULT -1,
    "diff_rhythm" INTEGER NOT NULL DEFAULT -1,
    "diff_drums" INTEGER NOT NULL DEFAULT -1,
    "diff_keys" INTEGER NOT NULL DEFAULT -1,
    "diff_guitarghl" INTEGER NOT NULL DEFAULT -1,
    "diff_bassghl" INTEGER NOT NULL DEFAULT -1,
    "diff_rhythm_ghl" INTEGER NOT NULL DEFAULT -1,
    "diff_drums_real" INTEGER NOT NULL DEFAULT -1,
    "diff_guitar_coop_ghl" INTEGER NOT NULL DEFAULT -1,
    "diff_guitar_coop" INTEGER NOT NULL DEFAULT -1,
    "pro_drums" INTEGER NOT NULL DEFAULT 0,
    "five_lane_drums" INTEGER NOT NULL DEFAULT 0,
    "end_events" INTEGER NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,
    "frets" INTEGER NOT NULL DEFAULT 0,
    "song_url" TEXT NOT NULL DEFAULT '',
    "chart_url" TEXT NOT NULL DEFAULT '',
    "album_url" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT,
    CONSTRAINT "Chart_user_id_charter_fkey" FOREIGN KEY ("user_id", "charter") REFERENCES "User" ("id", "username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chart" ("album", "album_track", "album_url", "artist", "chart_url", "charter", "count", "date_added", "diff_band", "diff_bass", "diff_bassghl", "diff_drums", "diff_drums_real", "diff_guitar", "diff_guitar_coop", "diff_guitar_coop_ghl", "diff_guitarghl", "diff_keys", "diff_rhythm", "diff_rhythm_ghl", "end_events", "five_lane_drums", "frets", "genre", "icon", "id", "loading_phrase", "modchart", "name", "playlist_track", "preview_start_time", "pro_drums", "song_length", "song_url", "tag", "user_id", "year") SELECT "album", "album_track", "album_url", "artist", "chart_url", "charter", "count", "date_added", "diff_band", "diff_bass", "diff_bassghl", "diff_drums", "diff_drums_real", "diff_guitar", "diff_guitar_coop", "diff_guitar_coop_ghl", "diff_guitarghl", "diff_keys", "diff_rhythm", "diff_rhythm_ghl", "end_events", "five_lane_drums", "frets", "genre", "icon", "id", "loading_phrase", "modchart", "name", "playlist_track", "preview_start_time", "pro_drums", "song_length", "song_url", "tag", "user_id", "year" FROM "Chart";
DROP TABLE "Chart";
ALTER TABLE "new_Chart" RENAME TO "Chart";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Session_state_key" ON "Session"("state");
