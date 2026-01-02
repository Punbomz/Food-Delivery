-- CreateTable
CREATE TABLE "Cart" (
    "cartID" SERIAL NOT NULL,
    "customerID" INTEGER NOT NULL,
    "shopID" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartID")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "cartItemID" SERIAL NOT NULL,
    "cartID" INTEGER NOT NULL,
    "foodID" INTEGER NOT NULL,
    "cartItemQuantity" INTEGER NOT NULL,
    "cartItemNote" TEXT,
    "foodPriceSnapshot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cartItemID")
);

-- CreateTable
CREATE TABLE "CartItemOption" (
    "cartItemOptionID" SERIAL NOT NULL,
    "cartItemID" INTEGER NOT NULL,
    "optionID" INTEGER NOT NULL,
    "optionPriceSnapshot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CartItemOption_pkey" PRIMARY KEY ("cartItemOptionID")
);

-- CreateIndex
CREATE INDEX "Cart_customerID_idx" ON "Cart"("customerID");

-- CreateIndex
CREATE INDEX "Cart_shopID_idx" ON "Cart"("shopID");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customerID_shopID_key" ON "Cart"("customerID", "shopID");

-- CreateIndex
CREATE INDEX "CartItem_cartID_idx" ON "CartItem"("cartID");

-- CreateIndex
CREATE INDEX "CartItem_foodID_idx" ON "CartItem"("foodID");

-- CreateIndex
CREATE UNIQUE INDEX "CartItemOption_cartItemID_optionID_key" ON "CartItemOption"("cartItemID", "optionID");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer"("customerID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartID_fkey" FOREIGN KEY ("cartID") REFERENCES "Cart"("cartID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_foodID_fkey" FOREIGN KEY ("foodID") REFERENCES "Food"("foodID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemOption" ADD CONSTRAINT "CartItemOption_cartItemID_fkey" FOREIGN KEY ("cartItemID") REFERENCES "CartItem"("cartItemID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemOption" ADD CONSTRAINT "CartItemOption_optionID_fkey" FOREIGN KEY ("optionID") REFERENCES "Option"("opID") ON DELETE RESTRICT ON UPDATE CASCADE;
