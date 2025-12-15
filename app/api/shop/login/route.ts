import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { Email, Pass } = await request.json();

  const shop = await prisma.shop.findUnique({
    where: { shopEmail: Email },
  });

  if (!shop) {
    return Response.json(
      { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  // 🔍 compare password
  const isMatch = await bcrypt.compare(Pass, shop.shopPass);

  if (!isMatch) {
    return Response.json(
      { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  return Response.json(
    { message: "เข้าสู่ระบบสำเร็จ" },
    { status: 200 }
  );
}
