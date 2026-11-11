// Centralized CMS Types & Bilingual Defaults for 100% Dynamic Control

export interface LocalizedText {
  bn: string;
  en: string;
}

/* ==================== 1. LEGAL POLICIES (Privacy, Terms, Refund) ==================== */
export interface LegalSection {
  id: string;
  headingBn: string;
  headingEn: string;
  bodyBn: string;
  bodyEn: string;
  bulletsBn?: string[];
  bulletsEn?: string[];
}

export interface LegalPageData {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  effectiveDateBn: string;
  effectiveDateEn: string;
  noticeBannerActive: boolean;
  noticeBannerBn: string;
  noticeBannerEn: string;
  sections: LegalSection[];
}

export interface LegalConfig {
  privacy: LegalPageData;
  terms: LegalPageData;
  refund: LegalPageData;
}

export const DEFAULT_LEGAL_CONFIG: LegalConfig = {
  privacy: {
    badgeBn: "আইনি ডকুমেন্টেশন • গোপনীয়তা",
    badgeEn: "Legal Documentation • Privacy",
    titleBn: "গোপনীয়তা নীতিমালা",
    titleEn: "Privacy Policy",
    subtitleBn:
      "এ আর গ্রিন গার্ডেন আপনার ব্যক্তিগত তথ্য ও স্থাপত্য প্রজেক্টের গোপনীয়তা সর্বোচ্চ গুরুত্বের সাথে সংরক্ষণ করে।",
    subtitleEn:
      "A R Green Garden is committed to protecting your personal data and architectural project confidentiality.",
    effectiveDateBn: "কার্যকর তারিখ: ১ জানুয়ারি ২০২৬",
    effectiveDateEn: "Effective Date: January 1, 2026",
    noticeBannerActive: false,
    noticeBannerBn: "",
    noticeBannerEn: "",
    sections: [
      {
        id: "priv-1",
        headingBn: "১. আমরা যে তথ্য সংগ্রহ করি",
        headingEn: "1. Information We Collect",
        bodyBn:
          "সাইট ভিজিট বুকিং, গার্ডেন ডিজাইন রিকোয়েস্ট, ট্রি ডক্টর পরামর্শ বা শপ অর্ডার দেওয়ার সময় আমরা আপনার নাম, ফোন নম্বর, ইমেইল এবং প্রজেক্টের ঠিকানা সংগ্রহ করি।",
        bodyEn:
          "When you book a site audit, submit a design commission, consult our Tree Doctor, or place a shop order, we collect your name, phone number, email, and site address.",
        bulletsBn: [
          "যোগাযোগের তথ্য (নাম, মোবাইল নম্বর ও ইমেইল)",
          "প্রজেক্টের স্থাপত্য মাপ, ছবি ও লোকেশন",
          "ডিজিটাল সার্ভিস কার্ড ও মেইনটেনেন্স হিস্ট্রি",
        ],
        bulletsEn: [
          "Contact details (name, mobile number, email)",
          "Site dimensions, photos, and project location",
          "Digital Service Card & botanical maintenance history",
        ],
      },
      {
        id: "priv-2",
        headingBn: "২. তথ্যের ব্যবহার ও সুরক্ষা",
        headingEn: "2. How We Use & Protect Data",
        bodyBn:
          "সংগ্রহকৃত তথ্য শুধুমাত্র আপনার ল্যান্ডস্কেপ সেবা প্রদান, কোটেশন তৈরি, পেমেন্ট ভেরিফিকেশন এবং জরুরি উদ্ভিদ স্বাস্থ্য পরামর্শের জন্য ব্যবহৃত হয়। কোনো তৃতীয় পক্ষের কাছে আমরা ডাটা বিক্রি করি না।",
        bodyEn:
          "Collected information is strictly used for delivering landscaping services, preparing quotations, verifying payments, and providing plant health support. We never sell client data to third parties.",
      },
      {
        id: "priv-3",
        headingBn: "৩. কুকিজ ও যোগাযোগের অধিকার",
        headingEn: "3. Cookies & Your Rights",
        bodyBn:
          "আপনি যেকোনো সময় আমাদের অ্যাডমিন বা সাপোর্ট ইমেইলে যোগাযোগ করে আপনার সংরক্ষিত প্রোফাইল তথ্য হালনাগাদ বা মুছে ফেলার অনুরোধ করতে পারেন।",
        bodyEn:
          "You may contact our studio support email at any time to update, export, or request deletion of your stored client profile data.",
      },
    ],
  },
  terms: {
    badgeBn: "আইনি ডকুমেন্টেশন • শর্তাবলী",
    badgeEn: "Legal Documentation • Terms",
    titleBn: "ব্যবহারের শর্তাবলী",
    titleEn: "Terms & Conditions",
    subtitleBn:
      "আমাদের ওয়েবসাইট, থ্রিডি ডিজাইন পরামর্শ ও ল্যান্ডস্কেপ এক্সিকিউশন সেবা গ্রহণের পূর্বে নিচের শর্তগুলো অনুগ্রহ করে পড়ুন।",
    subtitleEn:
      "Please review our terms governing studio consultations, 3D architectural design workflows, and botanical execution services.",
    effectiveDateBn: "কার্যকর তারিখ: ১ জানুয়ারি ২০২৬",
    effectiveDateEn: "Effective Date: January 1, 2026",
    noticeBannerActive: false,
    noticeBannerBn: "",
    noticeBannerEn: "",
    sections: [
      {
        id: "terms-1",
        headingBn: "১. সাইট ভিজিট ও কোটেশন",
        headingEn: "1. Site Audits & Quotations",
        bodyBn:
          "অনলাইন বাজেট এস্টিমেটর একটি আনুমানিক ধারণা প্রদান করে। চূড়ান্ত মূল্য ও স্ট্রাকচারাল লোড বিশ্লেষণ আমাদের ইঞ্জিনিয়ারদের সরেজমিন পরিদর্শনের পর নির্ধারিত হয়।",
        bodyEn:
          "Online estimator totals are preliminary architectural approximations. Final pricing is confirmed following an on-site structural and horticultural assessment.",
      },
      {
        id: "terms-2",
        headingBn: "২. মেধাস্বত্ব ও ডিজাইন কপিরাইট",
        headingEn: "2. Intellectual Property & Designs",
        bodyBn:
          "এ আর গ্রিন গার্ডেন কর্তৃক প্রস্তুতকৃত থ্রিডি রেন্ডার, মাস্টারপ্ল্যান ও ড্রয়িং আমাদের বৌদ্ধিক সম্পত্তি হিসেবে সংরক্ষিত। অনুমতি ব্যতীত বাণিজ্যিক পুনঃব্যবহার নিষিদ্ধ।",
        bodyEn:
          "All 3D renders, planting schedules, and architectural masterplans prepared by A R Green Garden remain the intellectual property of the studio unless transferred by signed agreement.",
      },
      {
        id: "terms-3",
        headingBn: "৩. পেমেন্ট ও কাজের সময়সূচি",
        headingEn: "3. Milestones & Payments",
        bodyBn:
          "প্রজেক্ট নিশ্চিতকরণের পর ইনভয়েস অনুযায়ী ধাপে ধাপে পেমেন্ট পরিশোধ করতে হয়। প্রাকৃতিক দুর্যোগ বা অনিবার্য কারণে সাইট কাজের সময়সূচি পারস্পরিক সম্মতিতে সমন্বয় হতে পারে।",
        bodyEn:
          "Project execution proceeds according to approved milestone invoices. Schedules may be adjusted collaboratively in case of severe weather or site readiness delays.",
      },
    ],
  },
  refund: {
    badgeBn: "আইনি ডকুমেন্টেশন • রিফান্ড নীতি",
    badgeEn: "Legal Documentation • Refund Policy",
    titleBn: "রিফান্ড ও রিটার্ন নীতিমালা",
    titleEn: "Refund & Return Policy",
    subtitleBn:
      "স্বচ্ছ ও ন্যায্য গ্রাহক সেবার লক্ষ্যে আমাদের উদ্ভিদ, গার্ডেন প্রোডাক্ট ও প্রজেক্ট বুকিং রিফান্ড গাইডলাইন।",
    subtitleEn:
      "Our transparent return and refund guidelines for botanical products, pots, and landscape consultation bookings.",
    effectiveDateBn: "কার্যকর তারিখ: ১ জানুয়ারি ২০২৬",
    effectiveDateEn: "Effective Date: January 1, 2026",
    noticeBannerActive: false,
    noticeBannerBn: "",
    noticeBannerEn: "",
    sections: [
      {
        id: "ref-1",
        headingBn: "১. শপ প্রোডাক্ট ও জীবন্ত চারা",
        headingEn: "1. Nursery Plants & Shop Items",
        bodyBn:
          "ডেলিভারির সময় ক্ষতিগ্রস্ত পাত্র বা অসুস্থ গাছ পাওয়া গেলে ২৪ ঘণ্টার মধ্যে ছবি সহ রিপোর্ট করলে সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট বা রিফান্ড প্রদান করা হয়।",
        bodyEn:
          "If a plant arrives severely damaged or a planter is cracked during transit, report with photos within 24 hours of delivery for a free replacement or full refund.",
      },
      {
        id: "ref-2",
        headingBn: "২. বুকিং ও ডিজাইন ফি রিফান্ড",
        headingEn: "2. Consultation & Design Cancellations",
        bodyBn:
          "সাইট ভিজিটের অন্তত ২৪ ঘণ্টা পূর্বে বাতিল করলে ভিজিট ফি ১০০% রিফান্ডযোগ্য। থ্রিডি ডিজাইন ড্রাফট শুরু হওয়ার পর ডিজাইন ফি ফেরতযোগ্য নয়।",
        bodyEn:
          "Site audit bookings cancelled at least 24 hours before the scheduled slot qualify for a 100% refund. Once 3D drafting has commenced, design retainers are non-refundable.",
      },
      {
        id: "ref-3",
        headingBn: "৩. রিফান্ড প্রসেসিং সময়",
        headingEn: "3. Refund Settlement Timeline",
        bodyBn:
          "অনুমোদিত রিফান্ড ৭ থেকে ১০ কর্মদিবসের মধ্যে আপনার মূল পেমেন্ট মাধ্যম (SSLCommerz, বিকাশ বা ব্যাংক) এ প্রেরণ করা হয়।",
        bodyEn:
          "Approved refunds are processed within 7 to 10 business days back to your original payment method (SSLCommerz, bKash, or bank transfer).",
      },
    ],
  },
};

