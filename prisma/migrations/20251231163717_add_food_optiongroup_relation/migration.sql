-- CreateTable
CREATE TABLE "_FoodToOptionGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FoodToOptionGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FoodToOptionGroup_B_index" ON "_FoodToOptionGroup"("B");

-- AddForeignKey
ALTER TABLE "_FoodToOptionGroup" ADD CONSTRAINT "_FoodToOptionGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("foodID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToOptionGroup" ADD CONSTRAINT "_FoodToOptionGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "OptionGroup"("ogID") ON DELETE CASCADE ON UPDATE CASCADE;
