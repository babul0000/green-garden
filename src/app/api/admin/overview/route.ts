import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    // Parallel fetch all KPI data
    const [
      totalClients,
      runningProjects,
      completedProjects,
      totalEmployees,
      activeMaintenances,
      pendingTreeDoctors,
      emergencyTreeDoctors,
      pendingQuotations,
      pendingReviews,
      pendingBookings,
      pendingCareerApps,
      unreadMessages,
      lowStockItems,
      pendingDesignRequests,
      invoices,
      payments,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.project.count({ where: { status: "RUNNING" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.maintenanceSchedule.count({ where: { status: "SCHEDULED" } }),
      prisma.treeDoctorRequest.count({ where: { status: { in: ["PENDING", "ASSIGNED"] } } }),
      prisma.treeDoctorRequest.count({ where: { isEmergency: true, status: { in: ["PENDING", "ASSIGNED"] } } }),
      prisma.quotation.count({ where: { status: { in: ["DRAFT", "SENT"] } } }),
      prisma.review.count({ where: { status: "Pending" } }),
      prisma.booking.count({ where: { status: "Pending" } }),
      prisma.careerApplication.count({ where: { status: "Pending" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.inventoryItem.findMany({
        where: { stockQuantity: { lte: prisma.inventoryItem.fields.minThreshold } },
        select: { id: true, name: true, stockQuantity: true, minThreshold: true },
      }).catch(() => []),
      prisma.designGardenRequest.count({ where: { status: "NEW" } }),
      prisma.invoice.aggregate({ _sum: { totalAmount: true, paidAmount: true, dueAmount: true } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);

    // Financial summary
    const totalRevenue = invoices._sum.totalAmount || 0;
    const totalPaid = invoices._sum.paidAmount || 0;
    const totalDue = invoices._sum.dueAmount || 0;

    // Recent activities (last 10 notifications)
    const recentNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentPayments = await prisma.payment.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    recentPayments.forEach((p) => {
      const month = p.createdAt.toISOString().slice(0, 7); // "2026-10"
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + p.amount;
    });

    return NextResponse.json(
      {
        // Counts
        totalClients,
        runningProjects,
        completedProjects,
        totalEmployees,
        activeMaintenances,
        pendingTreeDoctors,
        emergencyTreeDoctors,
        pendingQuotations,
        pendingReviews,
        pendingBookings,
        pendingCareerApps,
        unreadMessages,
        pendingDesignRequests,
        lowStockCount: Array.isArray(lowStockItems) ? lowStockItems.length : 0,

        // Finance
        totalRevenue,
        totalPaid,
        totalDue,

        // Charts
        monthlyRevenue,
        recentNotifications,
      },
      { headers: NO_CACHE }
    );
  } catch (error: any) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