/* ==================== 2. SHOP & E-COMMERCE ==================== */
export interface ShopProduct {
  id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  unitBn: string;
  unitEn: string;
  image: string;
  badgeBn?: string;
  badgeEn?: string;
  rating?: number;
  descriptionBn: string;
  descriptionEn: string;
  careTipsBn?: string;
  careTipsEn?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ShopCategory {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface ShopConfig {
  heroBadgeBn: string;
  heroBadgeEn: string;
  heroTitleBn: string;
  heroTitleEn: string;
  heroSubtitleBn: string;
  heroSubtitleEn: string;
  deliveryCharge: number;
  freeShippingMin: number;
  taxPercent: number;
  enableCod: boolean;
  enableBkash: boolean;
  enableOnlinePayment: boolean;
  bkashNumber: string;
  categories: ShopCategory[];
  products: ShopProduct[];
}

export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  heroBadgeBn: "কিউরেটেড নার্সারি ও স্টুডিও",
  heroBadgeEn: "Curated Nursery & Studio",
  heroTitleBn: "এ আর গ্রিন স্টোর",
  heroTitleEn: "A R Green Botanical Store",
  heroSubtitleBn:
    "বাছাইকৃত ইনডোর ও ছাদবাগানের উদ্ভিদ, আর্কিটেকচারাল প্ল্যান্টার এবং জৈব সার সরাসরি আপনার ঠিকানায় ডেলিভারি।",
  heroSubtitleEn:
    "Curated architectural indoor plants, weatherproof fiberglass planters, and organic nutrients delivered across Bangladesh.",
  deliveryCharge: 120,
  freeShippingMin: 5000,
  taxPercent: 0,
  enableCod: true,
  enableBkash: true,
  enableOnlinePayment: true,
  bkashNumber: "01883012641",
  categories: [
    { id: "all", nameBn: "সকল পণ্য", nameEn: "All Products" },
    { id: "Indoor Plants", nameBn: "ইনডোর প্ল্যান্টস", nameEn: "Indoor Plants" },
    { id: "Outdoor Plants", nameBn: "আউটডোর ও ছাদবাগান", nameEn: "Outdoor & Rooftop" },
    { id: "Pots & Planters", nameBn: "পট ও প্ল্যান্টার", nameEn: "Pots & Planters" },
    { id: "Soil & Care", nameBn: "মাটি ও অর্গানিক কেয়ার", nameEn: "Soil & Organic Care" },
  ],
  products: [
    {
      id: "monstera-deliciosa",
      nameBn: "মনস্টেরা ডেলিসিওসা (প্রিমিয়াম)",
      nameEn: "Monstera Deliciosa (Architectural Specimen)",
      category: "Indoor Plants",
      price: 1850,
      oldPrice: 2200,
      stock: 24,
      unitBn: "টি",
      unitEn: "Plant",
      image: "/hero_plants.png",
      badgeBn: "বেস্ট সেলার",
      badgeEn: "Best Seller",
      rating: 4.9,
      descriptionBn:
        "বড় ছিদ্রযুক্ত পাতা সমৃদ্ধ আধুনিক ইনডোর প্ল্যান্ট, লিভিং রুম ও কর্পোরেট লবির জন্য উপযুক্ত।",
      descriptionEn:
        "Iconic split-leaf architectural indoor specimen suited for living spaces and corporate lobbies.",
      careTipsBn: "উজ্জ্বল পরোক্ষ আলো এবং সপ্তাহে ২ বার পরিমিত পানি দিন।",
      careTipsEn: "Bright indirect light; water moderately twice weekly.",
      isFeatured: true,
      isActive: true,
    },
    {
      id: "fiddle-leaf-fig",
      nameBn: "ফিডল লিফ ফিগ ট্রি",
      nameEn: "Fiddle Leaf Fig Tree",
      category: "Indoor Plants",
      price: 2600,
      oldPrice: 3000,
      stock: 15,
      unitBn: "টি",
      unitEn: "Plant",
      image: "/featured_plant.png",
      badgeBn: "আর্কিটেকচারাল চয়েস",
      badgeEn: "Architect Choice",
      rating: 4.8,
      descriptionBn:
        "৪ ফুট উচ্চতার সুদৃশ্য বেহালা-আকৃতির পাতার গাছ, আর্কিটেকচারাল কর্নারের শোভা বাড়ায়।",
      descriptionEn:
        "4ft tall sculptural indoor fig with broad emerald leaves for minimalist interior corners.",
      careTipsBn: "জানালা সংলগ্ন ফিল্টার্ড সূর্যালোক পছন্দ করে।",
      careTipsEn: "Prefers filtered sunlight near bright windows.",
      isFeatured: true,
      isActive: true,
    },
    {
      id: "terracotta-planter-set",
      nameBn: "মিনিমালিস্ট সিরামিক ও টেরাকোটা পট সেট",
      nameEn: "Minimalist Ceramic & Terracotta Planter",
      category: "Pots & Planters",
      price: 1450,
      oldPrice: 1750,
      stock: 40,
      unitBn: "টি",
      unitEn: "Pot",
      image: "/hero_plants.png",
      badgeBn: "হ্যান্ডক্রাফটেড",
      badgeEn: "Handcrafted",
      rating: 4.9,
      descriptionBn:
        "ব্রিদেবল মাটি ও ম্যাট ফিনিশ ড্রেইনেজ প্লেট সহ আধুনিক গোল প্ল্যান্টার।",
      descriptionEn:
        "Breathable artisan matte planter complete with matching drainage saucer.",
      careTipsBn: "নিচের ড্রেইনেজ ছিদ্র পরিষ্কার রাখুন।",
      careTipsEn: "Keep bottom drainage hole clear of debris.",
      isFeatured: false,
      isActive: true,
    },
    {
      id: "vermicompost-organic-mix",
      nameBn: "স্টুডিও গ্রেড অর্গানিক কোকোপিট ও ভার্মিকম্পোস্ট (১০ কেজি)",
      nameEn: "Studio Organic Potting Mix & Vermicompost (10 KG)",
      category: "Soil & Care",
      price: 680,
      oldPrice: 800,
      stock: 80,
      unitBn: "ব্যাগ",
      unitEn: "Bag",
      image: "/featured_plant.png",
      badgeBn: "১০০% জৈব",
      badgeEn: "100% Organic",
      rating: 5.0,
      descriptionBn:
        "ছাদবাগান ও ইনডোর পটের জন্য হালকা ও পুষ্টিসমৃদ্ধ জৈব মিশ্রণ (ভার্মিকম্পোস্ট, কোকোপিট, পার্লাইট ও নিম খৈল)।",
      descriptionEn:
        "Lightweight rooftop-safe potting blend enriched with vermicompost, coco peat, perlite, and neem cake.",
      careTipsBn: "সরাসরি রোপণ বা টপ-ড্রেসিংয়ের জন্য ব্যবহার করুন।",
      careTipsEn: "Ready to pot directly or apply as nutrient top-dressing.",
      isFeatured: false,
      isActive: true,
    },
    {
      id: "rooftop-bougainvillea",
      nameBn: "গ্রাফটেড মাল্টিকালার বাগানবিলাস বনসাই স্টাইল",
      nameEn: "Grafted Multi-Color Bougainvillea",
      category: "Outdoor Plants",
      price: 1950,
      stock: 18,
      unitBn: "টি",
      unitEn: "Plant",
      image: "/hero_plants.png",
      badgeBn: "ছাদবাগান বিশেষ",
      badgeEn: "Rooftop Favorite",
      rating: 4.8,
      descriptionBn:
        "কড়া রোদ সহনশীল এবং বারোমাস রঙিন ফুলে ভরা ছাদবাগান ও ব্যালকনির আদর্শ উদ্ভিদ।",
      descriptionEn:
        "Sun-loving, drought-tolerant grafted bougainvillea bred for Dhaka rooftop terraces.",
      careTipsBn: "পূর্ণ রোদে রাখুন এবং ফুল ফোটার জন্য মাটি সামান্য শুকনো হতে দিন।",
      careTipsEn: "Place in full sun; allow topsoil to dry slightly between waterings.",
      isFeatured: true,
      isActive: true,
    },
  ],
};

/* ==================== 3. BUDGET ESTIMATOR ==================== */
export interface EstimatorTypeOption {
  id: string;
  labelBn: string;
  labelEn: string;
  ratePerSqft: number;
}

export interface EstimatorTierOption {
  id: string;
  labelBn: string;
  labelEn: string;
  descBn: string;
  descEn: string;
  multiplier: number;
}

export interface EstimatorConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  minAreaSqft: number;
  maxAreaSqft: number;
  defaultAreaSqft: number;
  currencyLabel: string;
  disclaimerBn: string;
  disclaimerEn: string;
  submitLabelBn: string;
  submitLabelEn: string;
  types: EstimatorTypeOption[];
  tiers: EstimatorTierOption[];
}

