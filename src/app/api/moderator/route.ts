import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";
import { logActivity } from "@/lib/activityLog";

export const dynamic = "force-dynamic";

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// Moderator / Admin: Unified live moderation dashboard payload
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const [blogs, reviews, comments, messages, careers] = await Promise.all([
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: { _count: { select: { comments: true } } },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
      include: { blog: { select: { title: true, slug: true } } },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
    prisma.careerApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
  ]);

  const counts = {
    pendingReviews: reviews.filter((r) => r.status !== "Approved").length,
    pendingComments: comments.filter((c) => !c.approved).length,
    unreadMessages: messages.filter((m) => !m.isRead).length,
    pendingCareers: careers.filter((c) => c.status === "Pending").length,
    draftBlogs: blogs.filter((b) => b.status !== "PUBLISHED").length,
  };

  return NextResponse.json(
    { blogs, reviews, comments, messages, careers, counts },
    { headers: NO_CACHE }
  );
});

// Moderator / Admin: Real Prisma updates for blogs, reviews, comments, messages, careers
export const PATCH = withAuthErrorHandling(async (req: Request) => {
  const user = await requireModerator(req);
  const body = await req.json();
  const { entity, id, data } = body as { entity: string; id: string; data: Record<string, any> };

  if (!entity || !id || !data) {
    return apiError("entity, id and data are required", 400);
  }

  let result: any;

  switch (entity) {
    case "review":
      result = await prisma.review.update({
        where: { id },
        data: {
          ...(data.status !== undefined ? { status: String(data.status) } : {}),
          ...(data.featured !== undefined ? { featured: Boolean(data.featured) } : {}),
          ...(data.adminReply !== undefined ? { adminReply: data.adminReply } : {}),
        },
      });
      break;
    case "comment":
      result = await prisma.comment.update({
        where: { id },
        data: { approved: Boolean(data.approved) },
      });
      break;
    case "message":
      result = await prisma.contactMessage.update({
        where: { id },
        data: { isRead: Boolean(data.isRead) },
      });
      break;
    case "blog":
      result = await prisma.blog.update({
        where: { id },
        data: {
          ...(data.status !== undefined ? { status: String(data.status) } : {}),
          ...(data.title !== undefined ? { title: String(data.title) } : {}),
        },
      });
      break;
    case "career":
      result = await prisma.careerApplication.update({
        where: { id },
        data: { status: String(data.status) },
      });
      break;
    default:
      return apiError(`Unsupported entity '${entity}'`, 400);
  }

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "UPDATE",
    entity: `Moderator:${entity}`,
    entityId: id,
    summary: `মডারেশন অ্যাকশন (${entity}) আপডেট করা হয়েছে`,
  });

  return NextResponse.json({ success: true, item: result }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  const user = await requireModerator(req);
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");
  const id = searchParams.get("id");

  if (!entity || !id) return apiError("entity and id are required", 400);

  if ((entity === "career" || entity === "blog") && user.role?.toUpperCase() !== "ADMIN") {
    await requireAdmin(req);
  }

  switch (entity) {
    case "review":
      await prisma.review.delete({ where: { id } });
      break;
    case "comment":
      await prisma.comment.delete({ where: { id } });
      break;
    case "message":
      await prisma.contactMessage.delete({ where: { id } });
      break;
    case "blog":
      await prisma.blog.delete({ where: { id } });
      break;
    case "career":
      await prisma.careerApplication.delete({ where: { id } });
      break;
    default:
      return apiError(`Unsupported entity '${entity}'`, 400);
  }

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "DELETE",
    entity: `Moderator:${entity}`,
    entityId: id,
    summary: `মডারেশন কিউ থেকে আইটেম ডিলিট করা হয়েছে (${entity})`,
  });

  return NextResponse.json({ success: true }, { headers: NO_CACHE });
});

