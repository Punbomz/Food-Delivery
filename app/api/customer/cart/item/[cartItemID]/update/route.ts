import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ cartItemID: string }> }
) {
  try {
    const params = await context.params;
    const cartItemID = parseInt(params.cartItemID);
    
    const cookieStore = await cookies();
    const customerID = Number(cookieStore.get("customerId")?.value);

    if (!customerID) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quantity, note, optionIDs } = await req.json();

    // Validate
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to customer
    const cartItem = await prisma.cartItem.findUnique({
      where: { cartItemID },
      include: {
        cart: {
          select: { customerID: true }
        },
        food: {
          select: { foodPrice: true }
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.cart.customerID !== customerID) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get option prices
    const options = await prisma.option.findMany({
      where: { opID: { in: optionIDs } }
    });

    // Delete old options
    await prisma.cartItemOption.deleteMany({
      where: { cartItemID }
    });

    // Update cart item
    await prisma.cartItem.update({
      where: { cartItemID },
      data: {
        cartItemQuantity: quantity,
        cartItemNote: note || null,
        options: {
          create: options.map(opt => ({
            optionID: opt.opID,
            optionPriceSnapshot: opt.opPrice
          }))
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Cart item updated successfully"
    });

  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}