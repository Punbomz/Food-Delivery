import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  let user;

  if(data.role === "shop") {
    user = await prisma.shop.findUnique({
        where: { shopID: data.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(data.oldPassword, user.shopPass);

    if (!isMatch) {
        return Response.json(
        { message: "รหัสผ่านไม่ถูกต้อง!" },
        { status: 401 }
        );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    try {
    await prisma.shop.update({
      where: { shopID: data.id },
      data: {
        shopPass: hashedPassword,
      },
    });
    } catch (error) {
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง!" },
            { status: 409 }
        );
    }
  }

  return Response.json(
    { message: "บันทึกข้อมูลสำเร็จ!" },
    { status: 200 }
  );
}
