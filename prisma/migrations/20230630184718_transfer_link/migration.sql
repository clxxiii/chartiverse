-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LoginProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "href" TEXT NOT NULL,
    "linked_to_id" TEXT,
    CONSTRAINT "LoginProcess_linked_to_id_fkey" FOREIGN KEY ("linked_to_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_LoginProcess" ("href", "id") SELECT "href", "id" FROM "LoginProcess";
DROP TABLE "LoginProcess";
ALTER TABLE "new_LoginProcess" RENAME TO "LoginProcess";
CREATE UNIQUE INDEX "LoginProcess_id_key" ON "LoginProcess"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "username" TEXT,
    "avatar_url" TEXT,
    "colortheme" TEXT,
    "highlight_color" TEXT,
    "salt" TEXT,
    "transfer_code" TEXT,
    "has_picked_username" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("avatar_url", "colortheme", "email", "highlight_color", "id", "salt", "username") SELECT "avatar_url", "colortheme", "email", "highlight_color", "id", "salt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
