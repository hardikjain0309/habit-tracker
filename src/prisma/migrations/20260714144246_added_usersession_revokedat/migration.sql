/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `UserSessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserSessions" ADD COLUMN     "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "UserSessions_sessionId_key" ON "UserSessions"("sessionId");
