/*
  Warnings:

  - Added the required column `projectId` to the `ProjectInvitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProjectInvitations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProjectInvitations` ADD COLUMN `projectId` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProjectInvitations` ADD CONSTRAINT `ProjectInvitations_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
