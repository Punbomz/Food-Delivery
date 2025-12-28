import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";
import { put, del } from "@vercel/blob"

export async function POST(request: Request) {
    const formData = await request.formData();
    const id = Number(formData.get("id"));

    const Options = JSON.parse(
        formData.get("Options") as string
        ) as number[];

    try {
        const result = await getCurrentUser();
        
        if (!result) {
            return NextResponse.json(
            { user: null, authenticated: false },
            { status: 401 }
            );
        }
    
        const [user, role] = result;

        const oldFood = await prisma.food.findUnique({
            where: {
                foodID: id,
            },
        })

        const picFile = formData.get("Pic") as File | null;
        let picUrl = "";
        let foodPic: string | null = null;
        if (picFile && picFile.size > 0) {
            const fileExtension = picFile.name.substring(picFile.name.lastIndexOf('.'));
            const fileNameWithoutExt = picFile.name.substring(0, picFile.name.lastIndexOf('.'));
            
            foodPic = fileNameWithoutExt + "-" + Date.now().toString() + fileExtension;
            
            const blob = await put('Food/' + foodPic, picFile, {
            access: 'public',
            });
            picUrl = blob.url;

            if(!blob) {
            return NextResponse.json(
                {message: "Upload food picture error!"},
                { status: 201 }
            );
            }

            if(oldFood?.foodPic) {
                await del(oldFood?.foodPic);
            }
        } else {
            picUrl = oldFood?.foodPic as string;
        }

        await prisma.food.update({
            where: {
                foodID: id,
            },
            data: {
                foodPic: picUrl,
                foodName: formData.get("Name") as string,
                foodDetails: formData.get("Details") as string,
                foodPrice: Number(formData.get("Price")),
                foodGenreID: Number(formData.get("Genre")),
                foodOptions: Options,
            },
        })
    } catch(error) {
        return NextResponse.json(
            null,
            { status: 401 }
        )
    }

    return NextResponse.json(
        null,
        { status: 201 }
    );
}
