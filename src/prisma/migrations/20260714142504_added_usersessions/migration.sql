-- CreateTable
CREATE TABLE "UserSessions" (
    "sessionId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSessions_refreshTokenHash_key" ON "UserSessions"("refreshTokenHash");
