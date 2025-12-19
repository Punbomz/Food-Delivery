import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const history = await prisma.history.findMany({
    orderBy: { login: "desc" },
    include: {
      shop: true,
    },
  });

  return NextResponse.json(history);
}
