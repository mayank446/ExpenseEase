/*
  Warnings:

  - You are about to drop the `Memnbers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Memnbers";

-- CreateTable
CREATE TABLE "Members" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);
