import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { mailTransporter } from "@/lib/email";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const TOKEN_KEY = "password_reset_tokens";

interface ResetTokenRecord {
  email: string;
  otpHash: string;
  expiresAt: number;
}

function hashOtp(otp: string, email: string): string {
  return crypto.createHash("sha256").update(`${email.toLowerCase()}:${otp}`).digest("hex");
}

async function readTokens(): Promise<ResetTokenRecord[]> {
  const row = await prisma.setting.findUnique({ where: { key: TOKEN_KEY } });
  const raw = row?.value as any;
  const list = Array.isArray(raw?.tokens) ? raw.tokens : [];
  const now = Date.now();
  return list.filter((t: ResetTokenRecord) => t && t.expiresAt > now);
}

async function saveTokens(tokens: ResetTokenRecord[]) {
  await prisma.setting.upsert({
    where: { key: TOKEN_KEY },
    update: { value: { tokens } as any },
    create: { key: TOKEN_KEY, value: { tokens } as any },
  });
}

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(req, { limit: 8, windowMs: 10 * 60 * 1000, prefix: "forgot_pw" });
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const body = await req.json();
    const action = String(body.action || "request");
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।" },
        { status: 400 }
      );
    }

    if (action === "request") {
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        const otp = String(crypto.randomInt(100000, 999999));
        const otpHash = hashOtp(otp, email);
        const existing = await readTokens();
        const filtered = existing.filter((t) => t.email !== email);
        filtered.push({
          email,
          otpHash,
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        });
        await saveTokens(filtered);

        try {
          await mailTransporter.sendMail({
            from: process.env.SMTP_FROM || `AR Green Garden <${process.env.SMTP_USER || "info@argreengarden.com"}>`,
            to: email,
            subject: "Password Reset Verification Code (OTP) — A R Green Garden",
            html: `
              <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #d6d2c4; border-radius: 16px; overflow: hidden;">
                <div style="background: #2B4D33; color: #fff; padding: 20px 24px;">
                  <h2 style="margin:0; font-size: 18px;">পাসওয়ার্ড রিসেট ভেরিফিকেশন কোড</h2>
                  <p style="margin:4px 0 0; opacity:0.8; font-size: 12px;">A R Green Garden Security Desk</p>
                </div>
                <div style="padding: 24px; color: #121813;">
                  <p style="font-size: 14px;">প্রিয় ${user.name},</p>
                  <p style="font-size: 14px;">আপনার একাউন্টের পাসওয়ার্ড রিসেট করার জন্য নিচের ৬ সংখ্যার OTP কোডটি ব্যবহার করুন:</p>
                  <div style="margin: 20px 0; text-align: center; background: #F7F6F2; padding: 16px; border-radius: 12px; border: 1px dashed #2B4D33;">
                    <span style="font-size: 28px; letter-spacing: 8px; font-weight: bold; font-family: monospace; color: #2B4D33;">${otp}</span>
                  </div>
                  <p style="font-size: 12px; color: #75787B;">এই কোডটি আগামী ১৫ মিনিট পর্যন্ত কার্যকর থাকবে। আপনি এই অনুরোধ না করে থাকলে ইমেইলটি উপেক্ষা করুন।</p>
                </div>
              </div>
            `,
          });
        } catch (mailErr) {
          console.error("Password reset email dispatch error:", mailErr);
        }
      }

      // Unified generic success response to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: "যদি আপনার ইমেইল নিবন্ধিত থাকে, তবে ৬ সংখ্যার OTP কোড পাঠানো হয়েছে।",
      });
    }

    if (action === "reset") {
      const otp = String(body.otp || "").trim();
      const newPassword = String(body.newPassword || "");

      if (!otp || otp.length !== 6) {
        return NextResponse.json({ error: "সঠিক ৬ সংখ্যার OTP কোড লিখুন।" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }, { status: 400 });
      }

      const tokens = await readTokens();
      const match = tokens.find((t) => t.email === email);
      if (!match || match.otpHash !== hashOtp(otp, email) || match.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: "OTP কোডটি সঠিক নয় অথবা মেয়াদ উত্তীর্ণ হয়েছে।" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "অ্যাকাউন্ট পাওয়া যায়নি।" }, { status: 404 });
      }

      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          tokenVersion: { increment: 1 },
        },
      });

      const remaining = tokens.filter((t) => t.email !== email);
      await saveTokens(remaining);

      return NextResponse.json({
        success: true,
        message: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করতে পারেন।",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "সার্ভার ত্রুটি হয়েছে। আবার চেষ্টা করুন।" }, { status: 500 });
  }
}

