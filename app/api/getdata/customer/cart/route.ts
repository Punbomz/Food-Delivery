import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isCartExpired } from "@/lib/cart";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const customerID = Number(cookieStore.get("customerId")?.value);

    if (!customerID) {
      return NextResponse.json(
        { cart: null },
        { status: 200 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        customerID,
      },
      include: {
        shop: {
          select: {
            shopID: true,
            shopName: true,
          },
        },
        items: {
          include: {
            food: {
              select: {
                foodID: true,
                foodName: true,
                foodPic: true,
              },
            },
            options: {
              include: {
                option: {
                  select: {
                    opID: true,
                    opName: true,
                    optionGroup: {
                      select: {
                        ogID: true,
                        ogName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (cart && isCartExpired(cart.updatedAt)) {
      await prisma.cartItem.deleteMany({
        where: { cartID: cart.cartID },
      });

      await prisma.cart.delete({
        where: { cartID: cart.cartID },
      });

      return Response.json({ cart: null });
    }

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}