export const DEFAULT_ESTIMATOR_CONFIG: EstimatorConfig = {
  badgeBn: "আর্কিটেকচারাল এস্টিমেটর",
  badgeEn: "Architectural Estimator",
  titleBn: "প্রজেক্ট বাজেট ও কস্ট এস্টিমেটর",
  titleEn: "Architectural Budget Estimator",
  subtitleBn:
    "আপনার স্পেসের আয়তন ও ডিজাইন ক্যাটাগরি নির্বাচন করে তাৎক্ষণিক আনুমানিক খরচ হিসাব করুন।",
  subtitleEn:
    "Select your garden type, footprint area, and finishing tier for an instant architectural cost estimate.",
  minAreaSqft: 50,
  maxAreaSqft: 5000,
  defaultAreaSqft: 500,
  currencyLabel: "৳",
  disclaimerBn:
    "* এটি একটি আনুমানিক বাজেট। চূড়ান্ত খরচ ওয়াটারপ্রুফিং, ড্রেনেজ এবং স্ট্রাকচারাল অডিটের পর নির্ধারিত হবে।",
  disclaimerEn:
    "* Preliminary architectural estimate. Final cost depends on waterproofing, drainage, and structural site assessment.",
  submitLabelBn: "এস্টিমেট সংরক্ষণ ও পরামর্শ নিন",
  submitLabelEn: "Save Estimate & Request Audit",
  types: [
    { id: "rooftop", labelBn: "ছাদ বাগান (Rooftop)", labelEn: "Rooftop Garden", ratePerSqft: 280 },
    { id: "vertical", labelBn: "ভার্টিকেল গার্ডেন", labelEn: "Vertical Bio-Wall", ratePerSqft: 450 },
    { id: "backyard", labelBn: "লন ও ব্যাকইয়ার্ড", labelEn: "Backyard & Villa Lawn", ratePerSqft: 220 },
    { id: "indoor", labelBn: "ইনডোর অফিস বায়োফিলিয়া", labelEn: "Indoor Office Biophilia", ratePerSqft: 190 },
  ],
  tiers: [
    {
      id: "essential",
      labelBn: "এসেনশিয়াল গার্ডেন",
      labelEn: "Essential Botanical",
      descBn: "মৌলিক প্ল্যান্টার, মাটি প্রস্তুত ও মৌসুমি উদ্ভিদ",
      descEn: "Core planters, organic soil beds, and hardy plants",
      multiplier: 1.0,
    },
    {
      id: "signature",
      labelBn: "সিগনেচার আর্কিটেকচার",
      labelEn: "Signature Landscape",
      descBn: "থ্রিডি ডিজাইন, ড্রিপ ইরিগেশন, লাইটিং ও পারগোলা",
      descEn: "3D design, automated drip irrigation, lighting & seating",
      multiplier: 1.6,
    },
    {
      id: "luxury",
      labelBn: "লাক্সারি রিসোর্ট এডিশন",
      labelEn: "Luxury Bespoke Resort",
      descBn: "কাস্টম ওয়াটার ফিচার, উড ডেকিং ও বিরল এক্সটিক ট্রি",
      descEn: "Water features, hardwood decking & rare mature specimens",
      multiplier: 2.4,
    },
  ],
};

/* ==================== 4. DESIGN YOUR GARDEN WIZARD ==================== */
export interface WizardOptionItem {
  id: string;
  labelBn: string;
  labelEn: string;
  descBn?: string;
  descEn?: string;
  icon?: string;
}

