import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mailTransporter } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Automated Cron Job for dispatching tomorrow's maintenance and plant health follow-up reminders.
 * Secured with CRON_SECRET verification.
 */
export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const keyParam = searchParams.get("key");

    // Guard: Validate CRON_SECRET if defined
    if (!cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET environment variable is not configured." },
        { status: 500 }
      );
    }

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || keyParam === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET." },
        { status: 401 }
      );
    }

    // Determine Tomorrow's Window
    const today = new Date();
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const tomorrowDateString = tomorrowStart.toISOString().split("T")[0];

    // 1. Fetch Maintenance Schedules for tomorrow
    const upcomingSchedules = await prisma.maintenanceSchedule.findMany({
      where: {
        scheduledDate: {
          gte: tomorrowStart,
          lte: tomorrowEnd,
        },
        status: "SCHEDULED",
      },
      include: {
        assignedStaff: { select: { name: true, phone: true } },
      },
    });

    // 2. Fetch Plant Health Records with nextMaintenanceDate for tomorrow
    const upcomingFollowUps = await prisma.plantHealthRecord.findMany({
      where: {
        nextMaintenanceDate: tomorrowDateString,
      },
    });

    let emailsDispatched = 0;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;

    // Send notifications if SMTP is configured
    if (adminEmail && process.env.SMTP_USER && (upcomingSchedules.length > 0 || upcomingFollowUps.length > 0)) {
      try {
        const mailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
            <div style="background: #14532d; padding: 24px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: bold;">🌱 আগামীকালের মেইনটেন্যান্স ও ফলো-আপ শিডিউল</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.85;">AR Green Garden Studio Daily Reminder</p>
            </div>
            <div style="padding: 24px; color: #1f2937; line-height: 1.6;">
              <p style="font-size: 14px;"><strong>আগামীকাল (${tomorrowStart.toLocaleDateString("bn-BD")}) নিম্নের কাজগুলো নির্ধারিত রয়েছে:</strong></p>
              
              <h3 style="color: #15803d; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 18px;">
                মেইনটেন্যান্স শিডিউল (${upcomingSchedules.length}টি):
              </h3>
              ${
                upcomingSchedules.length === 0
                  ? "<p style='font-size: 12px; color: #6b7280;'>কোনো সাধারণ মেইনটেন্যান্স নেই।</p>"
                  : `<ul style="font-size: 13px; padding-left: 20px;">
                      ${upcomingSchedules
                        .map(
                          (s) =>
                            `<li><strong>${s.clientName}</strong> (${s.location}) - ফ্রিকোয়েন্সি: ${s.frequency} | দায়িত্বে: ${s.assignedStaff?.name || "মালি টিম"} ${s.notes ? `(${s.notes})` : ""}</li>`
                        )
                        .join("")}
                    </ul>`
              }

              <h3 style="color: #15803d; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 18px;">
                ট্রি ডক্টর ও প্ল্যান্ট ফলো-আপ (${upcomingFollowUps.length}টি):
              </h3>
              ${
                upcomingFollowUps.length === 0
                  ? "<p style='font-size: 12px; color: #6b7280;'>কোনো ফলো-আপ ভিজিট নেই।</p>"
                  : `<ul style="font-size: 13px; padding-left: 20px;">
                      ${upcomingFollowUps
                        .map(
                          (p) =>
                            `<li><strong>${p.plantName}</strong> (${p.location}) - নোট: ${p.doctorReport || p.treatment || "নিয়মিত পর্যবেক্ষণ"}</li>`
                        )
                        .join("")}
                    </ul>`
              }
            </div>
          </div>
        `;

        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"AR Green Garden Studio" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `🌱 দৈনিক রিমাইন্ডার: আগামীকালের গার্ডেন মেইনটেন্যান্স (${upcomingSchedules.length + upcomingFollowUps.length}টি কাজ)`,
          html: mailHtml,
        });

        emailsDispatched++;
      } catch (mailErr: any) {
        console.warn("Cron reminder email dispatch failed (SMTP may not be active):", mailErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      date: tomorrowDateString,
      maintenanceCount: upcomingSchedules.length,
      followUpCount: upcomingFollowUps.length,
      emailsDispatched,
      message: `Processed ${upcomingSchedules.length} maintenance schedules and ${upcomingFollowUps.length} follow-ups for tomorrow.`,
    });
  } catch (error: any) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
