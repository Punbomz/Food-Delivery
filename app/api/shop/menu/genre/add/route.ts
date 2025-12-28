import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";

export async function POST(request: Request) {
    const formData = await request.formData();

    try {
        const result = await getCurrentUser();
        
        if (!result) {
            return NextResponse.json(
            { user: null, authenticated: false },
            { status: 401 }
            );
        }
    
        const [user, role] = result;

        const name = await prisma.foodGenre.findFirst({
            where: {
                fGenreName: formData.get("Name") as string,
                shopID: user.id,
            }
        })
        
        if(name) {
            return NextResponse.json(
                null,
                { status: 409 }
            );
        }

        await prisma.foodGenre.create({
            data: {
            shopID: user.id,
            fGenreName: formData.get("Name") as string,
            },
        });
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
