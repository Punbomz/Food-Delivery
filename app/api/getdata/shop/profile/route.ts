import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid shop id" },
        { status: 400 }
      );
    }

    const user = await prisma.shop.findUnique({
      where: {
        shopID: id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch shop data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}