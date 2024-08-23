/*
  Warnings:

  - You are about to drop the column `preview` on the `streams` table. All the data in the column will be lost.
  - Added the required column `language` to the `streams` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_invites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_invites_A_fkey" FOREIGN KEY ("A") REFERENCES "streams" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_invites_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_streams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "cover" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT NOT NULL,
    "price_type" TEXT NOT NULL DEFAULT 'ticket',
    "price" REAL NOT NULL DEFAULT 0.001,
    "start_now" BOOLEAN NOT NULL DEFAULT false,
    "start_time" DATETIME,
    "duration" INTEGER,
    "charity" INTEGER,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "comments_off" BOOLEAN NOT NULL DEFAULT false,
    "room" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "streams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_streams" ("id", "title", "user_id") SELECT "id", "title", "user_id" FROM "streams";
DROP TABLE "streams";
ALTER TABLE "new_streams" RENAME TO "streams";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_invites_AB_unique" ON "_invites"("A", "B");

-- CreateIndex
CREATE INDEX "_invites_B_index" ON "_invites"("B");
