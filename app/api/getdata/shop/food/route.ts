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

    const fgenre = await prisma.foodGenre.findMany({
      where: {
        shopID: id,
      },
    });

    if (!fgenre) {
      return NextResponse.json(
        { message: "Genre not found" },
        { status: 404 }
      );
    }

    const food = await prisma.food.findMany({
      where: {
        shopID: id,
      },
    });

    if (!food) {
      return NextResponse.json(
        { message: "Food not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { food, fgenre },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch food data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}