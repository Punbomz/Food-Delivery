import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ shopId: string; foodId: string }> }
) {
  const { foodId } = await context.params;
  const id = Number(foodId);

  if (isNaN(id)) {
    return NextResponse.json(
      { message: "Invalid foodId" },
      { status: 400 }
    );
  }

  const food = await prisma.food.findUnique({
    where: { foodID: id },
    include: {
      foodOptionGroups: {
        include: {
          optionGroup: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });

  if (!food) {
    return NextResponse.json(
      { message: "Food not found" },
      { status: 404 }
    );
  }

  const result = {
    foodID: food.foodID,
    foodName: food.foodName,
    foodDetails: food.foodDetails,
    foodPrice: food.foodPrice,
    foodPic: food.foodPic,
    optionGroups: food.foodOptionGroups.map((fog) => fog.optionGroup),
  };

  return NextResponse.json(result);
}
