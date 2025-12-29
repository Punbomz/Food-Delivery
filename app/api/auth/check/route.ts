import { getCurrentUser } from "@/lib/loginHelper";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 401 }
      );
    }

    const [user, role] = result;
    let pic = "";
    
    if(role === "shop") {
      const shopUser = await prisma.shop.findUnique({
        where: { shopID: user.id },
      });
      pic = shopUser?.shopPic ?? "";
    } else if(role === "customer") {
      const customerUser = await prisma.customer.findUnique({
        where: { customerID: user.id },
      });
      pic = customerUser?.customerPic ?? "";
    }

    return NextResponse.json(
      { 
        user: {
          ...user,
          role,
          pic,
        },
        authenticated: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { user: null, authenticated: false },
      { status: 500 }
    );
  }
}