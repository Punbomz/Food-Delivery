import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";

export async function POST(request: Request) {
  try {
    const result = await getCurrentUser();
        
    if (!result) {
        return NextResponse.json(
        { user: null, authenticated: false },
        { status: 401 }
        );
    }
    
    const [user, role] = result;

    const fgenre = await prisma.foodGenre.findMany({
      where: {
        shopID: user.id,
      },
    });

    if (!fgenre) {
      return NextResponse.json(
        { message: "Genre not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { fgenre },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch Genre data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}