import { getCurrentUser } from "@/lib/loginHelper";
import { NextResponse } from "next/server";

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
    
    return NextResponse.json(
      { 
        user: {
          ...user,
          role
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