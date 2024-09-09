/*
  Warnings:

  - You are about to drop the column `photo` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `photo`,
    ADD COLUMN `avatar` TEXT NULL;
