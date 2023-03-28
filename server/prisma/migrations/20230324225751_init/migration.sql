-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `walletAddress` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` INTEGER NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `pHash` VARCHAR(191) NOT NULL,
    `IPFSAddress` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `ownerEmail` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `publishDate` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Image_contentId_key`(`contentId`),
    UNIQUE INDEX `Image_pHash_key`(`pHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Audio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` INTEGER NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `pHash` VARCHAR(191) NOT NULL,
    `IPFSAddress` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `ownerEmail` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `publishDate` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Audio_contentId_key`(`contentId`),
    UNIQUE INDEX `Audio_pHash_key`(`pHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Text` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` INTEGER NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `pHash` VARCHAR(191) NOT NULL,
    `IPFSAddress` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `ownerEmail` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `publishDate` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Text_contentId_key`(`contentId`),
    UNIQUE INDEX `Text_pHash_key`(`pHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
