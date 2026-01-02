import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {del} from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid food id" },
        { status: 400 }
      );
    }

    try {
        const food = await prisma.food.findUnique({
            where: {
                foodID: id,
            },
        })

        if(food?.foodPic) {
            await del(food?.foodPic);
        }
        
        await prisma.food.delete({
          where: {
            foodID: id,
          },
        });

        await prisma.foodOptionGroup.deleteMany({
          where: {
            foodID: id,
          },
        })
    } catch(error) {
        return NextResponse.json(
        { message: "Delete food error!" },
        { status: 404 }
        );
    }

    return NextResponse.json(
      null,
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete food error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}