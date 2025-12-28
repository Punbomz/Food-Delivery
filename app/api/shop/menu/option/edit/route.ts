import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/loginHelper";
import { format } from "path";

export async function POST(request: Request) {
    const formData = await request.formData();

    const id = Number(formData.get("id"));

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

        const opGroup = await prisma.optionGroup.update({
            where: {
                ogID: id,
            },
            data: ogData,
        });

        await prisma.option.deleteMany({ where: { ogID: id } });

        await prisma.option.createMany({
            data: subOptions.map(op => ({
                ogID: id,
                opName: op.name,
                opPrice: op.price,
            }))
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
