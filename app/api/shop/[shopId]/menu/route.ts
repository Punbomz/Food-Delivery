import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    shopId: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: Params
) {
  const { shopId } = await params;

  const shopIdNum = Number(shopId);
  if (isNaN(shopIdNum)) {
    return NextResponse.json(
      { message: "Invalid shopId" },
      { status: 400 }
    );
  }

  const shop = await prisma.shop.findUnique({
    where: { shopID: shopIdNum },
    include: {
      foods: {
        where: { foodStatus: true },
        include: {
          genre: {
            select: {
              fGenreName: true,
            },
          },
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
      },
    },
  });

  if (!shop) {
    return NextResponse.json(
      { message: "Shop not found" },
      { status: 404 }
    );
  }

  // group foods by genre
  const categories: Record<string, any[]> = {};

  shop.foods.forEach((food) => {
    const categoryName = food.genre?.fGenreName ?? "อื่น ๆ";

    if (!categories[categoryName]) {
      categories[categoryName] = [];
    }

    categories[categoryName].push({
      ...food,
      optionGroups: food.foodOptionGroups.map((fog) => fog.optionGroup),
    });
  });

  return NextResponse.json({
    shopName: shop.shopName,
    shopDetail: shop.shopDetail,
    shopPic: shop.shopPic,
    shopOpen: shop.shopOpen,
    categories: Object.entries(categories).map(
      ([categoryName, foods]) => ({
        categoryName,
        foods,
      })
    ),
  });
}
