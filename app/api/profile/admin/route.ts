import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const adminId = cookieStore.get("cadminId")?.value;

  if (!adminId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { adminID: Number(adminId) },
    select: {
      adminUsername: true,
      adminEmail: true,
    },
  });

  if (!admin) {
    return NextResponse.json(
      { message: "Admin not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(admin);
}
