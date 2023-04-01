-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_from_fkey` FOREIGN KEY (`from`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_to_fkey` FOREIGN KEY (`to`) REFERENCES `users`(`walletAddress`) ON DELETE RESTRICT ON UPDATE CASCADE;
