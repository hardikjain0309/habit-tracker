/*
  Warnings:

  - You are about to drop the column `revokedAt` on the `UserSessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSessions" DROP COLUMN "revokedAt";