export interface WizardConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  spaces: WizardOptionItem[];
  styles: WizardOptionItem[];
  features: WizardOptionItem[];
  budgets: WizardOptionItem[];
}

export const DEFAULT_WIZARD_CONFIG: WizardConfig = {
  badgeBn: "ইন্টার‍্যাক্টিভ ৩ডি প্ল্যানার",
  badgeEn: "Interactive 3D Planner",
  titleBn: "আপনার স্বপ্নের বাগান ডিজাইন করুন",
  titleEn: "Design Your Architectural Garden",
  subtitleBn:
    "কয়েকটি ধাপে আপনার স্পেস, পছন্দ ও বাজেট জানান — আমাদের ল্যান্ডস্কেপ আর্কিটেক্ট আপনার জন্য কাস্টম থ্রিডি প্রপোজাল প্রস্তুত করবেন।",
  subtitleEn:
    "Complete this 4-step studio brief so our architects can prepare your bespoke 3D concept proposal.",
  spaces: [
    { id: "Rooftop Garden", labelBn: "ছাদ বাগান", labelEn: "Rooftop Terrace", icon: "🏢" },
    { id: "Home Balcony", labelBn: "ব্যালকনি গার্ডেন", labelEn: "Apartment Balcony", icon: "🪴" },
    { id: "Villa Backyard / Lawn", labelBn: "বাড়ির আঙিনা ও লন", labelEn: "Villa Backyard & Lawn", icon: "🏡" },
    { id: "Corporate / Office Space", labelBn: "কর্পোরেট ও অফিস ইনডোর", labelEn: "Corporate Biophilia", icon: "🏛️" },
    { id: "Resort / Commercial", labelBn: "রিসোর্ট ও কমার্শিয়াল", labelEn: "Resort & Commercial", icon: "🌴" },
  ],
  styles: [
    { id: "Modern Minimalist", labelBn: "আধুনিক মিনিমালিস্ট", labelEn: "Modern Minimalist", descBn: "পরিচ্ছন্ন জ্যামিতিক লাইন ও স্কাল্পচারাল গাছ", descEn: "Clean architectural lines & specimen greenery" },
    { id: "Tropical Zen Oasis", labelBn: "ট্রপিক্যাল জেন ওয়েসিস", labelEn: "Tropical Zen Oasis", descBn: "শান্তিপূর্ণ ঝর্ণা, বাঁশ ও ঘন সবুজ আবহ", descEn: "Serene water court, bamboo & lush canopies" },
    { id: "Mediterranean Terrace", labelBn: "মেডিটেরানিয়ান টেরাকোটা", labelEn: "Mediterranean Terrace", descBn: "প্রাকৃতিক পাথর, ওলিভ ও সাইট্রাস গাছ", descEn: "Warm stone textures, olive & citrus accents" },
    { id: "Urban Productive Kitchen", labelBn: "শহুরে অর্গানিক কৃষি ছাদ", labelEn: "Urban Kitchen Garden", descBn: "রেইজড বেড, ফলজ বৃক্ষ ও অর্গানিক সবজি", descEn: "Elevated organic fruit & culinary planters" },
  ],
  features: [
    { id: "Automated Drip Irrigation", labelBn: "অটো ড্রিপ ইরিগেশন", labelEn: "Auto Drip Irrigation", icon: "💧" },
    { id: "Architectural Night Lighting", labelBn: "নাইট গার্ডেন লাইটিং", labelEn: "Architectural Lighting", icon: "💡" },
    { id: "Pergola & Wooden Decking", labelBn: "পারগোলা ও উড ডেকিং", labelEn: "Pergola & Wood Deck", icon: "🪵" },
    { id: "Koi Pond / Water Feature", labelBn: "কই ফিশ পন্ড ও ঝর্ণা", labelEn: "Koi Pond & Water Feature", icon: "🌊" },
    { id: "Outdoor BBQ & Seating Lounge", labelBn: "সিটিং লাউঞ্জ ও বারবিকিউ জোন", labelEn: "Seating & BBQ Lounge", icon: "🛋️" },
    { id: "Vertical Living Bio-Wall", labelBn: "ভার্টিকেল লিভিং গ্রিন ওয়াল", labelEn: "Vertical Bio-Wall", icon: "🌿" },
  ],
  budgets: [
    { id: "৳1,50,000 - ৳3,00,000", labelBn: "৳১.৫ লক্ষ - ৳৩ লক্ষ", labelEn: "BDT 150K - 300K" },
    { id: "৳3,00,000 - ৳7,00,000", labelBn: "৳৩ লক্ষ - ৳৭ লক্ষ", labelEn: "BDT 300K - 700K" },
    { id: "৳7,00,000 - ৳15,00,000", labelBn: "৳৭ লক্ষ - ৳১৫ লক্ষ", labelEn: "BDT 700K - 1.5M" },
    { id: "৳15,00,000+", labelBn: "৳১৫ লক্ষ+ (বেসপোক লাক্সারি)", labelEn: "BDT 1.5M+ (Bespoke)" },
  ],
};

/* ==================== 5. CLIENT LOYALTY & CARE PACKAGES ==================== */
export interface LoyaltyRewardItem {
  id: string;
  titleBn: string;
  titleEn: string;
  pointsCost: number;
  descBn: string;
  descEn: string;
  icon: string;
}

export interface CarePackageItem {
  id: string;
  nameBn: string;
  nameEn: string;
  priceBn: string;
  priceEn: string;
  frequencyBn: string;
  frequencyEn: string;
  featuresBn: string[];
  featuresEn: string[];
  highlighted?: boolean;
}

export interface LoyaltyConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  vipThresholdPoints: number;
  referralBonusTitleBn: string;
  referralBonusTitleEn: string;
  referralBonusDescBn: string;
  referralBonusDescEn: string;
  rewards: LoyaltyRewardItem[];
  packages: CarePackageItem[];
}

