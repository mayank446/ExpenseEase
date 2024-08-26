/*
  Warnings:

  - You are about to drop the column `fromId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `borrowerId` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lenderId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_toId_fkey";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "fromId",
DROP COLUMN "toId",
ADD COLUMN     "borrowerId" INTEGER NOT NULL,
ADD COLUMN     "lenderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "Members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
