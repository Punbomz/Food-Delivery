-- CreateTable
CREATE TABLE "CustomerHistory" (
    "customerHistoryID" SERIAL NOT NULL,
    "customerID" INTEGER NOT NULL,
    "customerLogin" TIMESTAMP(3) NOT NULL,
    "customerLogout" TIMESTAMP(3),

    CONSTRAINT "CustomerHistory_pkey" PRIMARY KEY ("customerHistoryID")
);

-- AddForeignKey
ALTER TABLE "CustomerHistory" ADD CONSTRAINT "CustomerHistory_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer"("customerID") ON DELETE RESTRICT ON UPDATE CASCADE;
