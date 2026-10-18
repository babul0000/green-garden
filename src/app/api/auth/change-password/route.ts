import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";
import { comparePassword, hashPassword, signJwtToken, AUTH_COOKIE_NAME, UserRole } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 15 * 60 * 1000, prefix: "change_pw" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const authUser = await requireAuth(req);
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "পুরনো পাসওয়ার্ড এবং নতুন পাসওয়ার্ড উভয়ই আবশ্যক।" },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    // Retrieve user password from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "ব্যবহারকারী পাওয়া যায়নি।" }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = await comparePassword(oldPassword, dbUser.password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "বর্তমান পাসওয়ার্ডটি সঠিক নয়। দয়া করে পুনরায় চেষ্টা করুন।" },
        { status: 400 }
      );
    }

    // Hash new password and increment tokenVersion (invalidates other sessions)
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        password: hashedPassword,
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

    // Re-issue JWT with new tokenVersion for the current session
    const roleString = updatedUser.role.toLowerCase() as UserRole;
    const newToken = await signJwtToken({
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
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। নতুন ক্রেডেনশিয়াল কার্যকর হয়েছে।",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: newToken,
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
      { error: error?.message || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
