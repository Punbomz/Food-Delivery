import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const customerID = Number(cookieStore.get("customerId")?.value);

    if (!customerID) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { shopID, foodID, quantity, note, optionIDs } = await req.json();

    if (!shopID || !foodID || !quantity) {
      return NextResponse.json(
        { message: "Invalid data" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // ดึง food + ราคา
      const food = await tx.food.findUnique({
        where: { foodID },
        select: { foodPrice: true },
      });

      if (!food) {
        throw new Error("Food not found");
      }

      // ดึง option + ราคา (snapshot)
      const options = optionIDs?.length
        ? await tx.option.findMany({
            where: { opID: { in: optionIDs } },
            select: { opID: true, opPrice: true },
          })
        : [];

      // หา / สร้าง cart (1 cart ต่อ shop)
      const cart = await tx.cart.upsert({
        where: {
          customerID_shopID: { customerID, shopID },
        },
        update: {},
        create: {
          customerID,
          shopID,
        },
      });

      // หา cart item เดิม (food เดียวกัน)
      const existingItems = await tx.cartItem.findMany({
        where: {
          cartID: cart.cartID,
          foodID,
        },
        include: {
          options: true,
        },
      });

      const sortedOptionIDs = [...(optionIDs || [])].sort((a, b) => a - b);

      const matchedItem = existingItems.find((item) => {
        const itemOptionIDs = item.options
          .map((o) => o.optionID)
          .sort((a, b) => a - b);

        return (
          itemOptionIDs.length === sortedOptionIDs.length &&
          itemOptionIDs.every((id, i) => id === sortedOptionIDs[i])
        );
      });

      // merge item
      if (matchedItem) {
        await tx.cartItem.update({
          where: { cartItemID: matchedItem.cartItemID },
          data: {
            cartItemQuantity: {
              increment: quantity,
            },
            cartItemNote: note ?? matchedItem.cartItemNote,
          },
        });

        return { merged: true };
      }

      // create cart item ใหม่
      const newItem = await tx.cartItem.create({
        data: {
          cartID: cart.cartID,
          foodID,
          cartItemQuantity: quantity,
          cartItemNote: note,
          foodPriceSnapshot: food.foodPrice,
          options: {
            create: options.map((op) => ({
              optionID: op.opID,
              optionPriceSnapshot: op.opPrice,
            })),
          },
        },
      });

      return { merged: false, cartItemID: newItem.cartItemID };
    });

    return NextResponse.json({
      message: result.merged ? "Merged cart item" : "Added new cart item",
      cartItemID: result.cartItemID,
    });
  } catch (err) {
    console.error("❌ CART ADD ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
