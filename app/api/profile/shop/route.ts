import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const shopId = cookieStore.get("shopId")?.value;

    if (!shopId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const shop = await prisma.shop.findUnique({
      where: { shopID: Number(shopId) },
      select: {
        shopPic: true,
        shopName: true,
        shopLname: true,
        shopEmail: true,
        shopPhone: true,
        shopLocation: true,
        shopQR: true,
        shopOpenTime: true,
        shopCloseTime: true,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(shop);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
