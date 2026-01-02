import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const shop = await prisma.shop.findMany();

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    if(token) {
      return NextResponse.json(
        { shop: shop, token: true},
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { shop: shop, token: false},
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Fetch shop data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}