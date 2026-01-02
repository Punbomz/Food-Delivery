import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

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

    await prisma.$transaction(async (tx) => {
      const foods = await tx.food.findMany({
        where: {
          foodGenreID: id,
        },
        select: {
          foodID: true,
          foodPic: true,
        },
      });

      if (foods) {
        foods.map(async (food) => (
          await del(food.foodPic)
        ))
      }

      const foodIDs = foods.map(f => f.foodID);

      if (foodIDs.length > 0) {
        await tx.foodOptionGroup.deleteMany({
          where: {
            foodID: { in: foodIDs },
          },
        });
      }

      await tx.food.deleteMany({
        where: {
          foodGenreID: id,
        },
      });

      await tx.foodGenre.delete({
        where: {
          fGenreID: id,
        },
      });
    });

    return NextResponse.json(null, { status: 200 });

  } catch (error: any) {
    console.error("Delete genre error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Genre not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
