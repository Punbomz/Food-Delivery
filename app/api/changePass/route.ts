import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const cookieStore = await cookies();

    const id =
      data.role === "shop"
        ? Number(cookieStore.get("shopId")?.value)
        : Number(cookieStore.get("customerId")?.value);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (data.role === "shop") {
      const user = await prisma.shop.findUnique({
        where: { shopID: id },
      });

      if (!user || !user.shopPass) {
        return NextResponse.json(
          { message: "Shop not found" },
          { status: 404 }
        );
      }

      const isMatch = await bcrypt.compare(
        data.oldPassword,
        user.shopPass
      );

      if (!isMatch) {
        return NextResponse.json(
          { message: "รหัสผ่านไม่ถูกต้อง!" },
          { status: 401 }
        );
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      await prisma.shop.update({
        where: { shopID: id },
        data: { shopPass: hashedPassword },
      });
    }

    else if (data.role === "customer") {

      const user = await prisma.customer.findUnique({
        where: { customerID: id },
      });

      if (!user || !user.customerPass) {
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 }
        );
      }

      const isMatch = await bcrypt.compare(
        data.oldPassword,
        user.customerPass
      );

      if (!isMatch) {
        return NextResponse.json(
          { message: "รหัสผ่านไม่ถูกต้อง!" },
          { status: 401 }
        );
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      await prisma.customer.update({
        where: { customerID: id },
        data: { customerPass: hashedPassword },
      });
    }

    else {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "บันทึกข้อมูลสำเร็จ!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("changePass error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
