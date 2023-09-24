-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT,
    "user_id" TEXT,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Key" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "salt" TEXT,
    "pretty_name" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "avatar_url" TEXT,
    "colortheme" TEXT,
    "highlight_color" TEXT,
    "transfer_code" TEXT,
    "has_picked_username" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthToken" (
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "key_id" TEXT NOT NULL,

    CONSTRAINT "OauthToken_pkey" PRIMARY KEY ("key_id")
);

-- CreateTable
CREATE TABLE "LoginProcess" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "linked_to_id" TEXT,

    CONSTRAINT "LoginProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Unknown Title',
    "artist" TEXT NOT NULL DEFAULT 'Unknown Artist',
    "charter" TEXT NOT NULL DEFAULT 'Unknown Charter',
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chart_id" TEXT,
    "user_id" TEXT NOT NULL,
    "date_posted" TIMESTAMP(3) NOT NULL,
    "time_code" INTEGER,
    "reply_to_id" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReplies" (
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "PostReplies_pkey" PRIMARY KEY ("parent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Key_id_key" ON "Key"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "OauthToken_key_id_key" ON "OauthToken"("key_id");

-- CreateIndex
CREATE UNIQUE INDEX "LoginProcess_id_key" ON "LoginProcess"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostReplies_parent_id_key" ON "PostReplies"("parent_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OauthToken" ADD CONSTRAINT "OauthToken_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "Key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginProcess" ADD CONSTRAINT "LoginProcess_linked_to_id_fkey" FOREIGN KEY ("linked_to_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_user_id_username_fkey" FOREIGN KEY ("user_id", "username") REFERENCES "User"("id", "username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "Chart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "PostReplies"("parent_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReplies" ADD CONSTRAINT "PostReplies_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
