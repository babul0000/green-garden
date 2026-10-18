import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// Default values for each config key
const DEFAULTS: Record<string, any> = {
  site_config: {
    title: "A R Green Garden",
    phone: "01883012641",
    email: "info@argreengarden.com",
    address: "42/A, Road 9/A, Dhanmondi, Dhaka",
    fbPage: "https://facebook.com/argreengarden",
    youtube: "https://youtube.com/argreengarden",
    themeColor: "#15803d",
    seoDescription: "Premium Landscaping & Garden Design in Bangladesh",
    announcementBar: "",
    announcementBarEnabled: false,
  },
  homepage_sections: {
    sections: [
      { id: "hero",        label: "Hero Video",          visible: true, order: 1 },
      { id: "manifesto",   label: "Animated Manifesto",  visible: true, order: 2 },
      { id: "projects",    label: "Highlight Projects",  visible: true, order: 3 },
      { id: "services",    label: "Services Flip",       visible: true, order: 4 },
      { id: "process",     label: "Our Process",         visible: true, order: 5 },
      { id: "campaign",    label: "Campaign Banner",     visible: true, order: 6 },
      { id: "activities",  label: "Recent Activities",   visible: true, order: 7 },
      { id: "life",        label: "Studio Life",         visible: true, order: 8 },
    ],
    manifesto: {
      lineEn: "ENABLE CHANGE FOR A BETTER EARTH",
      lineBn: "একটি সুন্দর পৃথিবীর জন্য পরিবর্তন আনুন",
    },
    process: {
      titleEn: "A Thoughtful Journey",
      titleBn: "একটি সুচিন্তিত যাত্রা",
      steps: [
        { iconEn: "💬", titleEn: "Consultation", titleBn: "পরামর্শ", descEn: "Free site visit & discussion", descBn: "বিনামূল্যে সাইট ভিজিট ও আলোচনা" },
        { iconEn: "📐", titleEn: "Design", titleBn: "ডিজাইন", descEn: "Custom 3D concept design", descBn: "কাস্টম ৩ডি ডিজাইন" },
        { iconEn: "🌿", titleEn: "Implementation", titleBn: "বাস্তবায়ন", descEn: "Expert team execution", descBn: "দক্ষ দলের বাস্তবায়ন" },
        { iconEn: "🔧", titleEn: "Maintenance", titleBn: "রক্ষণাবেক্ষণ", descEn: "Ongoing care & support", descBn: "নিয়মিত পরিচর্যা ও সহায়তা" },
      ],
    },
    campaign: {
      textEn: "A R GREEN GARDEN — 10TH ANNIVERSARY — Participating in the Future",
      textBn: "এ আর গ্রিন গার্ডেন — ১০ম বার্ষিকী — ভবিষ্যতে অংশীদারিত্ব",
    },
  },
  about_config: {
    titleEn: "About A R Green Garden",
    titleBn: "এ আর গ্রিন গার্ডেন সম্পর্কে",
    subtitleEn: "Bangladesh's Premier Landscape Architecture Studio",
    subtitleBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও",
    storyEn: "Founded with a passion for transforming urban spaces into living, breathing ecosystems, A R Green Garden has been at the forefront of sustainable landscape design in Bangladesh for over a decade.",
    storyBn: "শহুরে পরিবেশকে সবুজ, জীবন্ত ইকোসিস্টেমে রূপান্তর করার আবেগ নিয়ে প্রতিষ্ঠিত, এ আর গ্রিন গার্ডেন এক দশকেরও বেশি সময় ধরে বাংলাদেশে টেকসই ল্যান্ডস্কেপ ডিজাইনের অগ্রভাগে রয়েছে।",
    visionEn: "To create a greener, more sustainable Bangladesh — one garden at a time.",
    visionBn: "একটি সবুজ, আরও টেকসই বাংলাদেশ গড়ে তোলা — একটি করে বাগান তৈরি করে।",
    missionEn: "Delivering premium landscape solutions that blend aesthetics with ecology.",
    missionBn: "নান্দনিকতা ও পরিবেশবিদ্যার সমন্বয়ে প্রিমিয়াম ল্যান্ডস্কেপ সমাধান প্রদান করা।",
    stats: [
      { labelEn: "Projects Completed", labelBn: "সম্পন্ন প্রকল্প", value: "96+" },
      { labelEn: "Happy Clients", labelBn: "সন্তুষ্ট গ্রাহক", value: "250+" },
      { labelEn: "Team Members", labelBn: "দলের সদস্য", value: "35+" },
      { labelEn: "Years of Experience", labelBn: "বছরের অভিজ্ঞতা", value: "10+" },
    ],
    coverImage: "",
    founderName: "Ar. Tanvir Chowdhury",
    founderTitle: "Founder & Chief Landscape Architect",
    founderPhoto: "",
    founderQuoteEn: "Every space has the potential to become a sanctuary.",
    founderQuoteBn: "প্রতিটি স্থানে একটি আশ্রয় হওয়ার সম্ভাবনা আছে।",
  },
  team_config: {
    titleEn: "Meet Our Expert Team",
    titleBn: "আমাদের বিশেষজ্ঞ দলের সাথে পরিচিত হন",
    members: [],
  },
  faq_config: {
    titleEn: "Frequently Asked Questions",
    titleBn: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
    items: [
      { id: "1", questionEn: "What areas do you serve?", questionBn: "আপনারা কোন এলাকায় সেবা দেন?", answerEn: "We serve all major areas of Dhaka including Dhanmondi, Gulshan, Banani, Mirpur, and surrounding areas.", answerBn: "আমরা ধানমন্ডি, গুলশান, বনানী, মিরপুর সহ ঢাকার সব প্রধান এলাকায় সেবা দিয়ে থাকি।" },
      { id: "2", questionEn: "How long does a garden project take?", questionBn: "একটি গার্ডেন প্রজেক্ট সম্পন্ন করতে কতদিন লাগে?", answerEn: "Depending on the size and complexity, projects typically take 1-4 weeks to complete.", answerBn: "আকার ও জটিলতার উপর নির্ভর করে, প্রজেক্টগুলি সাধারণত ১-৪ সপ্তাহে সম্পন্ন হয়।" },
      { id: "3", questionEn: "Do you offer a warranty?", questionBn: "আপনারা কি ওয়ারেন্টি দেন?", answerEn: "Yes, we offer a 12-month warranty on all completed projects.", answerBn: "হ্যাঁ, আমরা সমস্ত সম্পন্ন প্রজেক্টে ১২ মাসের ওয়ারেন্টি দিই।" },
    ],
  },
  contact_config: {
    titleEn: "Get In Touch",
    titleBn: "যোগাযোগ করুন",
    address: "42/A, Road 9/A, Dhanmondi, Dhaka-1209",
    phone: "01883012641",
    whatsapp: "8801883012641",
    email: "info@argreengarden.com",
    officeHours: "Saturday – Thursday: 9:00 AM – 6:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.297!2d90.3733!3d23.7461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ0JzQ2LjAiTiA5MMKwMjInMjMuOSJF!5e0!3m2!1sen!2sbd!4v1234567890!5m2!1sen!2sbd",
    fbPage: "https://facebook.com/argreengarden",
    instagram: "",
    youtube: "",
  },
  footer_config: {
    descriptionEn: "Bangladesh's premier landscape architecture studio, creating sustainable green spaces since 2014.",
    descriptionBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও, ২০১৪ সাল থেকে টেকসই সবুজ স্থান তৈরি করছে।",
    copyrightText: "© 2026 A R Green Garden. All rights reserved.",
    showNewsletter: true,
    showSocialLinks: true,
  },
};

