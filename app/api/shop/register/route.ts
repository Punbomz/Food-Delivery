import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { Pic, Name, Location, Fname, Lname, Gender, Email, Phone, Pass } = await request.json();
    const shop = await prisma.shop.create({
    data: {
        shopPic: Pic,
        shopName: Name,
        shopLocation: Location,
        shopFname: Fname,
        shopLname: Lname,
        shopGender: Gender,
        shopEmail: Email,
        shopPhone: Phone,
        shopPass: Pass,
    },
    include: {
      posts: true,
    },
  })
  console.log('Created user:', shop)
    return new Response(JSON.stringify(shop), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}