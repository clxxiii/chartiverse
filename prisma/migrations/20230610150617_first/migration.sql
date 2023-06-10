-- CreateTable
CREATE TABLE "Chart" (
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

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "state" TEXT,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "avatar_url" TEXT,
    "discord_id" TEXT,
    "twitch_id" TEXT
);

-- CreateTable
CREATE TABLE "DiscordOauth" (
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "user_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "DiscordOauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Session_state_key" ON "Session"("state");

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitch_id_key" ON "User"("twitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");
