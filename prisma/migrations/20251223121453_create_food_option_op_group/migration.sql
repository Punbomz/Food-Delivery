-- CreateTable
CREATE TABLE "Food" (
    "foodID" SERIAL NOT NULL,
    "shopID" INTEGER NOT NULL,
    "foodName" TEXT NOT NULL,
    "foodDetails" TEXT NOT NULL,
    "foodPrice" DOUBLE PRECISION NOT NULL,
    "foodPic" TEXT NOT NULL,
    "foodGenreID" INTEGER NOT NULL,
    "foodStatus" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("foodID")
);

-- CreateTable
CREATE TABLE "FoodGenre" (
    "fGenreID" SERIAL NOT NULL,
    "fGenreName" TEXT NOT NULL,
    "shopID" INTEGER NOT NULL,

    CONSTRAINT "FoodGenre_pkey" PRIMARY KEY ("fGenreID")
);

-- CreateTable
CREATE TABLE "OptionGroup" (
    "ogID" SERIAL NOT NULL,
    "foodID" INTEGER NOT NULL,
    "ogName" TEXT NOT NULL,
    "ogMultiple" BOOLEAN NOT NULL,

    CONSTRAINT "OptionGroup_pkey" PRIMARY KEY ("ogID")
);

-- CreateTable
CREATE TABLE "Option" (
    "opID" SERIAL NOT NULL,
    "ogID" INTEGER NOT NULL,
    "opName" TEXT NOT NULL,
    "opPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("opID")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodGenre" ADD CONSTRAINT "FoodGenre_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionGroup" ADD CONSTRAINT "OptionGroup_foodID_fkey" FOREIGN KEY ("foodID") REFERENCES "Food"("foodID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_ogID_fkey" FOREIGN KEY ("ogID") REFERENCES "OptionGroup"("ogID") ON DELETE RESTRICT ON UPDATE CASCADE;
