import { DEFAULT_ABOUT_CONFIG } from "@/types/about";
import {
  DEFAULT_CAREER_CONFIG,
  DEFAULT_ESTIMATOR_CONFIG,
  DEFAULT_EXTENDED_CONTACT_CONFIG,
  DEFAULT_LEGAL_CONFIG,
  DEFAULT_LOYALTY_CONFIG,
  DEFAULT_PAGES_CONFIG,
  DEFAULT_SHOP_CONFIG,
  DEFAULT_TREE_DOCTOR_CONFIG,
  DEFAULT_UI_TEXT_ITEMS,
  DEFAULT_WIZARD_CONFIG,
} from "@/types/cms";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const PRIVATE_KEYS = new Set(["password_reset_tokens", "newsletter_subscribers"]);

const DEFAULTS: Record<string, any> = {
  site_config: {
    title: "A R Green Garden",
    tagline: "Landscape Architecture & Biophilic Studio",
    phone: "01883012641",
    whatsapp: "8801883012641",
    email: "info@argreengarden.com",
    projectEmail: "project@argreengarden.com",
    address: "৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ",
    fbPage: "https://facebook.com/argreengarden",
    instagram: "",
    youtube: "https://youtube.com/argreengarden",
    linkedin: "",
    themeColor: "#2B4D33",
    secondaryColor: "#DAB200",
    seoTitleDefault: "A R Green Garden — Landscape Architecture & Biophilic Studio",
    seoDescription: "Premium Landscaping, Rooftop Gardens & Botanical Architecture in Bangladesh",
    seoKeywords: "ল্যান্ডস্কেপ ডিজাইন, ছাদবাগান, rooftop garden dhaka, tree doctor bangladesh",
    enableAnnouncement: false,
    announcementText: "",
    announcementLink: "/design-garden",
    announcementBar: "",
    announcementBarEnabled: false,
    currencySymbol: "৳",
    baseCostPerSqft: 280,
    consultationFee: "১,৫০০",
    emergencyDoctorActive: true,
    bookingActive: true,
    maintenanceMode: false,
    maintenanceTitleBn: "ওয়েবসাইট আপগ্রেড ও মেইনটেনেন্স চলছে",
    maintenanceTitleEn: "Scheduled Studio Maintenance",
    maintenanceMessage:
      "আরও উন্নত ডিজিটাল অভিজ্ঞতার জন্য আমাদের সিস্টেম হালনাগাদ হচ্ছে। জরুরি প্রয়োজনে হটলাইনে যোগাযোগ করুন।",
  },
  homepage_sections: {
    sections: [
      { id: "hero", label: "Hero Video", visible: true, order: 1 },
      { id: "manifesto", label: "Animated Manifesto", visible: true, order: 2 },
      { id: "projects", label: "Highlight Projects", visible: true, order: 3 },
      { id: "services", label: "Services Flip", visible: true, order: 4 },
      { id: "process", label: "Our Process", visible: true, order: 5 },
      { id: "campaign", label: "Campaign Banner", visible: true, order: 6 },
      { id: "activities", label: "Recent Activities", visible: true, order: 7 },
      { id: "life", label: "Studio Life", visible: true, order: 8 },
    ],
    hideStaticFallbacks: false,
    manifesto: {
      word1: "ENABLE",
      word2: "CHANGE",
      word3: "FOR",
      lineEn: "A BETTER EARTH",
      lineBn: "একটি সুন্দর পৃথিবীর জন্য পরিবর্তন আনুন",
      descriptionEn:
        "We design biophilic ecosystems, rooftop sanctuaries, and urban forests engineered to thrive sustainably for decades across Bangladesh.",
      descriptionBn:
        "আমরা টেকসই ছাদবাগান, বায়োফিলিক ইকোসিস্টেম এবং শহুরে সবুজ স্থাপত্য নির্মাণ করি যা প্রজন্মের পর প্রজন্ম টিকে থাকে।",
      image1: "/hero_plants.png",
      image2: "/featured_plant.png",
      accentColor: "#2B4D33",
    },
    projectsHeader: {
      eyebrowEn: "Selected Architectural Works",
      eyebrowBn: "নির্বাচিত স্থাপত্যকর্ম",
      titleEn: "Highlight Projects",
      titleBn: "নির্বাচিত প্রজেক্টসমূহ",
    },
    servicesHeader: {
      eyebrowEn: "Studio Capabilities",
      eyebrowBn: "আমাদের দক্ষতা ও সেবা",
      titleEn: "Our Services",
      titleBn: "বিশেষায়িত সেবাসমূহ",
    },
    activitiesHeader: {
      eyebrowEn: "Studio Dispatch & Events",
      eyebrowBn: "স্টুডিও সংবাদ ও ইভেন্ট",
      titleEn: "Recent Activities",
      titleBn: "সাম্প্রতিক কার্যক্রম",
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
      items: [
        {
          id: "camp-1",
          tagEn: "10TH ANNIVERSARY INITIATIVE",
          tagBn: "১০ম বার্ষিকী উদ্যোগ",
          titleEn: "A R GREEN GARDEN — Participating in the Climate Future",
          titleBn: "এ আর গ্রিন গার্ডেন — সবুজ ও টেকসই আগামীর অংশীদার",
          subtitleEn: "Transforming 100+ Dhaka concrete rooftops into cooling ecological sanctuaries.",
          subtitleBn: "ঢাকার ১০০+ কংক্রিট ছাদকে শীতল প্রাকৃতিক উদ্যানে রূপান্তরের বিশেষ অভিযান।",
          ctaLabelEn: "Explore Vision",
          ctaLabelBn: "আমাদের লক্ষ্য জানুন",
          ctaHref: "/about",
          image: "/hero_plants.png",
        },
        {
          id: "camp-2",
          tagEn: "URBAN FORESTRY & ARBORICULTURE",
          tagBn: "আরবান ফরেস্ট্রি ও বৃক্ষ চিকিৎসা",
          titleEn: "Complimentary Monsoon Rooftop Load & Drainage Audit",
          titleBn: "বর্ষা মৌসুমে বিনামূল্যে ছাদবাগান ও ড্রেইনেজ অডিট",
          subtitleEn: "Book a structural checkup and organic soil booster for your existing terrace garden.",
          subtitleBn: "আপনার বিদ্যমান ছাদবাগানের সুরক্ষার জন্য আজই বুক করুন বিশেষজ্ঞ অডিট।",
          ctaLabelEn: "Book Free Audit",
          ctaLabelBn: "অডিট বুক করুন",
          ctaHref: "/contact",
          image: "/featured_plant.png",
        },
      ],
    },
  },
  about_config: {
    titleEn: "About A R Green Garden",
    titleBn: "এ আর গ্রিন গার্ডেন সম্পর্কে",
    subtitleEn: "Bangladesh's Premier Landscape Architecture Studio",
    subtitleBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও",
    storyEn:
      "Founded with a passion for transforming urban spaces into living, breathing ecosystems, A R Green Garden has been at the forefront of sustainable landscape design in Bangladesh for over a decade.",
    storyBn:
      "শহুরে পরিবেশকে সবুজ, জীবন্ত ইকোসিস্টেমে রূপান্তর করার আবেগ নিয়ে প্রতিষ্ঠিত, এ আর গ্রিন গার্ডেন এক দশকেরও বেশি সময় ধরে বাংলাদেশে টেকসই ল্যান্ডস্কেপ ডিজাইনের অগ্রভাগে রয়েছে।",
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
  about_page_config: DEFAULT_ABOUT_CONFIG,
  team_config: {
    badgeEn: "Studio Architects & Arborists",
    badgeBn: "স্টুডিও আর্কিটেক্ট ও বোটানিস্ট টিম",
    titleEn: "Meet Our Expert Team",
    titleBn: "আমাদের বিশেষজ্ঞ দলের সাথে পরিচিত হন",
    subtitleEn: "A multidisciplinary collective of licensed landscape architects, structural engineers, and clinical botanists.",
    subtitleBn: "দক্ষ ল্যান্ডস্কেপ আর্কিটেক্ট, স্ট্রাকচারাল ইঞ্জিনিয়ার ও ক্লিনিক্যাল বোটানিস্টদের সমন্বয়ে আমাদের স্টুডিও পরিবার।",
    members: [],
  },
  faq_config: {
    badgeEn: "Knowledge Base • FAQ",
    badgeBn: "সাধারণ জিজ্ঞাসা ও তথ্যভাণ্ডার",
    titleEn: "Frequently Asked Questions",
    titleBn: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
    subtitleEn: "Answers to common questions about rooftop waterproofing, architectural design timelines, costs, and plant care.",
    subtitleBn: "ছাদবাগান, ওয়াটারপ্রুফিং, থ্রিডি ডিজাইন সময়সীমা ও পরিচর্যা বিষয়ক সাধারণ প্রশ্নের উত্তর।",
    items: [
      { id: "1", questionEn: "What areas do you serve?", questionBn: "আপনারা কোন এলাকায় সেবা দেন?", answerEn: "We serve all major areas of Dhaka including Dhanmondi, Gulshan, Banani, Mirpur, and surrounding areas, plus Chattogram and Sylhet hubs.", answerBn: "আমরা ধানমন্ডি, গুলশান, বনানী, মিরপুর সহ সমগ্র ঢাকা এবং চট্টগ্রাম ও সিলেট বিভাগে পূর্ণাঙ্গ সেবা দিয়ে থাকি।" },
      { id: "2", questionEn: "How long does a garden project take?", questionBn: "একটি গার্ডেন প্রজেক্ট সম্পন্ন করতে কতদিন লাগে?", answerEn: "Depending on the size and complexity, projects typically take 1-4 weeks to complete.", answerBn: "আকার ও জটিলতার উপর নির্ভর করে, প্রজেক্টগুলি সাধারণত ১-৪ সপ্তাহে সম্পন্ন হয়।" },
      { id: "3", questionEn: "Do you offer a warranty?", questionBn: "আপনারা কি ওয়ারেন্টি দেন?", answerEn: "Yes, we offer a 12-month workmanship and drainage warranty on all completed projects.", answerBn: "হ্যাঁ, আমরা সমস্ত সম্পন্ন প্রজেক্টে ১২ মাসের ওয়ার্কম্যানশিপ ও ড্রেইনেজ ওয়ারেন্টি দিই।" },
    ],
  },
  contact_config: DEFAULT_EXTENDED_CONTACT_CONFIG,
  footer_config: {
    descriptionEn: "Bangladesh's premier landscape architecture studio, creating sustainable green spaces since 2014.",
    descriptionBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও, ২০১৪ সাল থেকে টেকসই সবুজ স্থান তৈরি করছে।",
    copyrightText: "© 2026 A R Green Garden. All rights reserved.",
    newsletterTitleEn: "Receive news & offers from A R Green Garden",
    newsletterTitleBn: "নিয়মিত বোটানিক্যাল টিপস ও অফার পেতে যুক্ত হোন",
    newsletterPrivacyEn: "I acknowledge the privacy policy & agree to receive studio updates.",
    newsletterPrivacyBn: "আমি প্রাইভেসি পলিসি মেনে স্টুডিও নিউজলেটার পেতে সম্মত।",
    showNewsletter: true,
    showSocialLinks: true,
  },
  legal_config: DEFAULT_LEGAL_CONFIG,
  shop_config: DEFAULT_SHOP_CONFIG,
  estimator_config: DEFAULT_ESTIMATOR_CONFIG,
  wizard_config: DEFAULT_WIZARD_CONFIG,
  loyalty_config: DEFAULT_LOYALTY_CONFIG,
  tree_doctor_config: DEFAULT_TREE_DOCTOR_CONFIG,
  career_config: DEFAULT_CAREER_CONFIG,
  pages_config: DEFAULT_PAGES_CONFIG,
  ui_texts_config: { items: DEFAULT_UI_TEXT_ITEMS, deletedKeys: [] },
};

function mergeSettingWithDefault(key: string, stored: any): any {
  const def = DEFAULTS[key];
  if (!def || typeof stored !== "object" || stored === null || Array.isArray(stored)) {
    return stored ?? def ?? {};
  }
  if (key === "homepage_sections") {
    return {
      ...def,
      ...stored,
      manifesto: { ...def.manifesto, ...(stored.manifesto || {}) },
      projectsHeader: { ...def.projectsHeader, ...(stored.projectsHeader || {}) },
      servicesHeader: { ...def.servicesHeader, ...(stored.servicesHeader || {}) },
      activitiesHeader: { ...def.activitiesHeader, ...(stored.activitiesHeader || {}) },
      process: { ...def.process, ...(stored.process || {}) },
      campaign: {
        ...def.campaign,
        ...(stored.campaign || {}),
        items:
          Array.isArray(stored.campaign?.items) && stored.campaign.items.length > 0
            ? stored.campaign.items
            : def.campaign.items,
      },
    };
  }
  if (key === "ui_texts_config") {
    const existingItems = Array.isArray(stored.items) ? stored.items : [];
    const deleted = new Set<string>(Array.isArray(stored.deletedKeys) ? stored.deletedKeys : []);
    const existingKeys = new Set(existingItems.map((i: any) => i.key));
    const missingDefaults = DEFAULT_UI_TEXT_ITEMS.filter(
      (d) => !existingKeys.has(d.key) && !deleted.has(d.key)
    );
    return {
      deletedKeys: Array.from(deleted),
      items: [...existingItems, ...missingDefaults],
    };
  }
  return { ...def, ...stored };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const headers = NO_CACHE_HEADERS;

    if (key) {
      if (PRIVATE_KEYS.has(key)) {
        const { getCurrentUser } = await import("@/lib/apiAuth");
        const user = await getCurrentUser(req);
        if (!user || user.role?.toUpperCase() !== "ADMIN") {
          return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }
      }

      let setting = await prisma.setting.findUnique({ where: { key } });
      if (!setting) {
        const defaultVal = DEFAULTS[key] || {};
        setting = await prisma.setting.create({ data: { key, value: defaultVal } });
      }

      let value = mergeSettingWithDefault(key, setting.value);

      if (key === "career_config" && (!Array.isArray(value.jobs) || value.jobs.length === 0)) {
        const legacy = await prisma.setting.findUnique({ where: { key: "job_openings" } });
        if (legacy?.value) {
          try {
            const parsed = typeof legacy.value === "string" ? JSON.parse(legacy.value) : legacy.value;
            if (Array.isArray(parsed) && parsed.length > 0) value.jobs = parsed;
          } catch {
            // fallback to defaults
          }
        }
      }

      return NextResponse.json({ ...setting, value }, { headers });
    }

    const allSettings = await prisma.setting.findMany();
    const merged: Record<string, any> = {};
    for (const s of allSettings) {
      if (PRIVATE_KEYS.has(s.key)) continue;
      merged[s.key] = mergeSettingWithDefault(s.key, s.value);
    }

    for (const [k, v] of Object.entries(DEFAULTS)) {
      if (!merged[k]) merged[k] = v;
    }

    // Also hydrate career_config.jobs from legacy job_openings if needed
    if (merged["career_config"] && (!Array.isArray(merged["career_config"].jobs) || merged["career_config"].jobs.length === 0)) {
      const legacy = merged["job_openings"];
      if (legacy) {
        try {
          const parsed = typeof legacy === "string" ? JSON.parse(legacy) : legacy;
          if (Array.isArray(parsed) && parsed.length > 0) merged["career_config"].jobs = parsed;
        } catch {
          // ignore
        }
      }
    }

    const siteConf = merged["site_config"] || DEFAULTS["site_config"];

    return NextResponse.json(
      { ...siteConf, value: siteConf, ...merged, key: "site_config" },
      { headers }
    );
  } catch (error: any) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

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

    const EDITOR_PERMITTED_KEYS = new Set([
      "hero_config",
      "navbar_config",
      "homepage_sections",
      "about_config",
      "about_page_config",
      "team_config",
      "faq_config",
      "contact_config",
      "footer_config",
      "legal_config",
      "pages_config",
      "estimator_config",
      "wizard_config",
      "tree_doctor_config",
      "ui_texts_config",
    ]);

    if (EDITOR_PERMITTED_KEYS.has(targetKey)) {
      if (role !== "ADMIN" && role !== "EDITOR" && role !== "MODERATOR") {
        return NextResponse.json(
          { error: "Access Denied: Only Admin, Moderator or Editor can edit website studio content" },
          { status: 403 }
        );
      }
    } else {
      if (role !== "ADMIN") {
        return NextResponse.json(
          { error: "Access Denied: Only Admin can modify master settings and administrative configurations" },
          { status: 403 }
        );
      }
    }

    if (body.key && body.value !== undefined) {
      const setting = await prisma.setting.upsert({
        where: { key: body.key },
        update: { value: body.value },
        create: { key: body.key, value: body.value },
      });

      // Keep job_openings <-> career_config synced automatically
      if (body.key === "career_config" && Array.isArray(body.value?.jobs)) {
        await prisma.setting.upsert({
          where: { key: "job_openings" },
          update: { value: JSON.stringify(body.value.jobs) },
          create: { key: "job_openings", value: JSON.stringify(body.value.jobs) },
        });
      } else if (body.key === "job_openings") {
        try {
          const parsedJobs = typeof body.value === "string" ? JSON.parse(body.value) : body.value;
          if (Array.isArray(parsedJobs)) {
            const existingCareer = await prisma.setting.findUnique({ where: { key: "career_config" } });
            const baseCareer = (existingCareer?.value as any) || DEFAULT_CAREER_CONFIG;
            await prisma.setting.upsert({
              where: { key: "career_config" },
              update: { value: { ...baseCareer, jobs: parsedJobs } },
              create: { key: "career_config", value: { ...baseCareer, jobs: parsedJobs } },
            });
          }
        } catch {
          // ignore invalid JSON
        }
      }

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
