import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  const formData = await request.formData();
  const Email = formData.get("Email") as string;
  const Pass = formData.get("Pass") as string;
  const Remember = formData.get("Remember") === "on";

  const customer = await prisma.customer.findUnique({
    where: { customerEmail: Email },
  });

  if (!customer) {
    return Response.json(
      { message: "ไม่พบผู้ใช้!" },
      { status: 401 }
    );
  }

  // Compare Password
  const isMatch = await bcrypt.compare(Pass, customer.customerPass);

  if (!isMatch) {
    return Response.json(
      { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง!" },
      { status: 401 }
    );
  }

  // Create token
  const token = randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + (Remember ? 30 : 1) // Remember = 30 Days, else 1 Day
  );

  await prisma.session.create({
    data: {
      token,
      customerId: customer.customerID,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  // Set session cookie
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  // Set role cookie for middleware
  cookieStore.set("role", "customer", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return Response.json(
    { message: "เข้าสู่ระบบสำเร็จ!" },
    { status: 200 }
  );
}