export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  badgeBn: "গ্রিন প্রিভিলেজ ক্লাব",
  badgeEn: "Green Privilege Club",
  titleBn: "লয়্যালটি রিওয়ার্ডস ও কেয়ার মেম্বারশিপ",
  titleEn: "Loyalty Rewards & Botanical Care Tiers",
  subtitleBn:
    "আপনার প্রতিটি বুকিং, ইনভয়েস ও রেফারেলের মাধ্যমে অর্জিত গ্রিন পয়েন্ট দিয়ে বিনামূল্যে গার্ডেন কেয়ার ও ডিসকাউন্ট ক্লেইম করুন।",
  subtitleEn:
    "Redeem earned Green Points from your projects and referrals for complimentary arborist care and exclusive studio perks.",
  vipThresholdPoints: 1000,
  referralBonusTitleBn: "বন্ধু বা প্রতিবেশী রেফার করুন — পাবেন ১,০০০৳ বোনাস ক্রেডিট!",
  referralBonusTitleEn: "Refer a Neighbor or Architect — Earn BDT 1,000 Studio Credit!",
  referralBonusDescBn:
    "আপনার রেফারেল কোড ব্যবহার করে নতুন কোনো ছাদবাগান বা মেইনটেনেন্স বুকিং হলে আপনি ও আপনার বন্ধু উভয়েই পাবেন বিশেষ ছাড়।",
  referralBonusDescEn:
    "Both you and your referred client receive studio credit upon first confirmed project or annual care plan.",
  rewards: [
    {
      id: "rew-fertilizer",
      titleBn: "ফ্রি অর্গানিক সার ও মাটি রিফ্রেশ প্যাক",
      titleEn: "Complimentary Organic Soil & Nutrient Pack",
      pointsCost: 250,
      descBn: "আপনার ছাদবাগান বা ইনডোর গাছের জন্য ১০ কেজি প্রিমিয়াম ভার্মিকম্পোস্ট বক্স।",
      descEn: "10 KG studio-grade vermicompost & micronutrient booster delivery.",
      icon: "🌱",
    },
    {
      id: "rew-checkup",
      titleBn: "জরুরি ট্রি ডক্টর অনসাইট চেকআপ",
      titleEn: "Free Emergency Tree Doctor Site Visit",
      pointsCost: 500,
      descBn: "আমাদের বিশেষজ্ঞ বোটানিস্ট দ্বারা আপনার বাগানের পূর্ণ স্বাস্থ্য পরীক্ষা।",
      descEn: "Full onsite diagnosis and pest treatment plan by our chief arborist.",
      icon: "🩺",
    },
    {
      id: "rew-discount",
      titleBn: "প্রজেক্ট বা শপ অর্ডারে ২,৫০০৳ ডিসকাউন্ট ভাউচার",
      titleEn: "BDT 2,500 Studio Design & Shop Voucher",
      pointsCost: 1000,
      descBn: "যেকোনো নতুন ল্যান্ডস্কেপ সম্প্রসারণ বা শপ অর্ডারে সরাসরি ব্যবহারযোগ্য।",
      descEn: "Redeemable directly toward new garden upgrades or botanical store purchases.",
      icon: "💎",
    },
  ],
  packages: [
    {
      id: "pkg-basic",
      nameBn: "বেসিক গার্ডেন কেয়ার",
      nameEn: "Essential Care",
      priceBn: "৳৩,৫০০ / মাস",
      priceEn: "BDT 3,500 / mo",
      frequencyBn: "মাসে ২ বার অভিজ্ঞ মালি ভিজিট",
      frequencyEn: "2 Scheduled Gardener Visits / mo",
      featuresBn: ["প্রুনিং ও আগাছা পরিষ্কার", "অর্গানিক পেস্ট স্প্রে", "মাসিক গ্রোথ রিপোর্ট"],
      featuresEn: ["Pruning & weeding", "Organic pest protection", "Monthly health summary"],
    },
    {
      id: "pkg-pro",
      nameBn: "প্রো আর্কিটেকচারাল কেয়ার",
      nameEn: "Architectural Pro Care",
      priceBn: "৳৭,৫০০ / মাস",
      priceEn: "BDT 7,500 / mo",
      frequencyBn: "সাপ্তাহিক ভিজিট + ট্রি ডক্টর অডিট",
      frequencyEn: "Weekly Care + Arborist Audit",
      highlighted: true,
      featuresBn: [
        "সাপ্তাহিক স্পেশালাইজড মালি সেবা",
        "বিনামূল্যে মৌসুমি সার ও সয়েল রিচার্জ",
        "অটো ইরিগেশন ও লাইটিং চেকআপ",
        "ডিজিটাল সার্ভিস কার্ড লাইভ ট্র্যাকিং",
      ],
      featuresEn: [
        "Weekly trained horticultural team",
        "Complimentary seasonal fertilizer",
        "Irrigation & landscape lighting check",
        "Live Digital Service Card logs",
      ],
    },
  ],
};

/* ==================== 6. TREE DOCTOR CONFIG ==================== */
export interface TreeDoctorConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  hotline: string;
  whatsapp: string;
  visitFeeBn: string;
  visitFeeEn: string;
  responseTimeBn: string;
  responseTimeEn: string;
  emergencyNoteBn: string;
  emergencyNoteEn: string;
  showShowcaseRecords: boolean;
}

export const DEFAULT_TREE_DOCTOR_CONFIG: TreeDoctorConfig = {
  badgeBn: "ক্লিনিক্যাল বোটানি ও ট্রি ডক্টর",
  badgeEn: "Clinical Arboriculture • Tree Clinic",
  titleBn: "জরুরি বৃক্ষ চিকিৎসক ও উদ্ভিদ স্বাস্থ্য ক্লিনিক",
  titleEn: "Emergency Tree Doctor & Plant Health Clinic",
  subtitleBn:
    "গাছের পাতা হলুদ হওয়া, ছত্রাক বা পোকামাকড়ের আক্রমণ কিংবা শিকড় পচা রোধে বাংলাদেশের প্রথম বিশেষজ্ঞ বৃক্ষ চিকিৎসা ও মাইক্রোবিয়াল রিকভারি সেবা।",
  subtitleEn:
    "Rapid diagnosis for fungal infections, pest outbreaks, root rot, and chlorosis by our certified urban arborists across Bangladesh.",
  hotline: "01883012641",
  whatsapp: "8801883012641",
  visitFeeBn: "৳১,৫০০",
  visitFeeEn: "BDT 1,500",
  responseTimeBn: "২৪ ঘণ্টার মধ্যে সাইট ভিজিট / ২ ঘণ্টায় ছবি রিভিউ",
  responseTimeEn: "Site Visit Within 24h / Photo Triage in 2h",
  emergencyNoteBn:
    "জরুরি অবস্থায় আক্রান্ত পাতা বা কাণ্ডের স্পষ্ট ছবি আপলোড করুন অথবা সরাসরি হটলাইনে কল করুন।",
  emergencyNoteEn:
    "Upload clear photos of affected leaves or stems for rapid diagnosis, or call our emergency hotline.",
  showShowcaseRecords: true,
};

/* ==================== 7. CONTACT BRANCHES ==================== */
export interface ContactBranch {
  id: string;
  cityBn: string;
  cityEn: string;
  titleBn: string;
  titleEn: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  email: string;
  hoursBn: string;
  hoursEn: string;
  mapUrl?: string;
}

export interface ExtendedContactConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  formTitleBn: string;
  formTitleEn: string;
  formSubtitleBn: string;
  formSubtitleEn: string;
  submitLabelBn: string;
  submitLabelEn: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  branches: ContactBranch[];
}

