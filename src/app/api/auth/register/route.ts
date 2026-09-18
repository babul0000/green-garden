import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password with bcryptjs
    const hashedPassword = await hashPassword(password);

    // Map role
    const normalizedRole = (role || "").toUpperCase();
    const assignedRole = (normalizedRole === "ADMIN" || normalizedRole === "EDITOR" || normalizedRole === "MODERATOR") 
      ? (normalizedRole as any) 
      : "CLIENT";

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: assignedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const roleString = user.role.toLowerCase() as "client" | "admin" | "editor" | "moderator";
    const token = await signJwtToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleString,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleString,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during registration" },
      { status: 500 }
    );
  }
}
