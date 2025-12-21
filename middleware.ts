// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session token and role from cookies
  const token = request.cookies.get("session")?.value;
  const role = request.cookies.get("role")?.value;

  // Define default dashboards for each role
  const dashboards = {
    shop: "/shop",
    user: "/",
    admin: "/admin"
  };

  // Define route types
  const isProtectedRoute = 
    pathname.startsWith("/shop") || 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/customer");

  const isAuthRoute = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register");

  const isHomePage = pathname === "/";

  // No session - only allow access to auth routes and home
  if (!token) {
    if (pathname === "/login/shop" || pathname === "/login/admin" || pathname === "/login/customer") {
      return NextResponse.next();
    }
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Has session - redirect to appropriate dashboard
  if (token && role) {
    const userDashboard = dashboards[role as keyof typeof dashboards];

    // PREVENT REDIRECT LOOPS: Don't redirect if already at destination
    if (pathname === userDashboard) {
      return NextResponse.next();
    }

    // Redirect from home page to user's dashboard
    if (isHomePage) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }

    // Logged-in users should not access login/register pages
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }

    // Role-based access control for protected routes
    if (isProtectedRoute) {
      // Customer trying to access shop/admin
      if (role === "user" && !pathname.startsWith("/customer")) {
        return NextResponse.redirect(new URL(dashboards.user, request.url));
      }

      // Shop trying to access admin/customer
      if (role === "shop" && !pathname.startsWith("/shop")) {
        return NextResponse.redirect(new URL(dashboards.shop, request.url));
      }

      // Admin trying to access shop/customer
      if (role === "admin" && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL(dashboards.admin, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/shop/:path*", 
    "/admin/:path*", 
    "/customer/:path*", 
    "/login/:path*", 
    "/register/:path*",
    "/login/shop",
    "/login/admin",
    "/login/customer"
  ],
};