export const DEFAULT_EXTENDED_CONTACT_CONFIG: ExtendedContactConfig = {
  badgeBn: "স্টুডিও যোগাযোগ ও শাখাসমূহ",
  badgeEn: "Studio Inquiries & Locations",
  titleBn: "আপনার সবুজ প্রকল্পের সূচনা করুন",
  titleEn: "Start Your Biophilic Transformation",
  subtitleBn:
    "নতুন ল্যান্ডস্কেপ আর্কিটেকচার, ছাদবাগান অডিট বা কর্পোরেট চুক্তির জন্য আমাদের ঢাকা প্রধান স্টুডিও অথবা আঞ্চলিক শাখায় যোগাযোগ করুন।",
  subtitleEn:
    "Reach out to our Dhaka headquarters or regional hubs for bespoke architectural proposals, site audits, and corporate retainers.",
  formTitleBn: "প্রজেক্ট প্রপোজাল বা বার্তা পাঠান",
  formTitleEn: "Send a Project Brief or Inquiry",
  formSubtitleBn:
    "বিস্তারিত তথ্য দিয়ে ফর্মটি পূরণ করুন — আমাদের আর্কিটেক্ট টিম দ্রুত উত্তর দেবেন।",
  formSubtitleEn:
    "Share your site scope below and our landscape architects will respond promptly.",
  submitLabelBn: "বার্তা পাঠান",
  submitLabelEn: "Send Message",
  address: "ধানমন্ডি ৯/এ, ঢাকা ১২০৯, বাংলাদেশ",
  phone: "+880 1883-012641",
  email: "info@argreengarden.com",
  hours: "Sat – Thu: 9:00 AM – 7:00 PM",
  mapEmbedUrl: "",
  branches: [
    {
      id: "branch-dhaka",
      cityBn: "ঢাকা (প্রধান স্টুডিও)",
      cityEn: "Dhaka HQ Studio",
      titleBn: "ঢাকা প্রধান আর্কিটেকচার স্টুডিও",
      titleEn: "Dhaka Headquarter & Experience Center",
      addressBn: "বাড়ি ৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা ১২০৯",
      addressEn: "House 42/A, Road 9/A, Dhanmondi, Dhaka 1209",
      phone: "+880 1883-012641",
      email: "info@argreengarden.com",
      hoursBn: "শনি – বৃহস্পতি: সকাল ৯টা – সন্ধ্যা ৭টা",
      hoursEn: "Sat – Thu: 9:00 AM – 7:00 PM",
    },
    {
      id: "branch-ctg",
      cityBn: "চট্টগ্রাম শাখা",
      cityEn: "Chattogram Hub",
      titleBn: "চট্টগ্রাম কোস্টাল ল্যান্ডস্কেপ হাব",
      titleEn: "Chattogram Coastal Architecture Office",
      addressBn: "নাসিরাবাদ হাউজিং সোসাইটি, রোড ৪, চট্টগ্রাম",
      addressEn: "Road 4, Nasirabad Housing Society, Chattogram",
      phone: "+880 1883-012642",
      email: "ctg@argreengarden.com",
      hoursBn: "শনি – বৃহস্পতি: সকাল ১০টা – সন্ধ্যা ৬টা",
      hoursEn: "Sat – Thu: 10:00 AM – 6:00 PM",
    },
    {
      id: "branch-sylhet",
      cityBn: "সিলেট শাখা",
      cityEn: "Sylhet Studio",
      titleBn: "সিলেট রিসোর্ট ও ইকো-ট্যুরিজম সেল",
      titleEn: "Sylhet Eco-Resort & Villa Desk",
      addressBn: "শাহজালাল উপশহর, ব্লক ডি, সিলেট",
      addressEn: "Block D, Shahjalal Upashahar, Sylhet",
      phone: "+880 1883-012643",
      email: "sylhet@argreengarden.com",
      hoursBn: "রবি – বৃহস্পতি: সকাল ১০টা – সন্ধ্যা ৬টা",
      hoursEn: "Sun – Thu: 10:00 AM – 6:00 PM",
    },
  ],
};

/* ==================== 8. CAREER CONFIG ==================== */
export interface CareerJobOpening {
  id: string;
  titleEn: string;
  titleBn: string;
  departmentEn: string;
  departmentBn: string;
  locationEn: string;
  locationBn: string;
  typeEn: string;
  typeBn: string;
  salaryRange: string;
  experience: string;
  descriptionEn: string;
  descriptionBn: string;
}

export interface CareerConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  openingsTitleBn: string;
  openingsTitleEn: string;
  formBadgeBn: string;
  formBadgeEn: string;
  formTitleBn: string;
  formTitleEn: string;
  formSubtitleBn: string;
  formSubtitleEn: string;
  jobs: CareerJobOpening[];
}

export const DEFAULT_CAREER_CONFIG: CareerConfig = {
  badgeBn: "স্টুডিও ক্যারিয়ার পোর্টাল",
  badgeEn: "Studio Careers Portal",
  titleBn: "সবুজ আগামীর নির্মাণে যুক্ত হোন",
  titleEn: "Grow Your Career With Our Studio",
  subtitleBn:
    "আমরা দেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেক্ট, বৃক্ষ চিকিৎসক ও দক্ষ কর্মীদের সমন্বয়ে একটি পরিবেশবান্ধব পরিবার। টেকসই ও আধুনিক সবুজ স্থাপত্য বিনির্মাণে আপনিও হোন আমাদের সহযোগী।",
  subtitleEn:
    "We are building climate-resilient landscapes across Bangladesh. Explore open positions for landscape architects, arborists, and horticultural engineers.",
  openingsTitleBn: "উন্মুক্ত চাকরির পদসমূহ",
  openingsTitleEn: "Open Positions",
  formBadgeBn: "অনলাইন আবেদন পোর্টাল",
  formBadgeEn: "Application Portal",
  formTitleBn: "অনলাইনে আবেদন করুন",
  formTitleEn: "Submit Your Application",
  formSubtitleBn:
    "আপনার সঠিক তথ্য ও সিভি/রিজিউম জমা দিন। আমাদের এইচআর টিম আপনার সাথে যোগাযোগ করবে।",
  formSubtitleEn:
    "Submit your portfolio or resume below and our HR & architecture team will connect with shortlisted candidates.",
  jobs: [
    {
      id: "job-arch-01",
      titleEn: "Senior Landscape Architect (3D & AutoCAD)",
      titleBn: "সিনিয়র ল্যান্ডস্কেপ আর্কিটেক্ট (থ্রিডি ও অটোক্যাড)",
      departmentEn: "Landscape & 3D Design",
      departmentBn: "ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন",
      locationEn: "Dhanmondi, Dhaka",
      locationBn: "ধানমন্ডি, ঢাকা",
      typeEn: "Full-Time",
      typeBn: "ফুল-টাইম",
      salaryRange: "৳৫০,০০০ - ৳৮৫,০০০",
      experience: "৩+ বছর",
      descriptionEn:
        "Lead rooftop, villa, and commercial biophilic landscape conceptualization, Lumion/SketchUp 3D visualization, and technical planting drawings.",
      descriptionBn:
        "ছাদবাগান, ভিলা ও কমার্শিয়াল প্রজেক্টের থ্রিডি কনসেপ্ট, প্ল্যান্টিং প্ল্যান ও সাইট সুপারভিশন পরিচালনা করা।",
    },
    {
      id: "job-hort-02",
      titleEn: "Clinical Arborist & Plant Health Specialist",
      titleBn: "বৃক্ষ চিকিৎসক ও উদ্যানতত্ত্ব বিশেষজ্ঞ",
      departmentEn: "Tree Doctor Clinic",
      departmentBn: "ট্রি ডক্টর ও বোটানি ক্লিনিক",
      locationEn: "Dhaka Metro (Field & Studio)",
      locationBn: "ঢাকা মেট্রো (ফিল্ড ও স্টুডিও)",
      typeEn: "Full-Time",
      typeBn: "ফুল-টাইম",
      salaryRange: "৳৩০,০০০ - ৳৪৮,০০০",
      experience: "২+ বছর",
      descriptionEn:
        "Conduct plant disease diagnostics, soil microbial testing, organic pest recovery, and supervise scheduled maintenance crews.",
      descriptionBn:
        "উদ্ভিদের রোগ নির্ণয়, মাটি ও জৈব পুষ্টি ব্যবস্থাপনা এবং নিয়মিত গার্ডেন কেয়ার টিম পরিচালনা করা।",
    },
  ],
};

/* ==================== 9. UNIVERSAL PAGE HEADERS & SEO OVERRIDES ==================== */
export interface PageHeaderConfig {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaLabelBn?: string;
  ctaLabelEn?: string;
  ctaHref?: string;
}

export type PageSlugKey =
  | "projects"
  | "services"
  | "gallery"
  | "beforeAfter"
  | "blog"
  | "testimonials"
  | "designGarden"
  | "aiTools"
  | "login"
  | "register"
  | "forgotPassword"
  | "maintenance";

export type PagesConfig = Record<PageSlugKey, PageHeaderConfig>;

