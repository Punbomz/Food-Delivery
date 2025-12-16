import { clearSession } from "@/lib/loginHelper";
import { NextResponse } from "next/server";

export async function POST() {
  try {
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