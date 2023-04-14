-- CreateTable
CREATE TABLE `users` (
    `walletAddress` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_walletAddress_key`(`walletAddress`),
    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`walletAddress`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contents` (
    `id` INTEGER NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `pHash` VARCHAR(191) NOT NULL,
    `IPFSAddress` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `fieldOfUse` VARCHAR(191) NOT NULL,
    `price` BIGINT NOT NULL,
    `publishDate` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `contents_id_key`(`id`),
    UNIQUE INDEX `contents_pHash_key`(`pHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionHash` VARCHAR(191) NOT NULL,
    `contentId` INTEGER NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL DEFAULT '',
    `price` BIGINT NOT NULL DEFAULT 0,
    `lastPrice` BIGINT NOT NULL DEFAULT 0,
    `timestamp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `events_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agreements` (
    `id` INTEGER NOT NULL,
    `licensee` VARCHAR(191) NOT NULL,
    `licenser` VARCHAR(191) NOT NULL,
    `contentId` INTEGER NOT NULL,
    `purposeOfUse` VARCHAR(191) NOT NULL,
    `fieldOfUse` VARCHAR(191) NOT NULL,
    `price` BIGINT NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `agreements_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requests` (
    `id` INTEGER NOT NULL,
    `licensee` VARCHAR(191) NOT NULL,
    `contentId` INTEGER NOT NULL,
    `purposeOfUse` VARCHAR(191) NOT NULL,
    `fieldOfUse` VARCHAR(191) NOT NULL,
    `price` BIGINT NOT NULL,
    `requestType` VARCHAR(191) NOT NULL,
    `rejectReason` VARCHAR(191) NOT NULL DEFAULT '',
    `timestamp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `requests_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requestEvents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionHash` VARCHAR(191) NOT NULL,
    `requestId` INTEGER NOT NULL,
    `requestType` VARCHAR(191) NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `requestEvents_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transferEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionHash` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `price` BIGINT NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `transferEvent_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contents` ADD CONSTRAINT `contents_ownerAddress_fkey` FOREIGN KEY (`ownerAddress`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_from_fkey` FOREIGN KEY (`from`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_to_fkey` FOREIGN KEY (`to`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_licenser_fkey` FOREIGN KEY (`licenser`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_licensee_fkey` FOREIGN KEY (`licensee`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `requests_licensee_fkey` FOREIGN KEY (`licensee`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `requests_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requestEvents` ADD CONSTRAINT `requestEvents_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
