import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("session")?.value;
  const role = request.cookies.get("role")?.value;

  const dashboards = {
    shop: "/shop",
    customer: "/",
    admin: "/admin",
  };

  const isProtectedRoute =
    pathname.startsWith("/shop") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer");

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isHomePage = pathname === "/";

  // shop detail page
  const isShopDetailPage =
    pathname.startsWith("/shop/") &&
    pathname !== "/shop"

  /* ---------- ไม่มี session ---------- */
  if (!token) {
    if (isProtectedRoute) {
      const res = NextResponse.redirect(new URL("/", request.url));
      res.cookies.delete("session");
      res.cookies.delete("role");
      return res;
    }
    return NextResponse.next();
  }

  /* ---------- session พัง ---------- */
  if (token && !role) {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.delete("session");
    res.cookies.delete("role");
    return res;
  }

  /* ---------- มี session ---------- */
  if (token && role) {
    const dashboard = dashboards[role as keyof typeof dashboards];

    if (isHomePage && role !== "customer") {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    if (isAuthRoute) {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    if (isProtectedRoute) {
      // customer
      if (role === "customer") {
        if (
          pathname.startsWith("/customer") ||
          isShopDetailPage ||
          pathname === "/"
        ) {
          return NextResponse.next();
        }

        return NextResponse.redirect(new URL("/", request.url));
      }

      // shop
      if (role === "shop" && !pathname.startsWith("/shop")) {
        return NextResponse.redirect(new URL("/shop", request.url));
      }

      // admin
      if (role === "admin" && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
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
  ],
};
