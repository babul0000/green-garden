import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifyJwtToken(token) : null;

  const role = user?.role?.toUpperCase();

  // 1. Protect Admin Routes (/admin)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "ADMIN" && role !== "EDITOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. Protect Moderator Routes (/moderator)
  if (pathname.startsWith("/moderator")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "MODERATOR" && role !== "ADMIN" && role !== "EDITOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Protect Employee Portal Routes (/employee-portal)
  if (pathname.startsWith("/employee-portal")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "EMPLOYEE" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 4. Protect Client Dashboard Routes (/client-dashboard)
  if (pathname.startsWith("/client-dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Prevent logged-in users from visiting Login and Register pages
  if (pathname === "/login" || pathname === "/register") {
    if (user) {
      if (role === "ADMIN" || role === "EDITOR") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (role === "MODERATOR") {
        return NextResponse.redirect(new URL("/moderator", request.url));
      }
      if (role === "EMPLOYEE") {
        return NextResponse.redirect(new URL("/employee-portal", request.url));
      }
      return NextResponse.redirect(new URL("/client-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/moderator/:path*",
    "/employee-portal/:path*",
    "/client-dashboard/:path*",
    "/login",
    "/register",
  ],
};