export const DEFAULT_PAGES_CONFIG: PagesConfig = {
  projects: {
    badgeBn: "আর্কিটেকচারাল আর্কাইভ • প্রজেক্টসমূহ",
    badgeEn: "Architectural Archive • Portfolio",
    titleBn: "নির্বাচিত ল্যান্ডস্কেপ ও ছাদবাগান প্রজেক্ট",
    titleEn: "Selected Architectural Landscapes",
    subtitleBn:
      "আবাসিক ছাদবাগান, কর্পোরেট বায়োফিলিয়া এবং রিসোর্ট মাস্টারপ্ল্যানিংয়ে আমাদের সম্পন্ন ও চলমান প্রকল্পের সংগ্রহ।",
    subtitleEn:
      "Explore our signature rooftop terraces, commercial biophilic sanctuaries, and botanical villa estates.",
  },
  services: {
    badgeBn: "স্পেশালাইজড সার্ভিস ক্যাটাগরি",
    badgeEn: "Architectural & Botanical Services",
    titleBn: "আমাদের স্থাপত্য ও বোটানিক্যাল সেবাসমূহ",
    titleEn: "Bespoke Landscape Engineering & Care",
    subtitleBn:
      "প্রাথমিক সাইট অডিট ও থ্রিডি নকশা থেকে শুরু করে ওয়াটারপ্রুফিং, ড্রিপ ইরিগেশন এবং দীর্ঘমেয়াদী বাগান পরিচর্যা।",
    subtitleEn:
      "End-to-end rooftop engineering, 3D concept visualization, automated irrigation, and clinical arborist maintenance.",
  },
  gallery: {
    badgeBn: "ভিজ্যুয়াল পোর্টফোলিও",
    badgeEn: "Visual Exhibition • Gallery",
    titleBn: "ল্যান্ডস্কেপ ডিজাইন গ্যালারি",
    titleEn: "Studio Landscape Gallery",
    subtitleBn:
      "আমাদের প্রকৌশলী ও আর্কিটেক্টদের নির্মিত বাস্তব সাইট, উদ্ভিদ বিন্যাস ও লাইটিংয়ের স্থিরচিত্র।",
    subtitleEn:
      "A curated visual catalog of completed terraces, vertical walls, koi water courts, and tropical courtyards.",
  },
  beforeAfter: {
    badgeBn: "রূপান্তর বিশ্লেষণ",
    badgeEn: "Spatial Transformation • Before & After",
    titleBn: "আগের ও পরের বাস্তব রূপান্তর",
    titleEn: "Before & After Transformations",
    subtitleBn:
      "স্লাইডার ড্র্যাগ করে দেখুন কীভাবে পরিত্যক্ত কংক্রিটের ছাদ ও আঙিনা প্রাণবন্ত সবুজ উদ্যানে রূপান্তরিত হয়েছে।",
    subtitleEn:
      "Drag the comparison slider to witness bare concrete rooftops transformed into thriving ecological sanctuaries.",
  },
  blog: {
    badgeBn: "বোটানিক্যাল জার্নাল ও গাইড",
    badgeEn: "Botanical Journal & Research",
    titleBn: "বোটানিক্যাল জার্নাল ও বাগান পরিচর্যা গাইড",
    titleEn: "The Botanical Architecture Journal",
    subtitleBn:
      "ছাদবাগানের মাটি তৈরি, রোগ দমন, দেশি-বিদেশি গাছ নির্বাচন এবং স্থাপত্য টিপস নিয়ে আমাদের নিয়মিত আর্টিকেল।",
    subtitleEn:
      "Field research, rooftop engineering notes, and seasonal plant care guides authored by our horticulturists.",
  },
  testimonials: {
    badgeBn: "ক্লায়েন্ট অভিজ্ঞতা ও রিভিউ",
    badgeEn: "Client Voices • Testimonials",
    titleBn: "আমাদের সম্মানিত গ্রাহকদের মতামত",
    titleEn: "Verified Client Testimonials",
    subtitleBn:
      "বাড়ির মালিক, কর্পোরেট প্রতিষ্ঠান ও স্থপতিদের সাথে আমাদের কাজ করার বাস্তব অভিজ্ঞতা ও মূল্যায়ন।",
    subtitleEn:
      "Read verified feedback from homeowners, architects, and corporate partners across Bangladesh.",
  },
  designGarden: {
    badgeBn: "থ্রিডি ও ডিজাইন কমিশন",
    badgeEn: "Studio Brief • Custom Design",
    titleBn: "আপনার স্বপ্নের বাগান পরিকল্পনা করুন",
    titleEn: "Commission Your Bespoke Garden",
    subtitleBn:
      "আপনার স্পেসের ধরন, পছন্দের স্টাইল এবং ছবি সংযুক্ত করুন — আমরা ২৪ ঘণ্টার মধ্যে প্রাথমিক রোডম্যাপ পাঠাব।",
    subtitleEn:
      "Tell us your space type, botanical preferences, and site photos to receive a tailored architectural roadmap.",
  },
  aiTools: {
    badgeBn: "এআই বোটানিক্যাল অ্যাসিস্ট্যান্ট",
    badgeEn: "AI Botanical Diagnosis & Planner",
    titleBn: "স্মার্ট এআই গার্ডেন ও প্ল্যান্ট ডক্টর",
    titleEn: "Smart AI Garden Assistant",
    subtitleBn:
      "তাৎক্ষণিক গাছের পরিচর্যা পরামর্শ, ছাদবাগানের লোড আইডিয়া এবং রোগের প্রাথমিক সমাধান জানুন।",
    subtitleEn:
      "Ask our botanical AI assistant for instant plant selection, soil recipe ratios, and symptom guidance.",
  },
  login: {
    badgeBn: "স্টুডিও অ্যাক্সেস • লগইন",
    badgeEn: "Studio Access • Sign In",
    titleBn: "আপনার একাউন্টে লগইন করুন",
    titleEn: "Sign In to Your Studio Account",
    subtitleBn:
      "আপনার চলমান প্রজেক্ট, ডিজিটাল সার্ভিস কার্ড, ইনভয়েস ও বুকিং দেখতে লগইন করুন।",
    subtitleEn:
      "Access your project progress, Digital Service Card, invoices, and consultation bookings.",
  },
  register: {
    badgeBn: "নতুন ক্লায়েন্ট রেজিস্ট্রেশন",
    badgeEn: "Client Registration",
    titleBn: "নতুন একাউন্ট তৈরি করুন",
    titleEn: "Create Your Client Account",
    subtitleBn:
      "ফ্রি একাউন্ট খুলে সরাসরি সাইট ভিজিট বুকিং, রিওয়ার্ড পয়েন্ট এবং প্রজেক্ট আপডেট পান।",
    subtitleEn:
      "Register to track project milestones, earn Green Privilege points, and book site audits online.",
  },
  forgotPassword: {
    badgeBn: "অ্যাকাউন্ট রিকভারি",
    badgeEn: "Account Security • Recovery",
    titleBn: "পাসওয়ার্ড পুনরুদ্ধার",
    titleEn: "Reset Your Password",
    subtitleBn:
      "আপনার নিবন্ধিত ইমেইল লিখুন — ভেরিফিকেশন OTP কোড পাঠিয়ে নতুন পাসওয়ার্ড সেট করুন।",
    subtitleEn:
      "Enter your registered email to receive a 6-digit verification code and securely reset your password.",
  },
  maintenance: {
    badgeBn: "সিস্টেম রক্ষণাবেক্ষণ",
    badgeEn: "Scheduled Maintenance",
    titleBn: "ওয়েবসাইট আপগ্রেড ও মেইনটেনেন্স চলছে",
    titleEn: "We Are Upgrading Our Studio Experience",
    subtitleBn:
      "আরও দ্রুত ও উন্নত ডিজিটাল অভিজ্ঞতা প্রদানের জন্য আমাদের সিস্টেম সাময়িকভাবে হালনাগাদ করা হচ্ছে। জরুরি প্রয়োজনে সরাসরি আমাদের হটলাইনে কল করুন।",
    subtitleEn:
      "We are performing scheduled upgrades to improve your experience. Our botanical helpline remains open via phone & WhatsApp.",
  },
};