// GET — Fetch one or all settings keys
// ?key=hero_config → single key
// no param → returns all merged into one object
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      // Return a single setting key
      let setting = await prisma.setting.findUnique({ where: { key } });
      if (!setting) {
        // Auto-create with defaults
        const defaultVal = DEFAULTS[key] || {};
        setting = await prisma.setting.create({ data: { key, value: defaultVal } });
      }
      return NextResponse.json(setting, { headers: NO_CACHE_HEADERS });
    }

    // Return ALL settings merged (backward-compatible: default key = site_config)
    const allSettings = await prisma.setting.findMany();
    const merged: Record<string, any> = {};
    for (const s of allSettings) {
      merged[s.key] = s.value;
    }

    // Fill missing keys with defaults
    for (const [k, v] of Object.entries(DEFAULTS)) {
      if (!merged[k]) merged[k] = v;
    }

    // Backward compat: top-level = site_config value + all keys under their names
    const siteConf = merged["site_config"] || DEFAULTS["site_config"];

    return NextResponse.json(
      { ...siteConf, value: siteConf, ...merged, key: "site_config" },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

// POST — Upsert a single key with RBAC validation
// Website Studio keys: ADMIN or EDITOR
// Master settings & Site config: ADMIN only
export async function POST(req: Request) {
  try {
    const { getCurrentUser } = await import("@/lib/apiAuth");
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = user.role?.toUpperCase();
    const body = await req.json();
    const targetKey = body.key || "site_config";

    // Permitted keys for EDITOR or ADMIN (Website Studio content)
    const EDITOR_PERMITTED_KEYS = new Set([
      "hero_config",
      "navbar_config",
      "homepage_sections",
      "about_config",
      "team_config",
      "faq_config",
      "contact_config",
      "footer_config",
    ]);

    if (EDITOR_PERMITTED_KEYS.has(targetKey)) {
      if (role !== "ADMIN" && role !== "EDITOR") {
        return NextResponse.json(
          { error: "Access Denied: Only Admin or Editor can edit website studio content" },
          { status: 403 }
        );
      }
    } else {
      // All other keys (master settings, career_config, security, site_config) strictly require ADMIN
      if (role !== "ADMIN") {
        return NextResponse.json(
          { error: "Access Denied: Only Admin can modify master settings and administrative configurations" },
          { status: 403 }
        );
      }
    }

    // If body has explicit { key, value } shape — use it
    if (body.key && body.value !== undefined) {
      const setting = await prisma.setting.upsert({
        where: { key: body.key },
        update: { value: body.value },
        create: { key: body.key, value: body.value },
      });

      const { logActivity } = await import("@/lib/activityLog");
      await logActivity({
        userId: user.id,
        userName: user.name,
        action: "UPDATE",
        entity: "Settings",
        entityId: body.key,
        summary: `স্টুডিও সেটিংস আপডেট করা হয়েছে (${body.key})`,
        details: { key: body.key },
      });

      return NextResponse.json(setting, { headers: NO_CACHE_HEADERS });
    }

    // Backward compat: body IS the value for site_config
    const setting = await prisma.setting.upsert({
      where: { key: "site_config" },
      update: { value: body },
      create: { key: "site_config", value: body },
    });

    const { logActivity } = await import("@/lib/activityLog");
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "UPDATE",
      entity: "Settings",
      entityId: "site_config",
      summary: "মাস্টার সাইট কনফিগ সেটিংস আপডেট করা হয়েছে",
      details: { key: "site_config" },
    });

    return NextResponse.json(setting, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
