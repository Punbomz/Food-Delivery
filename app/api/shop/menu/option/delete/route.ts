import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid option id" },
        { status: 400 }
      );
    }

    try {
        await prisma.option.deleteMany({
          where: {
            ogID: id,
          },
        });

        await prisma.optionGroup.delete({
            where: {
                ogID: id,
            }
        })
    } catch(error) {
        return NextResponse.json(
        { message: "Delete option error!" },
        { status: 404 }
        );
    }

    return NextResponse.json(
      null,
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete option error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}