/* ==================== 10. UNIVERSAL MICRO-TEXT & BUTTON DICTIONARY ==================== */
export interface UiTextItem {
  key: string;
  page: string;
  label: string;
  bn: string;
  en: string;
  isCustom?: boolean;
}

export const DEFAULT_UI_TEXT_ITEMS: UiTextItem[] = [
  // Home
  { key: "home.projects.eyebrow", page: "Home", label: "Projects Section Eyebrow", bn: "নির্বাচিত স্থাপত্যকর্ম", en: "Selected Works" },
  { key: "home.projects.title", page: "Home", label: "Projects Section Title", bn: "আর্কিটেকচারাল প্রজেক্টসমূহ", en: "Featured Landscapes" },
  { key: "home.projects.viewAll", page: "Home", label: "Projects View All Button", bn: "সব প্রজেক্ট দেখুন", en: "View All Projects" },
  { key: "home.services.eyebrow", page: "Home", label: "Services Section Eyebrow", bn: "আমাদের দক্ষতা", en: "Studio Capabilities" },
  { key: "home.services.title", page: "Home", label: "Services Section Title", bn: "বিশেষায়িত সেবাসমূহ", en: "Our Services" },
  { key: "home.services.viewAll", page: "Home", label: "Services Explore Button", bn: "সকল সেবা দেখুন", en: "Explore Services" },
  { key: "home.activities.eyebrow", page: "Home", label: "Activities Eyebrow", bn: "স্টুডিও সংবাদ ও ইভেন্ট", en: "Studio Dispatch" },
  { key: "home.activities.title", page: "Home", label: "Activities Title", bn: "সাম্প্রতিক কার্যক্রম", en: "Recent Activities" },
  { key: "home.activities.viewAll", page: "Home", label: "Activities View All Button", bn: "গ্যালারি ভিজিট করুন", en: "Open Visual Archive" },
  // Global Navbar / Buttons
  { key: "nav.ctaDesign", page: "Navbar", label: "Header Design CTA", bn: "বাগান ডিজাইন করুন", en: "Design Your Garden" },
  { key: "nav.estimatorBtn", page: "Navbar", label: "Header Budget Estimator Label", bn: "বাজেট হিসাব", en: "Cost Estimator" },
  { key: "nav.loginBtn", page: "Navbar", label: "Login Button Label", bn: "লগইন / পোর্টাল", en: "Client Portal" },
  // Footer
  { key: "footer.newsletterPlaceholder", page: "Footer", label: "Newsletter Email Placeholder", bn: "আপনার ইমেইল লিখুন...", en: "Enter your email address..." },
  { key: "footer.newsletterSubmit", page: "Footer", label: "Newsletter Submit Button", bn: "সাবস্ক্রাইব", en: "Subscribe" },
  { key: "footer.newsletterSuccess", page: "Footer", label: "Newsletter Success Message", bn: "ধন্যবাদ! আমাদের মাসিক বোটানিক্যাল নিউজে যুক্ত হয়েছেন।", en: "Subscribed! Welcome to our botanical dispatch." },
  { key: "footer.privacyLabel", page: "Footer", label: "Privacy Link Text", bn: "গোপনীয়তা নীতি", en: "Privacy Policy" },
  { key: "footer.termsLabel", page: "Footer", label: "Terms Link Text", bn: "ব্যবহারের শর্তাবলী", en: "Terms of Service" },
  { key: "footer.refundLabel", page: "Footer", label: "Refund Link Text", bn: "রিফান্ড নীতি", en: "Refund Policy" },
  // Shop
  { key: "shop.addToCart", page: "Shop", label: "Add to Cart Button", bn: "ব্যাগে যোগ করুন", en: "Add to Bag" },
  { key: "shop.checkoutBtn", page: "Shop", label: "Checkout Button", bn: "অর্ডার কনফার্ম করুন", en: "Confirm Order" },
  { key: "shop.outOfStock", page: "Shop", label: "Out of Stock Badge", bn: "স্টক শেষ", en: "Out of Stock" },
  { key: "shop.freeShippingBadge", page: "Shop", label: "Free Delivery Label", bn: "ফ্রি হোম ডেলিভারি", en: "Free Delivery" },
  // Contact & Forms
  { key: "contact.dhakaBadge", page: "Contact", label: "Main Studio Badge", bn: "প্রধান কার্যালয়", en: "Headquarters" },
  { key: "contact.branchesTitle", page: "Contact", label: "Regional Hubs Heading", bn: "আঞ্চলিক শাখাসমূহ", en: "Regional Studio Hubs" },
  { key: "contact.successNotice", page: "Contact", label: "Contact Success Notice", bn: "ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।", en: "Thank you! Your inquiry has been received." },
  // Career
  { key: "career.applyNow", page: "Career", label: "Apply Now Button", bn: "আবেদন করুন", en: "Apply Now" },
  { key: "career.selectedBtn", page: "Career", label: "Selected Job Button", bn: "✓ নির্বাচিত হয়েছে", en: "✓ Selected" },
  { key: "career.submitApp", page: "Career", label: "Submit Application Button", bn: "আবেদন জমা দিন", en: "Submit Application" },
  // FAQ & Team
  { key: "faq.subtitle", page: "FAQ", label: "FAQ Header Subtitle", bn: "ছাদবাগান, মেইনটেনেন্স ও খরচ সম্পর্কে সর্বাধিক জিজ্ঞাসিত প্রশ্নোত্তর।", en: "Frequently asked questions about rooftop architecture, pricing, and ongoing plant care." },
  { key: "faq.ctaTitle", page: "FAQ", label: "FAQ Bottom CTA Title", bn: "আরও কোনো প্রশ্ন আছে?", en: "Still have a specific architectural question?" },
  { key: "team.ctaBtn", page: "Team", label: "Team Consultation Button", bn: "টিমের সাথে কথা বলুন", en: "Consult Our Architects" },
  // Emergency Tree Doctor
  { key: "treeDoc.floatingBtn", page: "Tree Doctor", label: "Floating Emergency Button", bn: "জরুরি ট্রি ডক্টর", en: "Emergency Tree Doctor" },
  { key: "treeDoc.submitBtn", page: "Tree Doctor", label: "Emergency Submit Button", bn: "জরুরি পরামর্শ পাঠান", en: "Dispatch Emergency Request" },
  // Common / Auth / Portals
  { key: "common.loading", page: "Common", label: "Loading Text", bn: "লোড হচ্ছে...", en: "Loading..." },
  { key: "common.backHome", page: "Common", label: "Back to Home Link", bn: "হোমপেজে ফিরে যান", en: "Back to Home" },
  { key: "common.callNow", page: "Common", label: "Call Now Button", bn: "সরাসরি কল করুন", en: "Call Studio" },
  { key: "common.bookConsultation", page: "Common", label: "Book Consultation Button", bn: "সাইট ভিজিট বুক করুন", en: "Book Site Audit" },
  { key: "auth.forgotLink", page: "Auth", label: "Forgot Password Link", bn: "পাসওয়ার্ড ভুলে গেছেন?", en: "Forgot Password?" },
  { key: "auth.createAccountLink", page: "Auth", label: "Create Account Link", bn: "নতুন একাউন্ট তৈরি করুন", en: "Create an Account" },
  { key: "portal.claimBtn", page: "Portals", label: "Claim Reward Button", bn: "রিওয়ার্ড ক্লেইম করুন", en: "Claim Reward" },
];

