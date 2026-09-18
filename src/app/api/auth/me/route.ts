import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await verifyJwtToken(token);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
