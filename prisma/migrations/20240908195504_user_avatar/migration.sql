/*
  Warnings:

  - You are about to drop the column `photo` on the `profiles` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "birthday" DATETIME,
    "location" TEXT,
    "userId" TEXT NOT NULL,
    "avatar" TEXT,
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profiles" ("birthday", "firstname", "id", "lastname", "location", "userId", "username") SELECT "birthday", "firstname", "id", "lastname", "location", "userId", "username" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
