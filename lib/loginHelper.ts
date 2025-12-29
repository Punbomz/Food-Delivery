import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Define return types
type UserRole = "shop" | "customer" | "admin";

interface UserData {
  id: number;
  name: string;
  email: string;
}

type AuthResult = [UserData, UserRole] | null;

export async function getCurrentUser(): Promise<AuthResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const role = cookieStore.get("role")?.value as UserRole | undefined;
    
    if (!token || !role) return null;

    try {
        const session = await prisma.session.findUnique({
            where: { token },
            include: { 
                customer: true,
                shop: true,
                admin: true 
            },
        });

        if (!session || session.expiresAt < new Date()) {
            // Clear invalid cookies
            cookieStore.delete("session");
            cookieStore.delete("role");
            return null;
        }

        // Return normalized user data based on role
        let userData: UserData | null = null;

        if (role === "shop" && session.shop) {
            userData = {
                id: session.shop.shopID,
                name: session.shop.shopName || "",
                email: session.shop.shopEmail || ""
            };
        } else if (role === "customer" && session.customer) {
            userData = {
                id: session.customer.customerID,
                name: session.customer.customerFname + " " + session.customer.customerLname || "",
                email: session.customer.customerEmail || ""
            };
        } else if (role === "admin" && session.admin) {
            userData = {
                id: session.admin.adminID,
                name: session.admin.adminFname + " " + session.admin.adminLname || "",
                email: session.admin.adminEmail || ""
            };
        }

        if (!userData) {
            cookieStore.delete("session");
            cookieStore.delete("role");
            return null;
        }

        return [userData, role];
    } catch (error) {
        console.error("Get current user error:", error);
        return null;
    }
}

// Helper to clear session (for logout)
export async function clearSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    // Delete from database
    if (token) {
        await prisma.session.delete({
            where: { token }
        }).catch(() => {
            // Session already deleted or doesn't exist
        });
    }
    
    // Clear cookies
    cookieStore.delete("session");
    cookieStore.delete("role");
}