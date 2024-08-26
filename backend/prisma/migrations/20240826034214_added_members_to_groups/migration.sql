-- CreateTable
CREATE TABLE "_userGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userGroups_AB_unique" ON "_userGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_userGroups_B_index" ON "_userGroups"("B");

-- AddForeignKey
ALTER TABLE "_userGroups" ADD CONSTRAINT "_userGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userGroups" ADD CONSTRAINT "_userGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
