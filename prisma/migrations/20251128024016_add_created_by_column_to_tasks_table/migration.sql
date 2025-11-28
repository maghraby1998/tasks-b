/*
  Warnings:

  - You are about to drop the `_TaskToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_TaskToUser` DROP FOREIGN KEY `_TaskToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TaskToUser` DROP FOREIGN KEY `_TaskToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `created_by` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_TaskToUser`;

-- CreateTable
CREATE TABLE `_TaskAssignees` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TaskAssignees_AB_unique`(`A`, `B`),
    INDEX `_TaskAssignees_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TaskAssignees` ADD CONSTRAINT `_TaskAssignees_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TaskAssignees` ADD CONSTRAINT `_TaskAssignees_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
