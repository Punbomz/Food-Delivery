import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// PATCH - Update cart item quantity
export async function PATCH(
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

    const { quantity } = await req.json();

    // Validate quantity
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to the customer
    const cartItem = await prisma.cartItem.findUnique({
      where: { cartItemID },
      include: {
        cart: {
          select: { customerID: true }
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

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { cartItemID },
      data: { cartItemQuantity: quantity }
    });

    return NextResponse.json({
      success: true,
      cartItem: updatedCartItem
    });

  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove cart item
export async function DELETE(
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

    // Check if cart item exists and belongs to the customer
    const cartItem = await prisma.cartItem.findUnique({
      where: { cartItemID },
      include: {
        cart: {
          select: { customerID: true, cartID: true }
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

    // Delete cart item (CartItemOption will be deleted automatically due to onDelete: Cascade)
    await prisma.cartItem.delete({
      where: { cartItemID }
    });

    // Optional: Check if cart is empty and delete it
    const remainingItems = await prisma.cartItem.count({
      where: { cartID: cartItem.cart.cartID }
    });

    if (remainingItems === 0) {
      await prisma.cart.delete({
        where: { cartID: cartItem.cart.cartID }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cart item deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}