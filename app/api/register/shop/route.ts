import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { put } from "@vercel/blob"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = formData.get("Email") as string;

  // Check email
  const existingShop = await prisma.shop.findUnique({
    where: { shopEmail: email },
  });

  if (existingShop) {
    return NextResponse.json(
      { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
      { status: 409 }
    );
  }

  // Encrypt password
  const password = formData.get("Pass") as string;
  const hashedPassword = await bcrypt.hash(password, 10);


  const picFile = formData.get("Pic") as File | null;

  let shopPic: string | null = null;

  if (picFile && picFile.size > 0) {
    const fileExtension = picFile.name.substring(picFile.name.lastIndexOf('.'));
    const fileNameWithoutExt = picFile.name.substring(0, picFile.name.lastIndexOf('.'));
    
    shopPic = fileNameWithoutExt + "-" + Date.now().toString() + fileExtension;
    
    const blob = await put('Profile/' + shopPic, picFile, {
      access: 'public',
    });
  }

  try {
    await prisma.shop.create({
        data: {
        shopPic,
        shopName: formData.get("Name") as string,
        shopLocation: formData.get("Location") as string,
        shopFname: formData.get("Fname") as string,
        shopLname: formData.get("Lname") as string,
        shopGender: formData.get("Gender") as string,
        shopEmail: formData.get("Email") as string,
        shopPhone: formData.get("Phone") as string,
        shopPass: hashedPassword,
        },
    });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
                { status: 409 }
            );
        }
    }

    return NextResponse.json(
        null,
        { status: 201 }
    );
}
