import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireModerator, withAuthErrorHandling, apiError } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

interface SubscriberItem {
  id: string;
  email: string;
  name?: string;
  source?: string;
  subscribedAt: string;
}

const KEY = "newsletter_subscribers";

async function readSubscribers(): Promise<SubscriberItem[]> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const val = row?.value as any;
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.items)) return val.items;
  return [];
}

async function saveSubscribers(items: SubscriberItem[]) {
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: { items } as any },
    create: { key: KEY, value: { items } as any },
  });
}

// Public: Subscribe to newsletter
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const source = String(body.source || "footer").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন।" },
        { status: 400 }
      );
    }

    const items = await readSubscribers();
    const existing = items.find((s) => s.email.toLowerCase() === email);
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "এই ইমেইলটি ইতোমধ্যেই সাবস্ক্রাইব করা আছে।",
      });
    }

    const entry: SubscriberItem = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email,
      name: name || undefined,
      source,
      subscribedAt: new Date().toISOString(),
    };

    const updated = [entry, ...items];
    await saveSubscribers(updated);

    // Notify admin non-blockingly
    prisma.notification
      .create({
        data: {
          title: "নতুন নিউজলেটার সাবস্ক্রাইবার",
          message: `${email} (${source}) স্টুডিও নিউজলেটারে যুক্ত হয়েছেন।`,
          type: "INFO",
          link: "/admin?tab=interactive-tools",
        },
      })
      .catch(() => {});

    return NextResponse.json(
      {
        success: true,
        subscriber: entry,
        message: "ধন্যবাদ! আমাদের মাসিক বোটানিক্যাল নিউজে যুক্ত হয়েছেন।",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Newsletter POST error:", err);
    return NextResponse.json({ error: "সাবস্ক্রিপশন সম্পন্ন করা যায়নি।" }, { status: 500 });
  }
}

// Staff: List all newsletter subscribers
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);
  const items = await readSubscribers();
  return NextResponse.json({ subscribers: items, total: items.length });
});

// Admin: Remove subscriber
export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email")?.toLowerCase();

  if (!id && !email) {
    return apiError("Subscriber id or email required", 400);
  }

  const items = await readSubscribers();
  const filtered = items.filter((s) => (id ? s.id !== id : s.email.toLowerCase() !== email));
  await saveSubscribers(filtered);

  return NextResponse.json({ success: true, remaining: filtered.length });
});

