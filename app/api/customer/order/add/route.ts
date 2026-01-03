import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const customerID = Number(cookieStore.get("customerId")?.value);

    if (!customerID) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { customerID },
      include: {
        items: {
          include: {
            food: {
              select: {
                foodID: true,
                foodName: true,
                foodPrice: true,
              },
            },
            options: {
              include: {
                option: {
                  select: {
                    opID: true,
                    opName: true,
                    opPrice: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate total
    const totalPrice = cart.items.reduce((sum, item) => {
      const optionTotal = item.options.reduce(
        (s, o) => s + o.optionPriceSnapshot,
        0
      );
      return sum + (item.foodPriceSnapshot + optionTotal) * item.cartItemQuantity;
    }, 0);

    // Create order with items and options
    const order = await prisma.order.create({
      data: {
        customerID,
        shopID: cart.shopID,
        totalPrice,
        status: "pending",
        items: {
          create: cart.items.map((item) => ({
            foodID: item.foodID,
            foodNameSnapshot: item.food.foodName,
            foodPriceSnapshot: item.foodPriceSnapshot,
            quantity: item.cartItemQuantity,
            note: item.cartItemNote,
            options: {
              create: item.options.map((opt) => ({
                optionID: opt.optionID,
                optionNameSnapshot: opt.option.opName,
                optionPriceSnapshot: opt.optionPriceSnapshot,
              })),
            },
          })),
        },
        payment: {
          create: {
            amount: totalPrice,
            status: false,
          },
        },
      },
    });

    // Clear cart after creating order
    await prisma.cartItem.deleteMany({
      where: { cartID: cart.cartID },
    });

    await prisma.cart.delete({
      where: { cartID: cart.cartID },
    });

    return NextResponse.json({
      success: true,
      orderID: order.orderID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}