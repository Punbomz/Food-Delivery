import { clearSession } from "@/lib/loginHelper";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const role = cookieStore.get("role")?.value;

    if(role === "shop") {
      if (token) {
        const session = await prisma.shopHistory.findFirst({
          where: {
            shopLogout: { equals: null },
          },
          orderBy: {
            shopLogin: "desc",
          },
        });

        if (session?.shopID) {
          await prisma.shopHistory.updateMany({
            where: {
              shopID: session.shopID,
              shopLogout: { equals: null },
            },
            data: {
              shopLogout: new Date(),
            },
          });
        }
      }
    } else if(role === "customer") {
      if (token) {
        const session = await prisma.customerHistory.findFirst({
          where: {
            customerLogout: { equals: null },
          },
          orderBy: {
            customerLogin: "desc",
          },
        });

        if (session?.customerID) {
          await prisma.customerHistory.updateMany({
            where: {
              customerID: session.customerID,
              customerLogout: { equals: null },
            },
            data: {
              customerLogout: new Date(),
            },
          });

          const cart = await prisma.cart.findUnique({
            where: { customerID: session.customerID },
          });
          if (cart) {
            await prisma.cartItem.deleteMany({
              where: { cartID: cart.cartID },
            });
          }
        }
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