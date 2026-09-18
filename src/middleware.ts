import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifyJwtToken(token) : null;

  // 1. Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "admin" && user.role !== "editor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. Protect Client Dashboard Routes
  if (pathname.startsWith("/client-dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent logged-in users from visiting Login and Register pages
  if (pathname === "/login" || pathname === "/register") {
    if (user) {
      if (user.role === "admin" || user.role === "editor") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/client-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/client-dashboard/:path*",
    "/login",
    "/register",
  ],
};
