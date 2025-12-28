import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";

export async function POST(request: Request) {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
        return NextResponse.json(
        { message: "Invalid food id" },
        { status: 400 }
        );
    }

    try {
        const food = await prisma.food.findFirst({
            where: { foodID: id },
        });

        return NextResponse.json(food, { status: 200 });

    } catch (error) {
        console.error("Fetch food data error:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
}
