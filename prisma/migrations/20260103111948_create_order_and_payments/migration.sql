-- CreateTable
CREATE TABLE "Order" (
    "orderID" SERIAL NOT NULL,
    "customerID" INTEGER NOT NULL,
    "shopID" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderID")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderItemID" SERIAL NOT NULL,
    "orderID" INTEGER NOT NULL,
    "foodID" INTEGER NOT NULL,
    "foodNameSnapshot" TEXT NOT NULL,
    "foodPriceSnapshot" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemID")
);

-- CreateTable
CREATE TABLE "OrderItemOption" (
    "id" SERIAL NOT NULL,
    "orderItemID" INTEGER NOT NULL,
    "optionID" INTEGER NOT NULL,
    "optionNameSnapshot" TEXT NOT NULL,
    "optionPriceSnapshot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentID" SERIAL NOT NULL,
    "orderID" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "slipPic" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentID")
);

-- CreateIndex
CREATE INDEX "Order_customerID_idx" ON "Order"("customerID");

-- CreateIndex
CREATE INDEX "Order_shopID_idx" ON "Order"("shopID");

-- CreateIndex
CREATE INDEX "OrderItem_orderID_idx" ON "OrderItem"("orderID");

-- CreateIndex
CREATE INDEX "OrderItem_foodID_idx" ON "OrderItem"("foodID");

-- CreateIndex
CREATE INDEX "OrderItemOption_orderItemID_idx" ON "OrderItemOption"("orderItemID");

-- CreateIndex
CREATE INDEX "OrderItemOption_optionID_idx" ON "OrderItemOption"("optionID");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderID_key" ON "Payment"("orderID");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer"("customerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("orderID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_foodID_fkey" FOREIGN KEY ("foodID") REFERENCES "Food"("foodID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemOption" ADD CONSTRAINT "OrderItemOption_orderItemID_fkey" FOREIGN KEY ("orderItemID") REFERENCES "OrderItem"("orderItemID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemOption" ADD CONSTRAINT "OrderItemOption_optionID_fkey" FOREIGN KEY ("optionID") REFERENCES "Option"("opID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("orderID") ON DELETE CASCADE ON UPDATE CASCADE;
