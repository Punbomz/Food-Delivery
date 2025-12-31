import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shopId } = req.query;
  if (!shopId || typeof shopId !== "string") return res.status(400).json({ message: "Invalid shopId" });

  const shop = await prisma.shop.findUnique({
    where: { shopID: parseInt(shopId) },
    select: {
      shopName: true,
      shopPic: true,
      shopOpen: true,
      foods: {
        where: { foodStatus: true },
        select: {
          foodID: true,
          foodName: true,
          foodDetails: true,
          foodPrice: true,
          foodPic: true,
          genre: { select: { fGenreName: true } },
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
      },
    },
  });

  if (!shop) return res.status(404).json({ message: "Shop not found" });

  // Group foods by category
  const categories: Record<string, any[]> = {};
  shop.foods.forEach((food) => {
    const catName = food.genre?.fGenreName || "อื่น ๆ";
    if (!categories[catName]) categories[catName] = [];
    categories[catName].push(food);
  });

  res.json({
    shopName: shop.shopName,
    shopPic: shop.shopPic,
    shopOpen: shop.shopOpen,
    categories: Object.entries(categories).map(([categoryName, foods]) => ({ categoryName, foods })),
  });
}
