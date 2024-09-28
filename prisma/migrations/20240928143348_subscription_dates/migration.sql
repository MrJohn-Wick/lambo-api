/*
  Warnings:

  - Added the required column `updatedAt` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `subscription_user_id_idx` ON `subscription`(`user_id`);

-- RenameIndex
ALTER TABLE `subscription` RENAME INDEX `subscription_subscriber_id_fkey` TO `subscription_subscriber_id_idx`;
