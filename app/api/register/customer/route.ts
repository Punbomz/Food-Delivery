import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { put, del } from "@vercel/blob"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = (formData.get("Email") as string).toLowerCase();

  // Check email
  const existingCustomer = await prisma.customer.findUnique({
    where: { customerEmail: email },
  });

  if (existingCustomer) {
    return NextResponse.json(
      { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
      { status: 409 }
    );
  }

  // Encrypt password
  const password = formData.get("Pass") as string;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Profil Pic
  const picFile = formData.get("Pic") as File | null;
  let profileUrl = "";
  let customerPic: string | null = null;
  if (picFile && picFile.size > 0) {
    const fileExtension = picFile.name.substring(picFile.name.lastIndexOf('.'));
    const fileNameWithoutExt = picFile.name.substring(0, picFile.name.lastIndexOf('.'));
    
    customerPic = fileNameWithoutExt + "-" + Date.now().toString() + fileExtension;
    
    const blob = await put('Profile/' + customerPic, picFile, {
      access: 'public',
    });
    profileUrl = blob.url;

    if(!blob) {
      return NextResponse.json(
          {message: "Upload profile picture error!"},
          { status: 201 }
      );
    }
  }

  try {
    await prisma.customer.create({
        data: {
        customerPic: profileUrl,
        customerFname: formData.get("Fname") as string,
        customerLname: formData.get("Lname") as string,
        customerGender: formData.get("Gender") as string,
        customerEmail: formData.get("Email") as string,
        customerPhone: formData.get("Phone") as string,
        customerPass: hashedPassword,
        },
    });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
                { status: 409 }
            );
        } else {
          return NextResponse.json(
            { message: "สมัครสมาชิกไม่สำเร็จ!" },
            { status: 401 }
          );
        }
    }

    return NextResponse.json(
        null,
        { status: 201 }
    );
}
