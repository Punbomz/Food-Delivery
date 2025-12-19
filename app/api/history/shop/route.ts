import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const history = await prisma.shopHistory.findMany({
    orderBy: { shopLogin: "desc" },
    include: {
      shop: true,
    },
  });

  return NextResponse.json(history);
}
