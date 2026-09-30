import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let setting = await prisma.setting.findUnique({
      where: { key: "site_config" },
    });

    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          key: "site_config",
          value: {
            title: "A R Green Garden",
            phone: "01620692449",
            email: "info@argreengarden.com",
            address: "42/A, Road 9/A, Dhanmondi, Dhaka",
            fbPage: "https://facebook.com/argreengarden",
            youtube: "https://youtube.com/argreengarden",
            themeColor: "#15803d",
            seoDescription: "Premium Landscaping & Garden Design website in Bangladesh",
          },
        },
      });
    }

    return NextResponse.json(setting);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const setting = await prisma.setting.upsert({
      where: { key: "site_config" },
      update: { value: body },
      create: { key: "site_config", value: body },
    });

    return NextResponse.json(setting);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
