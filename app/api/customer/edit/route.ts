import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob"
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const formData = await request.formData();
    const cookieStore = await cookies();

    const id = Number(cookieStore.get("customerId")?.value);

    const data: any = {
        customerFname: formData.get("Fname") as string,
        customerLname: formData.get("Lname") as string,
        customerPhone: formData.get("Phone") as string,
        customerEmail: formData.get("Email") as string,
    };

    const oldEmail = formData.get("oldEmail");

    if (data.customerEmail !== oldEmail) {
        // Check email
        const existingCustomer = await prisma.customer.findUnique({
        where: { customerEmail: data.customerEmail },
        });
    
        if (existingCustomer) {
        return NextResponse.json(
            { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
            { status: 409 }
        );
        }
    }

    let oldPic: string | null = null;
    const old = await prisma.customer.findUnique({
        where: { customerID: id },
    });

    if (!old) {
        return NextResponse.json(
        { message: "ไม่พบผู้ใช้" },
        { status: 404 }
        );
    }

    oldPic = old.customerPic;

    // Profil Pic
    const picFile = formData.get("Pic") as File | null;
    let profileUrl = "";
    let customerPic: string | null = null;
    if (picFile && picFile.size > 0) {
        if(oldPic) del(oldPic);

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

    if (profileUrl && profileUrl !== "") {
        data.customerPic = profileUrl;
    }

    try {
        await prisma.customer.update({
        where: { customerID: id },
        data,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "บันทึกข้อมูลผิดพลาด! กรุณาลองใหม่อีกครั้ง" },
            { status: 409 }
        );
    }

        return NextResponse.json(
            null,
            { status: 201 }
        );
}
