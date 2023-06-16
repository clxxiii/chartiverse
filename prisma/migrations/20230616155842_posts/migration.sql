/*
  Warnings:

  - You are about to drop the column `tag` on the `Chart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "colortheme" TEXT;
ALTER TABLE "User" ADD COLUMN "highlight_color" TEXT;

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "date_posted" DATETIME NOT NULL,
    "time_code_start" INTEGER NOT NULL,
    "time_code_end" INTEGER NOT NULL,
    "reply_to_id" TEXT,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "PostReplies" ("parent_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostReplies" (
    "parent_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "PostReplies_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "last_used" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("id", "state", "user_id") SELECT "id", "state", "user_id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_state_key" ON "Session"("state");
CREATE TABLE "new_Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Unknown Title',
    "artist" TEXT NOT NULL DEFAULT 'Unknown Artist',
    "charter" TEXT NOT NULL DEFAULT 'Unknown Charter',
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_added" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'WIP',
    "visibility" INTEGER NOT NULL DEFAULT 1,
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
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT NOT NULL DEFAULT '',
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
    "background_url" TEXT,
    "icon_url" TEXT,
    "audio_type" TEXT NOT NULL DEFAULT 'ogg',
    "album_type" TEXT NOT NULL DEFAULT 'png',
    "background_type" TEXT,
    "icon_type" TEXT,
    "username" TEXT,
    "user_id" TEXT,
    CONSTRAINT "Chart_user_id_username_fkey" FOREIGN KEY ("user_id", "username") REFERENCES "User" ("id", "username") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chart" ("album", "album_track", "album_url", "artist", "chart_url", "charter", "count", "date_added", "diff_band", "diff_bass", "diff_bassghl", "diff_drums", "diff_drums_real", "diff_guitar", "diff_guitar_coop", "diff_guitar_coop_ghl", "diff_guitarghl", "diff_keys", "diff_rhythm", "diff_rhythm_ghl", "end_events", "five_lane_drums", "frets", "genre", "icon", "id", "loading_phrase", "modchart", "name", "playlist_track", "preview_start_time", "pro_drums", "song_length", "song_url", "user_id", "year") SELECT "album", "album_track", "album_url", "artist", "chart_url", "charter", "count", "date_added", "diff_band", "diff_bass", "diff_bassghl", "diff_drums", "diff_drums_real", "diff_guitar", "diff_guitar_coop", "diff_guitar_coop_ghl", "diff_guitarghl", "diff_keys", "diff_rhythm", "diff_rhythm_ghl", "end_events", "five_lane_drums", "frets", "genre", "icon", "id", "loading_phrase", "modchart", "name", "playlist_track", "preview_start_time", "pro_drums", "song_length", "song_url", "user_id", "year" FROM "Chart";
DROP TABLE "Chart";
ALTER TABLE "new_Chart" RENAME TO "Chart";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "PostReplies_parent_id_key" ON "PostReplies"("parent_id");
