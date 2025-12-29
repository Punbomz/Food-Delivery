import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const customerId = cookieStore.get("customerId")?.value;
  
    if (!customerId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
  
    const customer = await prisma.customer.findUnique({
      where: { customerID: Number(customerId) },
      select: {
        customerPic: true,
        customerFname: true,
        customerLname: true,
        customerEmail: true,
        customerPhone: true,
      },
    });
  
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
