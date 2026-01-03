import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const formData = await request.formData();

    const orderID = Number(formData.get("OrderID"));

    // Slip Pic
    const slipFile = formData.get("Slip") as File | null;
    let slipUrl = "";
    let slipPic: string | null = null;
    if (slipFile && slipFile.size > 0) {
        const fileExtension = slipFile.name.substring(slipFile.name.lastIndexOf('.'));
        const fileNameWithoutExt = slipFile.name.substring(0, slipFile.name.lastIndexOf('.'));
        
        slipPic = fileNameWithoutExt + "-" + Date.now().toString() + fileExtension;

        const blob = await put('Payments/' + slipPic, slipFile, {
            access: 'public',
        });
        slipUrl = blob.url;

        if(!blob) {
        return NextResponse.json(
            {message: "Upload slip picture error!"},
            { status: 201 }
        );
        }
    }

    try {
        await prisma.payment.update({
            where: { orderID },
            data: {
                slipPic: slipUrl,
            },
        });

        await prisma.order.update({
            where: { orderID },
            data: {
                status: "รอยืนยันการชำระเงิน",
            },
        });
        } catch (error: any) {
            return NextResponse.json(
                { message: "อัพโหลดสลิปไม่สำเร็จ!" },
                { status: 401 }
            );
        }

    return NextResponse.json(
        { message: "อัพโหลดสลิปสำเร็จ!" },
        { status: 200 }
    );
}
