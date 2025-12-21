import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const data: any = {
    shopName: formData.get("Name") as string,
    shopLocation: formData.get("Location") as string,
    shopFname: formData.get("Fname") as string,
    shopLname: formData.get("Lname") as string,
    shopEmail: formData.get("Email") as string,
    shopPhone: formData.get("Phone") as string,
    shopOpenTime: formData.get("Open") as string,
    shopCloseTime: formData.get("Close") as string,
  };

  const shopId = Number(formData.get("id"));

  const oldEmail = formData.get("oldEmail");
  if (data.shopEmail !== oldEmail) {
    // Check email
    const existingShop = await prisma.shop.findUnique({
      where: { shopEmail: data.shopEmail },
    });
  
    if (existingShop) {
      return NextResponse.json(
        { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
        { status: 409 }
      );
    }
  }

  let oldPic: string | null = null;
  let oldQR: string | null = null;
  const old = await prisma.shop.findUnique({
    where: { shopID: shopId },
  });

  if (!old) {
    return NextResponse.json(
      { message: "ไม่พบร้านค้า" },
      { status: 404 }
    );
  }

  oldPic = old.shopPic;
  oldQR = old.shopQR;

  // Profil Pic
  const picFile = formData.get("Pic") as File | null;
  let profileUrl = "";
  let shopPic: string | null = null;
  if (picFile && picFile.size > 0) {
    if(oldPic) del(oldPic);

    const fileExtension = picFile.name.substring(picFile.name.lastIndexOf('.'));
    const fileNameWithoutExt = picFile.name.substring(0, picFile.name.lastIndexOf('.'));
    
    shopPic = fileNameWithoutExt + "-" + Date.now().toString() + fileExtension;
    
    const blob = await put('Profile/' + shopPic, picFile, {
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

  // QR Pic
  const qrFile = formData.get("QR") as File | null;
  let qrUrl = "";
  let qrPic: string | null = null;
  if (qrFile && qrFile.size > 0) {
    if(oldQR) del(oldQR);
    const fileExtension = qrFile.name.substring(qrFile.name.lastIndexOf('.'));
    const fileNameWithoutExt = qrFile.name.substring(0, qrFile.name.lastIndexOf('.'));
    
    qrPic = fileNameWithoutExt + "-" + Date.now().toString() + fileExtension;
    
    const blob = await put('QR/' + qrPic, qrFile, {
      access: 'public',
    });
    qrUrl = blob.url;

    if(!blob) {
      await del(profileUrl);
      return NextResponse.json(
          {message: "Upload QR code error!"},
          { status: 201 }
      );
    }
  }

  if (profileUrl && profileUrl !== "") {
    data.shopPic = profileUrl;
  }

  if (qrUrl && qrUrl !== "") {
    data.shopQR = qrUrl;
  }

  try {
    await prisma.shop.update({
      where: { shopID: shopId },
      data,
    });
  } catch (error) {
      return NextResponse.json(
          { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว!" },
          { status: 409 }
      );
  }

    return NextResponse.json(
        null,
        { status: 201 }
    );
}
