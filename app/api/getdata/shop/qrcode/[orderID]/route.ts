import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderID: string }> }
) {
  try {
    const { orderID: orderIDString } = await params;
    const orderID = Number(orderIDString);
    
    console.log("OrderID received:", orderIDString);
    
    if (isNaN(orderID)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderID: orderID,
      },
      select: {
        shopID: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const shop = await prisma.shop.findUnique({
      where: {
        shopID: order.shopID,
      },
      select: {
        shopQR: true,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { qrCodeUrl: shop.shopQR },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch QR Code error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}