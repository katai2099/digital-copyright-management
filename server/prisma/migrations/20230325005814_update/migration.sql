/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Audio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Text` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletAddress]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Audio_id_key` ON `Audio`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Image_id_key` ON `Image`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Text_id_key` ON `Text`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_id_key` ON `users`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_walletAddress_key` ON `users`(`walletAddress`);
