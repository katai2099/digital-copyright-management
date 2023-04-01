/*
  Warnings:

  - Added the required column `transactionHash` to the `agreements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agreements` ADD COLUMN `transactionHash` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
