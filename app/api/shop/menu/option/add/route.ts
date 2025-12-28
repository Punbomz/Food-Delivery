import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";
import { format } from "path";

export async function POST(request: Request) {
    const formData = await request.formData();

    const subOptions = JSON.parse(
        formData.get("subOptions") as string
    ) as { name: string; price: number }[];

    try {
        const result = await getCurrentUser();
        
        if (!result) {
            return NextResponse.json(
            { user: null, authenticated: false },
            { status: 401 }
            );
        }
    
        const [user, role] = result;

        const ogData = {
            ogName: formData.get("Name") as string,
            ogForce: formData.get("Force") === "true",
            ogMultiple: formData.get("Multiple") === "true",
            shopID: user.id,
        }

        const opGroup = await prisma.optionGroup.create({
            data: ogData,
        });

        const ogID = opGroup.ogID;
        for (const { name, price } of subOptions) {
            await prisma.option.create({
                data: {
                    ogID: ogID,
                    opName: name,
                    opPrice: price,
                },
            })
        }
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
