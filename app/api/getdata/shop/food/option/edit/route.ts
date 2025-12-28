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

    const opGroup = await prisma.optionGroup.findUnique({
      where: { ogID: id },
    });

    const options = await prisma.option.findMany({
        where: {
            ogID: id,
        },
    });

    const result = {
        ogID: opGroup?.ogID,
        ogName: opGroup?.ogName,
        ogForce: opGroup?.ogForce,
        ogMultiple: opGroup?.ogMultiple,
        options: options,
    }
    
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Fetch options data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
