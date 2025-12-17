import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const history = await prisma.usageHistory.findMany({
    orderBy: { checkIn: "desc" },
    include: { user: true },
  });

  return NextResponse.json(history);
}