-- AlterTable
ALTER TABLE `agreements` MODIFY `price` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `contents` MODIFY `price` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `events` MODIFY `price` VARCHAR(191) NOT NULL DEFAULT '0',
    MODIFY `lastPrice` VARCHAR(191) NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `requests` MODIFY `price` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transferEvent` MODIFY `price` VARCHAR(191) NOT NULL;
