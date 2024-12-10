/*
  Warnings:

  - You are about to drop the column `memberId` on the `Groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_memberId_fkey";

-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "memberId";

-- CreateTable
CREATE TABLE "_MemberGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MemberGroups_AB_unique" ON "_MemberGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberGroups_B_index" ON "_MemberGroups"("B");

-- AddForeignKey
ALTER TABLE "_MemberGroups" ADD CONSTRAINT "_MemberGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberGroups" ADD CONSTRAINT "_MemberGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
