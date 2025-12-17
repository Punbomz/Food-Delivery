-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "shopID" INTEGER NOT NULL,
    "login" TIMESTAMP(3) NOT NULL,
    "logout" TIMESTAMP(3),

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE RESTRICT ON UPDATE CASCADE;
