import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

export const GET = withAuthErrorHandling(async (req: Request) => {
  const adminActor = await requireAdmin(req);

  // Fetch all primary database models
  const [
    services,
    projects,
    gallery,
    blogs,
    comments,
    bookings,
    designRequests,
    treeDoctorRequests,
    maintenanceSchedules,
    invoices,
    payments,
    inventoryItems,
    employees,
    attendances,
    careerApplications,
    reviews,
    contactMessages,
    digitalServiceCards,
    settings,
    users,
  ] = await Promise.all([
    prisma.service.findMany(),
    prisma.project.findMany(),
    prisma.galleryItem.findMany(),
    prisma.blog.findMany(),
    prisma.comment.findMany(),
    prisma.booking.findMany(),
    prisma.designGardenRequest.findMany(),
    prisma.treeDoctorRequest.findMany(),
    prisma.maintenanceSchedule.findMany(),
    prisma.invoice.findMany(),
    prisma.payment.findMany(),
    prisma.inventoryItem.findMany(),
    prisma.employee.findMany(),
    prisma.attendance.findMany(),
    prisma.careerApplication.findMany(),
    prisma.review.findMany(),
    prisma.contactMessage.findMany(),
    prisma.digitalServiceCard.findMany(),
    prisma.setting.findMany(),
    // Strictly sanitize users by omitting password and sensitive hashes
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  // Extract all media/image URLs across tables
  const mediaSet = new Set<string>();

  const extractUrl = (url: unknown) => {
    if (typeof url === "string" && url.trim().length > 0) {
      const trimmed = url.trim();
      if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("/uploads/") ||
        trimmed.startsWith("/images/")
      ) {
        mediaSet.add(trimmed);
      }
    }
  };

  projects.forEach((p) => {
    extractUrl(p.beforeImage);
    extractUrl(p.afterImage);
    if (Array.isArray(p.images)) p.images.forEach(extractUrl);
    if (Array.isArray(p.wipImages)) p.wipImages.forEach(extractUrl);
  });

  services.forEach((s) => extractUrl(s.bannerImage));
  gallery.forEach((g) => {
    extractUrl(g.imageUrl);
    extractUrl(g.beforeImageUrl);
  });
  blogs.forEach((b) => extractUrl(b.coverImage));
  treeDoctorRequests.forEach((t) => extractUrl(t.treePhotoUrl));
  employees.forEach((e) => extractUrl(e.photo));
  careerApplications.forEach((c) => extractUrl(c.resumeUrl));
  reviews.forEach((r) => extractUrl(r.photoUrl));

  const exportPayload = {
    exportDate: new Date().toISOString(),
    system: "A R Green Garden Landscape Architecture Studio",
    exportedBy: {
      id: adminActor.id,
      name: adminActor.name,
      email: adminActor.email,
    },
    counts: {
      services: services.length,
      projects: projects.length,
      gallery: gallery.length,
      blogs: blogs.length,
      comments: comments.length,
      bookings: bookings.length,
      designRequests: designRequests.length,
      treeDoctorRequests: treeDoctorRequests.length,
      maintenanceSchedules: maintenanceSchedules.length,
      invoices: invoices.length,
      payments: payments.length,
      inventoryItems: inventoryItems.length,
      employees: employees.length,
      attendances: attendances.length,
      careerApplications: careerApplications.length,
      reviews: reviews.length,
      contactMessages: contactMessages.length,
      digitalServiceCards: digitalServiceCards.length,
      settings: settings.length,
      users: users.length,
      uniqueMediaUrls: mediaSet.size,
    },
    mediaUrls: Array.from(mediaSet),
    tables: {
      services,
      projects,
      gallery,
      blogs,
      comments,
      bookings,
      designRequests,
      treeDoctorRequests,
      maintenanceSchedules,
      invoices,
      payments,
      inventoryItems,
      employees,
      attendances,
      careerApplications,
      reviews,
      contactMessages,
      digitalServiceCards,
      settings,
      users,
    },
  };

  // Log activity
  const { logActivity } = await import("@/lib/activityLog");
  await logActivity({
    userId: adminActor.id,
    userName: adminActor.name,
    action: "EXPORT",
    entity: "Settings",
    summary: "সম্পূর্ণ ডাটাবেসের JSON ব্যাকআপ এক্সপোর্ট করা হয়েছে",
    details: { totalEntities: Object.values(exportPayload.counts).reduce((a, b) => a + b, 0) },
  });

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="ar_green_garden_db_backup_${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
});
