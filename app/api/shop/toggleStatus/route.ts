import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    const status = body.status;

    if (!id) {
      return NextResponse.json(
        { message: "Invalid shop id" },
        { status: 400 }
      );
    }

    const updateStatus = await prisma.shop.update({
        where: {
            shopID: id,
        },
        data: {
            shopOpen: status,
        },
    })

    if (!updateStatus) {
      return NextResponse.json(
        { message: "Open/Close Error" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Open/Close error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}