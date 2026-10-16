import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling, apiError } from "@/lib/apiAuth";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role.toLowerCase(),
    phone: u.phone,
    avatar: u.avatar,
    createdAt: u.createdAt,
  }));

  return NextResponse.json(formatted, { headers: NO_CACHE });
});

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const { name, email, role, password, phone } = await req.json();
  if (!email || !name) {
    return apiError("Name and email are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return apiError("User already exists with this email", 400);
  }

  // Map role string to Prisma Role enum
  let prismaRole: Role = Role.CLIENT;
  const upperRole = String(role || "CLIENT").toUpperCase();
  if (upperRole in Role) {
    prismaRole = upperRole as Role;
  }

  const hashedPassword = await bcrypt.hash(password || "client123", 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: prismaRole,
      phone: phone || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ success: true, user: newUser }, { status: 201, headers: NO_CACHE });
});
