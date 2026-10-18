import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";
import { signJwtToken, AUTH_COOKIE_NAME, UserRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const authUser = await requireAuth(req);

    // Increment tokenVersion in database to invalidate all active tokens across other browsers/devices
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        tokenVersion: { increment: 1 },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        tokenVersion: true,
      },
    });

    // Re-issue a fresh token for this current active device so current user is not logged out
    const roleString = updatedUser.role.toLowerCase() as UserRole;
    const freshToken = await signJwtToken({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: roleString,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      tokenVersion: updatedUser.tokenVersion,
    });

    const response = NextResponse.json({
      success: true,
      tokenVersion: updatedUser.tokenVersion,
      message: "অন্যান্য সকল ডিভাইস ও সেশন থেকে সফলভাবে লগআউট করা হয়েছে।",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: freshToken,
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json(
      { error: error?.message || "ডিভাইস লগআউট প্রক্রিয়া ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
