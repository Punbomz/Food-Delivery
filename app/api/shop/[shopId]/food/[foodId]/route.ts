import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { shopId: string; foodId: string } }) {
  const foodId = parseInt(params.foodId);

  const food = await prisma.food.findUnique({
    where: { foodID: foodId },
    select: {
      foodID: true,
      foodName: true,
      foodDetails: true,
      foodPrice: true,
      foodPic: true,
      optionGroups: {
        select: {
          ogID: true,
          ogName: true,
          ogMultiple: true,
          ogForce: true,
          option: { select: { opID: true, opName: true, opPrice: true } },
        },
      },
    },
  });

  if (!food) return NextResponse.json({ message: "Food not found" }, { status: 404 });

  return NextResponse.json(food);
}
