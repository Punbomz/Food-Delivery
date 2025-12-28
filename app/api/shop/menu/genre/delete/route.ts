import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid genre id" },
        { status: 400 }
      );
    }

    try {
        await prisma.foodGenre.delete({
          where: {
            fGenreID: id,
          },
        });
    } catch(error) {
        return NextResponse.json(
        { message: "Genre not found" },
        { status: 404 }
        );
    }

    return NextResponse.json(
      null,
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete genre error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}