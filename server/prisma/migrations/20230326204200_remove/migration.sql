/*
  Warnings:

  - You are about to drop the `Audio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Text` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Audio`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `Text`;

-- CreateTable
CREATE TABLE `Content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` INTEGER NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `pHash` VARCHAR(191) NOT NULL,
    `IPFSAddress` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `ownerEmail` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `publishDate` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Content_id_key`(`id`),
    UNIQUE INDEX `Content_contentId_key`(`contentId`),
    UNIQUE INDEX `Content_pHash_key`(`pHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
