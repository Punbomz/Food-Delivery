import { clearSession } from "@/lib/loginHelper";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!token) {
      const session = await prisma.session.findUnique({
        where: { token },
      });

      if (session) {  
        await prisma.history.updateMany({
          where: { shopId: session.shopId, logout: null },
          data: { logout: new Date() },
        });
      }
    }
    
    // Clear session from database and cookies
    await clearSession();
    
    return NextResponse.json(
      { 
        message: "ออกจากระบบสำเร็จ!",
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { 
        message: "เกิดข้อผิดพลาดในการออกจากระบบ",
        success: false 
      },
      { status: 500 }
    );
  }
}

// For simple logout links
export async function GET() {
  return POST();
}