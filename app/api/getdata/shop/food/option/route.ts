import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";

export async function POST(request: Request) {
  try {
    const result = await getCurrentUser();
            
    if (!result) {
        return NextResponse.json(
        { user: null, authenticated: false },
        { status: 401 }
        );
    }
    
    const [user, role] = result;

    const opGroup = await prisma.optionGroup.findMany({
      where: { shopID: user.id },
    });

    const data = await Promise.all(
      opGroup.map(async (item) => {
        const ogFood = await prisma.food.count({
          where: {
            shopID: user.id,
            foodOptions: {
                hasSome: [Number(item.ogID)],
            },
          },
        });

        const options = await prisma.option.findMany({
          where: {
            ogID: item.ogID,
          },
        });

        return {
          ogID: item.ogID,
          ogName: item.ogName,
          ogFood,
          ogItem: options,
        };
      })
    );

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Fetch options data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
