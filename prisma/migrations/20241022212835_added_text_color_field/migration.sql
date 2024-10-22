/*
  Warnings:

  - Added the required column `textColor` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `textColor` VARCHAR(191) NOT NULL;
