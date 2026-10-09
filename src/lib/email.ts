import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER || "babulhossan.dev@gmail.com";
const smtpPass = process.env.SMTP_PASS || "bpae jbiy stxc qtsf";
const smtpFrom = process.env.SMTP_FROM || `AR Green Garden <${smtpUser}>`;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "babulhossan.dev@gmail.com";

export const mailTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false, // TLS on 587
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

/**
 * Send an email alert to Admin when a consultation / 3D design is requested
 */
export async function sendConsultationAlert(data: {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  spaceType?: string;
  budget?: string;
  notes?: string;
}) {
  try {
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: #14532d; padding: 24px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: bold;">🌿 নতুন গার্ডেন কনসালটেশন রিকোয়েস্ট</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.85;">A R Green Garden Studio Portal</p>
        </div>
        <div style="padding: 24px; color: #1f2937; line-height: 1.6;">
          <p style="font-size: 14px;"><strong>একজন নতুন গ্রাহক সাইট ভিজিট ও গার্ডেন ডিজাইনের জন্য আবেদন করেছেন:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">গ্রাহকের নাম:</td>
              <td style="padding: 10px 0; font-weight: bold;">${data.clientName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">মোবাইল নম্বর:</td>
              <td style="padding: 10px 0; font-weight: bold;"><a href="tel:${data.clientPhone}" style="color: #15803d; text-decoration: none;">${data.clientPhone}</a></td>
            </tr>
            ${data.clientEmail ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">ইমেইল:</td>
              <td style="padding: 10px 0;">${data.clientEmail}</td>
            </tr>` : ''}
            ${data.clientAddress ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">সাইটের ঠিকানা:</td>
              <td style="padding: 10px 0;">${data.clientAddress}</td>
            </tr>` : ''}
            ${data.spaceType ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">জায়গার ধরন:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #15803d;">${data.spaceType}</td>
            </tr>` : ''}
            ${data.budget ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">আনুমানিক বাজেট:</td>
              <td style="padding: 10px 0; font-weight: bold;">${data.budget}</td>
            </tr>` : ''}
          </table>
          ${data.notes ? `
          <div style="margin-top: 20px; background: #f0fdf4; padding: 14px; border-radius: 10px; border-left: 4px solid #16a34a;">
            <p style="margin: 0; font-size: 13px; color: #166534;"><strong>গ্রাহকের বিশেষ বার্তা:</strong></p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #14532d;">${data.notes}</p>
          </div>` : ''}
          <div style="margin-top: 24px; text-align: center;">
            <a href="tel:${data.clientPhone}" style="display: inline-block; background: #15803d; color: #ffffff; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 13px;">📞 গ্রাহককে কল করুন (${data.clientPhone})</a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          A R Green Garden Studio • ধানমন্ডি, ঢাকা • হটলাইন: ০১৬২০-৬৯২৪৪৯
        </div>
      </div>
    `;

    await mailTransporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      subject: `🌿 নতুন গার্ডেন কনসালটেশন রিকোয়েস্ট: ${data.clientName} (${data.clientPhone})`,
      html: mailHtml,
    });

    // If client provided an email, send them a confirmation too
    if (data.clientEmail) {
      const clientHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background: #14532d; padding: 24px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">ধন্যবাদ, ${data.clientName}!</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">আপনার গার্ডেন রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে</p>
          </div>
          <div style="padding: 24px; color: #1f2937; line-height: 1.6; font-size: 13px;">
            <p>আমাদের প্রধান ল্যান্ডস্কেপ আর্কিটেকচার টিম আপনার আবেদনের তথ্য পেয়েছেন। শীঘ্রই একজন বিশেষজ্ঞ আপনার নম্বরে (<strong>${data.clientPhone}</strong>) যোগাযোগ করে সাইট ভিজিটের সময়সূচি চূড়ান্ত করবেন।</p>
            <p style="margin-top: 16px; color: #4b5563;">জরুরি প্রয়োজনে আমাদের স্টুডিওতে সরাসরি কল করতে পারেন:</p>
            <p style="font-size: 16px; font-weight: bold; color: #15803d;">📞 ০১৬২০-৬৯২৪৪৯</p>
          </div>
          <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af;">
            A R Green Garden • ৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা
          </div>
        </div>
      `;

      await mailTransporter.sendMail({
        from: smtpFrom,
        to: data.clientEmail,
        subject: `🌿 A R Green Garden - আপনার পরামর্শ আবেদন সফলভাবে গৃহীত হয়েছে`,
        html: clientHtml,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.warn("Failed to send consultation email:", error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Send an emergency alert for Tree Doctor call
 */
export async function sendTreeDoctorEmergencyAlert(data: {
  clientName: string;
  clientPhone: string;
  clientLocation: string;
  problemDescription: string;
  urgencyLevel?: string;
  preferredTime?: string;
}) {
  try {
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #dc2626; border-radius: 16px; overflow: hidden;">
        <div style="background: #dc2626; padding: 20px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">🚨 জরুরি ট্রি ডক্টর কল রিকোয়েস্ট!</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px;">তাত্ক্ষণিক অন-সাইট বৃক্ষ চিকিৎসা প্রয়োজন</p>
        </div>
        <div style="padding: 24px; color: #1f2937; font-size: 13px; line-height: 1.6;">
          <p><strong>গাছের জরুরি চিকিৎসার জন্য একজন গ্রাহক রিকোয়েস্ট পাঠিয়েছেন:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr style="border-bottom: 1px solid #fee2e2;">
              <td style="padding: 8px 0; color: #6b7280;">গ্রাহক:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.clientName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #fee2e2;">
              <td style="padding: 8px 0; color: #6b7280;">জরুরি নম্বর:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #dc2626;"><a href="tel:${data.clientPhone}" style="color: #dc2626; text-decoration: none;">${data.clientPhone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #fee2e2;">
              <td style="padding: 8px 0; color: #6b7280;">লোকেশন:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.clientLocation}</td>
            </tr>
            <tr style="border-bottom: 1px solid #fee2e2;">
              <td style="padding: 8px 0; color: #6b7280;">জরুরিতা:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #b91c1c;">${data.urgencyLevel || "High Emergency"}</td>
            </tr>
            ${data.preferredTime ? `
            <tr style="border-bottom: 1px solid #fee2e2;">
              <td style="padding: 8px 0; color: #6b7280;">সুবিধাজনক সময়:</td>
              <td style="padding: 8px 0;">${data.preferredTime}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 16px; background: #fff1f2; padding: 12px; border-radius: 8px; border-left: 4px solid #e11d48;">
            <p style="margin: 0; font-weight: bold; color: #9f1239;">গাছের সমস্যা / লক্ষণ:</p>
            <p style="margin: 4px 0 0 0; color: #881337;">${data.problemDescription}</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <a href="tel:${data.clientPhone}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold;">📞 এখনই ফোন করুন (${data.clientPhone})</a>
          </div>
        </div>
      </div>
    `;

    await mailTransporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      subject: `🚨 জরুরি বৃক্ষ চিকিৎসা রিকোয়েস্ট: ${data.clientName} (${data.clientLocation})`,
      html: mailHtml,
    });

    return { success: true };
  } catch (error: any) {
    console.warn("Failed to send tree doctor emergency email:", error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Send contact form message to admin
 */
export async function sendContactMessageAlert(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">
        <h2 style="color: #14532d; margin-top: 0;">📩 নতুন কন্টাক্ট মেসেজ - A R Green Garden</h2>
        <p><strong>প্রেরক:</strong> ${data.name}</p>
        <p><strong>ইমেইল:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p><strong>ফোন:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-top: 12px;">
          <p style="margin: 0;"><strong>মেসেজ:</strong></p>
          <p style="margin: 4px 0 0 0; color: #374151;">${data.message}</p>
        </div>
      </div>
    `;

    await mailTransporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      subject: `📩 নতুন মেসেজ: ${data.name} (${data.email})`,
      html: mailHtml,
    });

    return { success: true };
  } catch (error: any) {
    console.warn("Failed to send contact message email:", error?.message);
    return { success: false, error: error?.message };
  }
}
