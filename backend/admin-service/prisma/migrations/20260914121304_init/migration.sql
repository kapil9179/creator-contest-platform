-- CreateEnum
CREATE TYPE "PrizeTier" AS ENUM ('GRAND_PRIZE', 'CONSISTENCY_FIRST', 'CONSISTENCY_SECOND', 'TOP_PERFORMER', 'CATEGORY_FIRST', 'CATEGORY_SECOND');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_REQUESTED', 'REQUESTED', 'PASSED', 'FAILED');

-- CreateTable
CREATE TABLE "Winner" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "PrizeTier" NOT NULL,
    "category" TEXT,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Winner_userId_key" ON "Winner"("userId");

-- CreateIndex
CREATE INDEX "Winner_tier_idx" ON "Winner"("tier");

-- CreateIndex
CREATE INDEX "Winner_kycStatus_idx" ON "Winner"("kycStatus");
