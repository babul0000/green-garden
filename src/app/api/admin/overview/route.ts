import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthErrorHandling, requireAdminPortalAccess } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const BN_MONTHS = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdminPortalAccess(req);

  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") || "month").toLowerCase(); // "month" | "3months" | "year"

  const now = new Date();
  let rangeStartDate: Date;

  if (range === "3months") {
    rangeStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  } else if (range === "year") {
    rangeStartDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  } else {
    // "month" (default) -> Start of current month
    rangeStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // 12 months ago starting point for trend charts
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Parallel fetch all data via Prisma aggregate, groupBy, and counts
  const [
    // Project counts
    totalProjects,
    runningProjects,
    completedProjects,
    planningProjects,
    // Project categories groupBy
    rawProjectsByCategory,

    // Clients & Employees
    totalClients,
    totalEmployees,

    // Bookings
    totalBookings,
    pendingBookings,
    rangeBookings,
    bookings12m,

    // Financials (Payments & Invoices)
    allPaymentsAgg,
    rangePaymentsAgg,
    payments12m,
    invoicesAgg,
    dueInvoicesCount,

    // Inboxes & Operations
    unreadMessages,
    pendingReviews,
    pendingDesignRequests,
    pendingCareerApps,
    activeMaintenances,
    pendingTreeDoctors,
    emergencyTreeDoctors,

    // Recent items for overview display
    recentDesignRequests,
    recentBookings,
    recentNotifications,
  ] = await Promise.all([
    // Projects
    prisma.project.count(),
    prisma.project.count({ where: { status: "RUNNING" } }),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.project.count({ where: { status: "PLANNING" } }),
    prisma.project.groupBy({
      by: ["category"],
      _count: { id: true },
    }).catch(() => []),

    // Clients & Employees
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.employee.count({ where: { status: "ACTIVE" } }),

    // Bookings
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "Pending" } }),
    prisma.booking.count({ where: { createdAt: { gte: rangeStartDate } } }),
    prisma.booking.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),

    // Payments
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { createdAt: { gte: rangeStartDate } },
      _sum: { amount: true },
    }),
    prisma.payment.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),

    // Invoices
    prisma.invoice.aggregate({
      _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
    }),
    prisma.invoice.count({
      where: { status: { in: ["DUE", "OVERDUE"] } },
    }),

    // Action counts
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.review.count({ where: { status: "Pending" } }),
    prisma.designGardenRequest.count({ where: { status: "NEW" } }),
    prisma.careerApplication.count({ where: { status: "Pending" } }),
    prisma.maintenanceSchedule.count({ where: { status: "SCHEDULED" } }),
    prisma.treeDoctorRequest.count({ where: { status: { in: ["PENDING", "ASSIGNED"] } } }),
    prisma.treeDoctorRequest.count({ where: { isEmergency: true, status: { in: ["PENDING", "ASSIGNED"] } } }),

    // Recent lists
    prisma.designGardenRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        spaceType: true,
        designStyle: true,
        approxArea: true,
        budgetRange: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientName: true,
        service: true,
        phone: true,
        address: true,
        budgetRange: true,
        status: true,
        bookingDate: true,
        createdAt: true,
      },
    }),
    prisma.notification.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  // Format projects by category with percentages
  const projectsByCategory = (rawProjectsByCategory || []).map((item) => {
    const count = item._count.id;
    const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
    return {
      category: item.category || "General Landscape",
      count,
      percentage,
    };
  });

  // Build exact 12-month array for monthly bookings and revenue
  const monthlyStats: Array<{
    key: string;
    labelEn: string;
    labelBn: string;
    bookings: number;
    revenue: number;
  }> = [];

  for (let i = 11; i >= 0; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
    const labelEn = `${EN_MONTHS[target.getMonth()]} '${String(target.getFullYear()).slice(-2)}`;
    const labelBn = `${BN_MONTHS[target.getMonth()]} ${String(target.getFullYear()).slice(-2)}`;
    monthlyStats.push({
      key,
      labelEn,
      labelBn,
      bookings: 0,
      revenue: 0,
    });
  }

  // Populate bookings count in monthlyStats
  bookings12m.forEach((b) => {
    const bKey = b.createdAt.toISOString().slice(0, 7);
    const found = monthlyStats.find((s) => s.key === bKey);
    if (found) {
      found.bookings += 1;
    }
  });

  // Populate revenue in monthlyStats
  payments12m.forEach((p) => {
    const pKey = p.createdAt.toISOString().slice(0, 7);
    const found = monthlyStats.find((s) => s.key === pKey);
    if (found) {
      found.revenue += p.amount;
    }
  });

  // Calculate actual revenue strictly from Payment model as required
  const totalRevenue = allPaymentsAgg._sum.amount || 0;
  const periodRevenue = rangePaymentsAgg._sum.amount || 0;
  const totalDue = invoicesAgg._sum.dueAmount || 0;
  const invoiceTotal = invoicesAgg._sum.totalAmount || 0;

  return NextResponse.json(
    {
      range,
      filterLabel: range === "month" ? "এই মাস" : range === "3months" ? "৩ মাস" : "১ বছর",

      // Metric Cards
      totalProjects,
      runningProjects,
      completedProjects,
      planningProjects,

      totalRevenue,       // All-time collected revenue from payments
      periodRevenue,      // Filtered range revenue from payments
      totalDue,          // Due amount from invoices
      invoiceTotal,      // Total invoiced
      dueInvoicesCount,  // Overdue / Due invoices count

      totalClients,
      totalBookings,
      pendingBookings,
      rangeBookings,

      unreadMessages,
      pendingReviews,
      pendingDesignRequests,
      pendingCareerApps,
      totalEmployees,
      activeMaintenances,
      pendingTreeDoctors,
      emergencyTreeDoctors,

      // Charts
      monthlyStats,
      projectsByCategory,

      // Recent Records (Replaces hardcoded studio commissions)
      recentDesignRequests,
      recentBookings,
      recentNotifications,
    },
    { headers: NO_CACHE }
  );
});
