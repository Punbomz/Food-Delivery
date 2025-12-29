import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role === "shop") {
    const id = Number(cookieStore.get("shopId")?.value);
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const history = await prisma.shopHistory.findMany({
      orderBy: { shopLogin: "desc" },
      include: {
        shop: true,
      },
    });

    return NextResponse.json(history);

  } else if (role === "customer") {
    const id = Number(cookieStore.get("customerId")?.value);

    const history = await prisma.customerHistory.findMany({
      orderBy: { customerLogin: "desc" },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(history);
  }
}
