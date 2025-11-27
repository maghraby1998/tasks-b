/*
  Warnings:

  - You are about to drop the `ProjectUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProjectUser` DROP FOREIGN KEY `ProjectUser_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectUser` DROP FOREIGN KEY `ProjectUser_userId_fkey`;

-- DropTable
DROP TABLE `ProjectUser`;

-- CreateTable
CREATE TABLE `_UserProjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserProjects_AB_unique`(`A`, `B`),
    INDEX `_UserProjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserProjects` ADD CONSTRAINT `_UserProjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserProjects` ADD CONSTRAINT `_UserProjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
