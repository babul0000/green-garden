/**
 * Comprehensive Search Registry for A R Green Garden Studio Admin Dashboard
 * Indexes all 5 Main Menu Groups, 25+ Tabs, and 50+ Sub-sections, Tools, Actions & Settings
 */

export interface DashboardSearchItem {
  id: string;
  tabId: string;
  sub?: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  type: "page" | "feature" | "setting";
  descriptionBn: string;
  descriptionEn: string;
  icon: string;
  badge?: string;
  keywords: string[];
  requiredRole?: string[];
}

export const DASHBOARD_SEARCH_REGISTRY: DashboardSearchItem[] = [
  // ── GROUP 1: OVERVIEW & INSIGHTS (০১ • ওভারভিউ ও ইনবক্স) ──
  {
    id: "overview_analytics",
    tabId: "analytics",
    titleBn: "ড্যাশবোর্ড ওভারভিউ ও অ্যানালিটিক্স",
    titleEn: "Dashboard Overview & Analytics",
    categoryBn: "ওভারভিউ ও ইনসাইট",
    categoryEn: "OVERVIEW & INSIGHTS",
    type: "page",
    descriptionBn: "স্টুডিও আয়-ব্যয়, অ্যাক্টিভ প্রজেক্ট, নতুন বুকিং ও সাম্প্রতিক অ্যাক্টিভিটির লাইভ সারসংক্ষেপ।",
    descriptionEn: "Live overview of revenue, active masterplans, pending bookings and system activity.",
    icon: "📊",
    badge: "মূল ড্যাশবোর্ড",
    keywords: [
      "overview", "analytics", "dashboard", "metrics", "stats", "revenue", "income",
      "ইনসাইট", "অ্যানালিটিক্স", "মেট্রিক্স", "হিসাব", "ওভারভিউ", "ড্যাশবোর্ড", "সারসংক্ষেপ", "আয়", "গ্রাফ"
    ],
  },
  {
    id: "overview_messages",
    tabId: "messages",
    titleBn: "কন্টাক্ট ইনবক্স ও ক্লায়েন্ট বার্তা",
    titleEn: "Contact Messages Inbox",
    categoryBn: "ওভারভিউ ও ইনসাইট",
    categoryEn: "OVERVIEW & INSIGHTS",
    type: "page",
    descriptionBn: "ওয়েবসাইটের যোগাযোগ ফর্ম থেকে আসা গ্রাহকদের সকল ইনকোয়ারি ও বার্তার তালিকা।",
    descriptionEn: "Customer inquiries, feedback, emails and contact requests from the website.",
    icon: "📩",
    badge: "ইনবক্স",
    keywords: [
      "inbox", "messages", "contact", "inquiries", "email", "phone", "client messages",
      "ক্লায়েন্ট", "বার্তা", "মেসেজ", "ইনবক্স", "যোগাযোগ", "ইমেইল", "ফোন", "চিঠি", "গ্রাহকের বার্তা"
    ],
  },

  // ── GROUP 2: PORTFOLIO & SHOWCASE (০২ • পোর্টফোলিও ও শোকেস) ──
  {
    id: "portfolio_projects",
    tabId: "projects",
    titleBn: "প্রজেক্ট মাস্টারপ্ল্যান ও পোর্টফোলিও",
    titleEn: "Projects Masterplans & Portfolio",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "page",
    descriptionBn: "সকল ল্যান্ডস্কেপ আর্কিটেকচার ও ছাদ বাগান প্রজেক্টের তালিকা, ফিল্টার ও ক্যাটাগরি।",
    descriptionEn: "Comprehensive database of completed and running landscape masterplans.",
    icon: "🏛️",
    badge: "মাস্টারপ্ল্যান",
    keywords: [
      "projects", "masterplan", "portfolio", "landscape", "architecture", "showcase",
      "প্রজেক্ট", "পোর্টফোলিও", "মাস্টারপ্ল্যান", "বাগান", "ল্যান্ডস্কেপিং", "কাজ", "নকশা", "স্থাপত্য"
    ],
  },
  {
    id: "portfolio_new_project",
    tabId: "projects",
    sub: "new",
    titleBn: "নতুন প্রজেক্ট তৈরি ও যোগ (মোডাল)",
    titleEn: "Create / Add New Project Modal",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "feature",
    descriptionBn: "নতুন ল্যান্ডস্কেপ বা গার্ডেন প্রজেক্টের বিস্তারিত তথ্য, ক্লায়েন্ট, বাজেট ও ছবি যুক্ত করুন।",
    descriptionEn: "Launch modal to add a brand new landscape design project to portfolio.",
    icon: "➕",
    badge: "অ্যাকশন",
    keywords: [
      "new project", "create project", "add project", "upload project",
      "নতুন প্রজেক্ট", "প্রজেক্ট যোগ", "প্রজেক্ট তৈরি", "পোর্টফোলিও এন্ট্রি", "নতুন কাজ"
    ],
  },
  {
    id: "portfolio_gallery",
    tabId: "gallery",
    titleBn: "ফটো গ্যালারি শোকেস",
    titleEn: "Visual Photo Gallery Showcase",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "page",
    descriptionBn: "উচ্চ রেজ্যুলেশনের বাগান ও ল্যান্ডস্কেপ ফটো গ্যালারি এবং নতুন ইমেজ আপলোড।",
    descriptionEn: "High-resolution architectural photography showcase and asset management.",
    icon: "🖼️",
    badge: "গ্যালারি",
    keywords: [
      "gallery", "photos", "images", "showcase", "pictures", "cloudinary", "album",
      "গ্যালারি", "ছবি", "ফটো", "ইমেজ", "শোকেস", "অ্যালবাম", "ফটো গ্যালারি", "ক্লাউডিনারি"
    ],
  },
  {
    id: "portfolio_before_after",
    tabId: "gallery",
    sub: "before-after",
    titleBn: "বিফোর ও আফটার ফটো রূপান্তর তুলনা",
    titleEn: "Before & After Visual Transformation",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "feature",
    descriptionBn: "কাজের আগের ও পরের ছবির তুলনামূলক স্লাইডার শোকেস ম্যানেজ ও আপলোড করুন।",
    descriptionEn: "Manage before & after transformation photos and interactive comparison sliders.",
    icon: "🔄",
    badge: "ভিজ্যুয়াল",
    keywords: [
      "before after", "transformation", "comparison", "slider", "before", "after",
      "বিফোর আফটার", "আগে পরে", "রূপান্তর", "তুলনা", "বিফোর ছবি", "আফটার ছবি"
    ],
  },
  {
    id: "portfolio_reviews",
    tabId: "reviews",
    titleBn: "গ্রাহক রিভিউ ও রেটিং অনুমোদন",
    titleEn: "Customer Reviews & Moderation",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "page",
    descriptionBn: "ক্লায়েন্টদের ৫-স্টার রিভিউ অনুমোদন, এডিট এবং হোমপেজে প্রদর্শন নিয়ন্ত্রণ।",
    descriptionEn: "Approve, moderate, feature and manage client 5-star testimonials.",
    icon: "⭐",
    badge: "রিভিউ",
    keywords: [
      "reviews", "ratings", "feedback", "testimonial", "stars", "approval",
      "রিভিউ", "রেটিং", "মন্তব্য", "ফিডব্যাক", "টেস্টিমোনিয়াল", "অনুমোদন", "স্টার", "ক্লায়েন্ট মতামত"
    ],
  },
  {
    id: "portfolio_blogs",
    tabId: "blogs",
    titleBn: "বোটানিক্যাল ব্লগ ও জার্নাল",
    titleEn: "Botanical Blogs & Journal Articles",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "page",
    descriptionBn: "গাছপালা পরিচর্যা, ছাদ বাগান ও বোটানিক্যাল টিপসের ব্লগ আর্টিকেল প্রকাশ ও এডিট।",
    descriptionEn: "Publish, update, and manage botanical gardening articles and guides.",
    icon: "📝",
    badge: "ব্লগ",
    keywords: [
      "blogs", "articles", "journal", "posts", "gardening tips", "news",
      "ব্লগ", "জার্নাল", "নিবন্ধ", "লেখালেখি", "টিপস", "আর্টিকেল", "পোস্ট", "বাগান টিপস"
    ],
  },
  {
    id: "portfolio_blog_comments",
    tabId: "blogs",
    sub: "comments",
    titleBn: "ব্লগ কমেন্ট ও আলোচনা মডারেশন",
    titleEn: "Blog Comments Moderation",
    categoryBn: "পোর্টফোলিও ও শোকেস",
    categoryEn: "PORTFOLIO & SHOWCASE",
    type: "feature",
    descriptionBn: "পাঠকদের ব্লগ কমেন্ট যাচাই, অনুমোদন বা অনাকাঙ্ক্ষিত মন্তব্য মুছে ফেলা।",
    descriptionEn: "Review, approve or delete user comments on published blog articles.",
    icon: "💬",
    badge: "মডারেশন",
    keywords: [
      "comments", "moderation", "blog comments", "discussion", "reply",
      "কমেন্ট", "মন্তব্য", "মডারেশন", "আলোচনা", "রিপ্লাই", "পাঠকের মন্তব্য"
    ],
  },

  // ── GROUP 3: SERVICES & OPERATIONS (০৩ • সার্ভিসেস ও অপারেশনস) ──
  {
    id: "services_main",
    tabId: "services",
    titleBn: "ল্যান্ডস্কেপ সার্ভিসেস হাব",
    titleEn: "Landscape Services Hub",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "page",
    descriptionBn: "সকল গার্ডেন ও আর্কিটেকচারাল সার্ভিসের কার্ড, দাম ও বিবরণী এবং লাইভ সিঙ্ক।",
    descriptionEn: "Manage all architectural landscape service packages, scopes, and pricing.",
    icon: "🌿",
    badge: "সার্ভিসেস",
    keywords: [
      "services", "landscape services", "offerings", "service cards", "packages",
      "সার্ভিস", "সেবা", "ল্যান্ডস্কেপ", "সার্ভিসেস", "ক্যাটালগ", "প্যাকেজ", "ফ্লিপ কার্ড"
    ],
  },
  {
    id: "services_new_service",
    tabId: "services",
    sub: "new",
    titleBn: "নতুন সার্ভিস যোগ করুন (পপআপ মোডাল)",
    titleEn: "Add New Service Modal",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "feature",
    descriptionBn: "নতুন গার্ডেন সার্ভিস, আইকন, বিবরণ ও স্কোপ যুক্ত করার পপআপ মোডাল।",
    descriptionEn: "Open popup modal to add a brand new service with features and deliverables.",
    icon: "✨",
    badge: "নতুন সেবা",
    keywords: [
      "new service", "add service", "create service", "service modal",
      "নতুন সার্ভিস", "সার্ভিস যোগ", "সেবা তৈরি", "সার্ভিস মোডাল", "নতুন সেবা"
    ],
  },
  {
    id: "services_fountain",
    tabId: "services",
    sub: "fountain",
    titleBn: "ওয়াটার ফাউন্টেন ও ঝর্ণা ডিজাইন (Fountain)",
    titleEn: "Water Fountain & Water Features Design",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "feature",
    descriptionBn: "আধুনিক ইনডোর ও আউটডোর ওয়াটার ফাউন্টেন, ঝর্ণা ও ওয়াটারফল আর্কিটেকচার সার্ভিস।",
    descriptionEn: "Custom modern water fountain, cascades, and water feature design and installation.",
    icon: "⛲",
    badge: "ফোয়ারা",
    keywords: [
      "fountain", "waterfall", "water feature", "fountains", "water",
      "ফাউন্টেন", "ঝর্ণা", "ফোয়ারা", "পানির ফোয়ারা", "ঝরনা", "ওয়াটারফল", "পানির ঝর্ণা"
    ],
  },
  {
    id: "services_rooftop",
    tabId: "services",
    sub: "rooftop",
    titleBn: "ছাদ বাগান ও টেরেস ডিজাইন (Rooftop)",
    titleEn: "Rooftop Garden & Terrace Living",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "feature",
    descriptionBn: "রুফটপ ল্যান্ডস্কেপিং, গ্রিন রুফ, ড্রেনেজ সিস্টেম ও টেরেস গার্ডেন সলিউশন।",
    descriptionEn: "Urban rooftop gardens, terrace landscaping, and waterproofing drainage solutions.",
    icon: "🏡",
    badge: "রুফটপ",
    keywords: [
      "rooftop", "terrace", "roof garden", "green roof", "urban rooftop",
      "ছাদ বাগান", "টেরেস", "রুফটপ", "ছাদের বাগান", "সবুজ ছাদ", "বারান্দা বাগান"
    ],
  },
  {
    id: "services_irrigation",
    tabId: "services",
    sub: "irrigation",
    titleBn: "স্মার্ট ও অটোমেটিক সেচ ব্যবস্থা (Irrigation)",
    titleEn: "Smart & Automatic Irrigation System",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "feature",
    descriptionBn: "টাইমার ও সেন্সরভিত্তিক স্বয়ংক্রিয় গার্ডেন ইরিগেশন, ড্রিপ ও স্প্রিংকলার নেটওয়ার্ক।",
    descriptionEn: "Automated drip irrigation, micro-sprinklers, and moisture sensor automation.",
    icon: "💧",
    badge: "স্মার্ট সেচ",
    keywords: [
      "irrigation", "watering", "automatic", "smart irrigation", "sprinkler", "drip",
      "সেচ", "অটোমেটিক সেচ", "ড্রিপ ইরিগেশন", "স্প্রিংকলার", "পানি দেওয়া", "ড্রেনেজ"
    ],
  },
  {
    id: "operations_design_requests",
    tabId: "design-requests",
    titleBn: "ডিজাইন কমিশন ও ক্লায়েন্ট রিকোয়েস্ট",
    titleEn: "Design Commissions & Custom Quotes",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "page",
    descriptionBn: "ক্লায়েন্টদের কাস্টম ৩ডি ডিজাইন রিকোয়েস্ট, সাইটের বিবরণ ও বাজেট প্রাক্কলন।",
    descriptionEn: "Custom 3D landscape design commission inquiries, site specs, and budgets.",
    icon: "🎯",
    badge: "লিডস",
    keywords: [
      "design requests", "commissions", "leads", "quotes", "custom design",
      "ডিজাইন", "কমিশন", "রিকোয়েস্ট", "ক্লায়েন্ট লিড", "কোটেশন রিকোয়েস্ট", "নকশা আবেদন"
    ],
  },
  {
    id: "operations_bookings",
    tabId: "bookings",
    titleBn: "ক্লায়েন্ট সাইট ভিজিট ও বুকিং শিডিউল",
    titleEn: "Client Bookings & Site Visits Schedule",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "page",
    descriptionBn: "সাইট পরিদর্শন ও পরামর্শ সভার শিডিউলিং, দায়িত্বপ্রাপ্ত স্টাফ অ্যাসাইন ও স্ট্যাটাস।",
    descriptionEn: "Manage consultation bookings, site inspection visits, schedules and assigned staff.",
    icon: "📅",
    badge: "বুকিং",
    keywords: [
      "bookings", "site visit", "appointments", "schedule", "consultation",
      "বুকিং", "সাইট ভিজিট", "অ্যাপয়েন্টমেন্ট", "তারিখ", "শিডিউল", "ভিজিট", "পরামর্শ সভা"
    ],
  },
  {
    id: "operations_tree_doctor",
    tabId: "tree-doctor",
    titleBn: "ট্রি ডক্টর ও আরবারিকালচার ক্লিনিক",
    titleEn: "Tree Doctor & Plant Health Clinic",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "page",
    descriptionBn: "গাছের জরুরি চিকিৎসা, রোগ নির্ণয়, কীটনাশক ও স্পেশালিস্ট আরবারিস্ট সেবা।",
    descriptionEn: "Arboriculture diagnosis, plant disease treatment and emergency clinic calls.",
    icon: "🩺",
    badge: "ট্রি ডক্টর",
    keywords: [
      "tree doctor", "plant clinic", "arborist", "plant pathology", "emergency call",
      "ট্রি ডক্টর", "গাছের ডাক্তার", "ক্লিনিক", "রোগ", "চিকিৎসা", "আরবারিস্ট", "জরুরি কল", "গাছের যত্ন"
    ],
  },
  {
    id: "operations_ai_leaf",
    tabId: "tree-doctor",
    sub: "ai-diagnosis",
    titleBn: "এআই পাতার রোগ নির্ণয় ও ডিজিটাল প্রেসক্রিপশন",
    titleEn: "AI Leaf Disease Diagnosis (Gemini)",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "feature",
    descriptionBn: "Google Gemini AI ভিশন দিয়ে পাতার ছবি বিশ্লেষণ ও তাত্ক্ষণিক প্রেসক্রিপশন তৈরি।",
    descriptionEn: "AI-powered vision leaf disease scanner providing instant botanical prescriptions.",
    icon: "🔬",
    badge: "এআই জেমিনি",
    keywords: [
      "ai leaf diagnosis", "gemini", "prescription", "leaf disease", "artificial intelligence",
      "এআই", "রোগ নির্ণয়", "প্রেসক্রিপশন", "পাতা", "রোগ", "জেমিনি", "এআই ডাক্তার", "ফটো প্রেসক্রিপশন"
    ],
  },
  {
    id: "operations_maintenance",
    tabId: "maintenance",
    titleBn: "বোটানিক্যাল কেয়ার ও মেইনটেনেন্স শিডিউল",
    titleEn: "Botanical Care & Maintenance Routine",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "page",
    descriptionBn: "বাগান পরিচর্যা প্যাকেজ, নিয়মিত সার-কাটাই শিডিউল ও সাইট ভিজিট ট্র্যাকিং।",
    descriptionEn: "Routine gardening care schedules, pruning plans, and periodic maintenance packages.",
    icon: "🌿",
    badge: "কেয়ার শিডিউল",
    keywords: [
      "maintenance", "care", "routine", "gardening package", "pruning",
      "মেইনটেনেন্স", "পরিচর্যা", "বাগান যত্ন", "শিডিউলার", "রুটিন", "গাছ কাটাই", "সার প্রয়োগ"
    ],
  },
  {
    id: "operations_service_card",
    tabId: "service-card",
    titleBn: "ডিজিটাল স্মার্ট সার্ভিস কার্ড (NFC & QR)",
    titleEn: "Digital Smart Service Card (NFC & QR)",
    categoryBn: "সার্ভিসেস ও অপারেশনস",
    categoryEn: "SERVICES & OPERATIONS",
    type: "page",
    descriptionBn: "ক্লায়েন্টদের গার্ডেন ট্র্যাকিং এনএফসি ও কিউআর ডিজিটাল সার্ভিস কার্ড সিস্টেম।",
    descriptionEn: "Generate and manage NFC & QR-powered digital cards for client garden telemetry.",
    icon: "💳",
    badge: "NFC কার্ড",
    keywords: [
      "service card", "nfc", "qr code", "smart card", "client card", "digital card",
      "সার্ভিস কার্ড", "এনএফসি", "কিউআর কোড", "স্মার্ট কার্ড", "ক্লায়েন্ট কার্ড", "ডিজিটাল কার্ড"
    ],
  },

  // ── GROUP 4: STUDIO ERP & TEAM (০৪ • টিম মেম্বার, ক্যারিয়ার ও ফাইন্যান্স) ──
  {
    id: "team_employees",
    tabId: "employees",
    sub: "directory",
    titleBn: "আর্কিটেক্ট ও সাইট স্টাফ ডিরেক্টরি",
    titleEn: "Staff & Architects Directory",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "page",
    descriptionBn: "স্টুডিও কর্মী তালিকা, রোল ও পারমিশন, পদবী ও প্রোফাইল এডিট ও ডিলিট।",
    descriptionEn: "Full employee directory with CRUD, roles, permissions, designations and salary.",
    icon: "👥",
    badge: "টিম ডিরেক্টরি",
    keywords: [
      "employees", "staff", "architects", "team", "directory", "hr",
      "কর্মচারী", "কর্মী", "স্টাফ", "আর্কিটেক্ট", "টিম", "টিম মেম্বার", "ডিরেক্টরি", "এইচআর"
    ],
  },
  {
    id: "team_add_employee",
    tabId: "employees",
    sub: "directory",
    titleBn: "নতুন স্টাফ বা আর্কিটেক্ট যুক্ত করুন",
    titleEn: "Add New Staff / Architect",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "নতুন কর্মীর নাম, ফোন, ডিপার্টমেন্ট, পদবী, স্যালারি, রোল ও ছবি যোগ করুন।",
    descriptionEn: "Register a new staff member with department, salary, role permissions and photo.",
    icon: "👤➕",
    badge: "নতুন কর্মী",
    keywords: [
      "add employee", "new staff", "hire employee", "create employee",
      "নতুন কর্মী", "কর্মী নিয়োগ", "স্টাফ যোগ", "কর্মী তৈরি", "নতুন আর্কিটেক্ট"
    ],
  },
  {
    id: "team_assignments",
    tabId: "employees",
    sub: "assignments",
    titleBn: "কর্মী প্রজেক্ট দায়িত্ব ও সাইট অ্যাসাইনমেন্ট",
    titleEn: "Employee Project Assignments",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "চলমান প্রজেক্টসমূহে আর্কিটেক্ট ও সুপারভাইজার দায়িত্ব বণ্টন ও ট্র্যাকিং।",
    descriptionEn: "Assign architects and field engineers to live landscape architecture sites.",
    icon: "📋",
    badge: "সাইট দায়িত্ব",
    keywords: [
      "assignments", "tasks", "project staff", "allocation", "site supervision",
      "দায়িত্ব", "অ্যাসাইনমেন্ট", "সাইট কাজ", "প্রজেক্ট স্টাফ", "বণ্টন", "সাইট সুপারভাইজার"
    ],
  },
  {
    id: "team_attendance",
    tabId: "employees",
    sub: "attendance",
    titleBn: "মাসিক ডিজিটাল হাজিরা শিট ও উপস্থিতি",
    titleEn: "Monthly Attendance Sheet & Tracker",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "কর্মীদের দৈনিক উপস্থিতি, ছুটি এবং মাসিক হাজিরা ও অ্যাটেনডেন্স ট্র্যাকিং।",
    descriptionEn: "Digital monthly attendance logs, check-in records, and leave management.",
    icon: "📅",
    badge: "হাজিরা শিট",
    keywords: [
      "attendance", "presence", "leave", "daily attendance", "absent", "check-in",
      "হাজিরা", "উপস্থিতি", "হাজিরা শিট", "ছুটি", "অ্যাটেনডেন্স", "মাসিক হাজিরা", "অনুপস্থিত"
    ],
  },
  {
    id: "team_salary",
    tabId: "employees",
    sub: "directory",
    titleBn: "কর্মীর মাসিক বেতন ও অভিজ্ঞতা ক্যালকুলেটর",
    titleEn: "Employee Salary & Experience Calculator",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "কর্মীদের মাসিক নির্ধারিত বেতন, জয়েনিং তারিখ ও স্বয়ংক্রিয় অভিজ্ঞতা কাউন্টার।",
    descriptionEn: "Live calculated experience counters and monthly salary records for staff.",
    icon: "💵",
    badge: "বেতন ও অভিজ্ঞতা",
    keywords: [
      "salary", "payroll", "experience", "monthly salary", "joining date",
      "বেতন", "স্যালারি", "মাসিক বেতন", "অভিজ্ঞতা", "পে-রোল", "মাসিক টাকা", "হিসাব"
    ],
  },
  {
    id: "team_job_circulars",
    tabId: "careers",
    sub: "openings",
    titleBn: "নিয়োগ বিজ্ঞপ্তি ও জব সার্কুলার",
    titleEn: "Job Circulars & Openings Management",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "page",
    descriptionBn: "নতুন চাকরির পদ, প্রয়োজনীয় অভিজ্ঞতা, যোগ্যতা ও আবেদন আহ্বান সার্কুলার প্রকাশ।",
    descriptionEn: "Publish, update and manage open job postings and candidate requirements.",
    icon: "📢",
    badge: "সার্কুলার",
    keywords: [
      "careers", "job circular", "openings", "recruitment", "hiring",
      "নিয়োগ", "চাকরি", "সার্কুলার", "ক্যারিয়ার", "রিক্রুটমেন্ট", "পোস্টিং", "চাকরির বিজ্ঞপ্তি"
    ],
  },
  {
    id: "team_cv_tracker",
    tabId: "careers",
    sub: "applications",
    titleBn: "প্রার্থীদের সিভি ও আবেদনপত্র ট্র্যাকার",
    titleEn: "Candidate Applications & CVs Tracker",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "চাকরিতে আবেদনকারীদের সিভি দেখা, রেজুমে ডাউনলোড ও ইন্টারভিউ স্ট্যাটাস ফিল্টার।",
    descriptionEn: "Inspect submitted candidate CVs, download resumes, and manage hiring pipeline.",
    icon: "📄",
    badge: "সিভি ট্র্যাকার",
    keywords: [
      "applications", "cv", "resume", "candidates", "cv download", "interview",
      "সিভি", "আবেদনপত্র", "রেজুমে", "প্রার্থী", "জীবনবৃত্তান্ত", "ডাউনলোড", "সিভি ট্র্যাকার"
    ],
  },
  {
    id: "finance_quotation",
    tabId: "finance",
    sub: "quotation",
    titleBn: "স্মার্ট কোটেশন বিল্ডার ও ক্লায়েন্ট প্রপোজাল",
    titleEn: "Smart Quotation Builder & Proposal",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "ক্লায়েন্টদের জন্য উপাদান ও সার্ভিস অনুযায়ী সুনির্দিষ্ট আইটেমাইজড কোটেশন তৈরি।",
    descriptionEn: "Generate itemized architectural quotations, labor estimates and print proposals.",
    icon: "📝",
    badge: "কোটেশন বিল্ডার",
    keywords: [
      "quotation", "quote", "cost estimate", "proposal", "pricing",
      "কোটেশন", "প্রপোজাল", "খরচের হিসাব", "এস্টিমেট", "কোটেশন বিল্ডার", "প্রস্তাবনা"
    ],
  },
  {
    id: "finance_invoices",
    tabId: "finance",
    sub: "invoices",
    titleBn: "ইনভয়েস ও বিলিং পেমেন্ট ট্র্যাকিং",
    titleEn: "Invoices & Billing Payments Tracking",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "ইনভয়েস তৈরি, আংশিক ও পূর্ণ পেমেন্ট রেকর্ড, বকেয়া ট্র্যাকিং ও চালান প্রিন্ট।",
    descriptionEn: "Create client invoices, record payments, track dues and print official receipts.",
    icon: "🧾",
    badge: "ইনভয়েস",
    keywords: [
      "invoice", "invoices", "billing", "payment", "due", "receipt",
      "ইনভয়েস", "বিল", "পেমেন্ট", "বকেয়া", "পরিশোধ", "মানি রিসিট", "রিসিপ্ট", "বিলিং"
    ],
  },
  {
    id: "finance_inventory",
    tabId: "finance",
    sub: "inventory",
    titleBn: "ইনভেন্টরি, উদ্ভিদ ও ম্যাটেরিয়াল স্টক",
    titleEn: "Inventory & Materials Stock Control",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "feature",
    descriptionBn: "স্টুডিওর চারাগাছ, ফার্টিলাইজার, পাইপ ও হার্ডওয়্যার ইনভেন্টরি স্টক ট্র্যাকিং।",
    descriptionEn: "Real-time stock ledger for living plants, fertilizers, pots, pipes, and lighting.",
    icon: "📦",
    badge: "ইনভেন্টরি স্টক",
    keywords: [
      "inventory", "stock", "plants", "materials", "supplies", "fertilizer",
      "ইনভেন্টরি", "স্টক", "গাছপালা স্টক", "সার", "টব", "মালামাল", "উপাদান", "স্টোরেজ"
    ],
  },
  {
    id: "finance_accounting",
    tabId: "finance",
    sub: "accounting",
    titleBn: "স্টুডিও ফাইন্যান্স ও লাভ-ক্ষতি (P&L Summary)",
    titleEn: "Studio Financial Accounts & Profit/Loss",
    categoryBn: "টিম মেম্বার ও ইআরপি",
    categoryEn: "STUDIO ERP & TEAM",
    type: "page",
    descriptionBn: "মোট রাজস্ব, অপারেশনাল খরচ ও নিট মুনাফার পূর্ণাঙ্গ ফাইন্যান্সিয়াল অডিট ও হিসাব।",
    descriptionEn: "Financial profit & loss statement, studio accounts overview and ledger analytics.",
    icon: "💰",
    badge: "লাভ-ক্ষতি (P&L)",
    keywords: [
      "finance", "accounting", "profit", "loss", "p&l", "accounts", "revenue",
      "ফাইন্যান্স", "হিসাব", "লাভ ক্ষতি", "আয় ব্যয়", "ব্যালেন্স শিট", "লাভ", "ক্ষতি", "মুনাফা"
    ],
  },

  // ── GROUP 5: WEBSITE STUDIO & SETTINGS (০৫ • হোমপেজ এডিটর, রোল ও সিকিউরিটি) ──
  {
    id: "settings_navbar",
    tabId: "header-nav",
    titleBn: "হেডার ও নেভবার স্টুডিও",
    titleEn: "Header & Navbar Studio",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "ওয়েবসাইটের শীর্ষ মেনু লিংক, ড্রপডাউন, ক্রম ও ব্র্যান্ড লোগো কাস্টমাইজেশন।",
    descriptionEn: "Manage header menu links, studio branding logo and top navigation layout.",
    icon: "🧭",
    badge: "নেভবার স্টুডিও",
    keywords: [
      "header", "navbar", "navigation", "menu links", "logo", "top bar",
      "হেডার", "নেভবার", "মেনু", "লিংক", "নেভিগেশন", "টপ বার", "মেনুবার", "লোগো"
    ],
  },
  {
    id: "settings_hero",
    tabId: "hero",
    titleBn: "হিরো ব্যানার ও সিনেমাটিক ভিডিও স্টুডিও",
    titleEn: "Hero Banner & Cinematic Video Studio",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "হোমপেজের সিনেমাটিক ব্যাকগ্রাউন্ড ভিডিও, টাইটেল, সাবটাইটেল ও কল-টু-অ্যাকশন বাটন।",
    descriptionEn: "Manage homepage background video URL, poster, headlines and CTA buttons.",
    icon: "🎥",
    badge: "হিরো ভিডিও",
    keywords: [
      "hero", "video", "slider", "banner", "cinematic", "cta buttons",
      "হিরো", "ভিডিও", "ব্যানার", "স্লাইডার", "ব্যাকগ্রাউন্ড ভিডিও", "পোস্টার", "হেডলাইন"
    ],
  },
  {
    id: "settings_homepage_sections",
    tabId: "homepage-sections",
    sub: "sections",
    titleBn: "হোমপেজ সেকশন ড্র্যাগ-অ্যান্ড-ড্রপ রিঅর্ডার",
    titleEn: "Homepage Sections Drag & Drop Reorder",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "হোমপেজের প্রতিটি সেকশনের ক্রম ড্র্যাগ করে সাজান এবং দৃশ্যমানতা (অন/অফ) নির্ধারণ করুন।",
    descriptionEn: "Drag and drop homepage sections to reorder and toggle visibility on or off.",
    icon: "🔀",
    badge: "সেকশন রিঅর্ডার",
    keywords: [
      "homepage sections", "reorder", "drag and drop", "layout", "visibility",
      "হোমপেজ সেকশন", "ড্র্যাগ", "সাজানো", "রিঅর্ডার", "অন অফ", "হাইড", "দৃশ্যমানতা"
    ],
  },
  {
    id: "settings_process_manager",
    tabId: "process",
    sub: "process",
    titleBn: "A Thoughtful Journey ৪-ধাপ প্রসেস ম্যানেজার",
    titleEn: "A Thoughtful Journey Process Manager",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "হোমপেজের 'A Thoughtful Journey' ৪-ধাপের কাজের পদ্ধতি, ছবি, আইকন ও শিরোনাম এডিটর।",
    descriptionEn: "Edit, create and reorder 4-stage architectural process steps and custom images.",
    icon: "📐",
    badge: "প্রসেস ম্যানেজার",
    keywords: [
      "process", "thoughtful journey", "journey", "steps", "stages", "workflow",
      "প্রসেস", "কার্যপদ্ধতি", "ধাপ", "স্টেপ", "জার্নি", "কাজের ধাপ", "৪ ধাপ", "প্রসেস ম্যানেজার"
    ],
  },
  {
    id: "settings_manifesto",
    tabId: "homepage-sections",
    sub: "manifesto",
    titleBn: "অ্যানিমেটেড ম্যানিফেস্টো ও মিশন টেক্সট",
    titleEn: "Animated Manifesto & Mission Text",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "হোমপেজের অ্যানিমেটেড স্ক্রলিং ম্যানিফেস্টো স্লোগান ও পরিবেশগত মিশন এডিট করুন।",
    descriptionEn: "Edit animated manifesto banner text promoting ecological resilience.",
    icon: "✨",
    badge: "ম্যানিফেস্টো",
    keywords: [
      "manifesto", "mission", "slogan", "animated text",
      "ম্যানিফেস্টো", "মিশন", "স্লোগান", "প্রতিশ্রুতি", "ম্যানিফেস্টো টেক্সট"
    ],
  },
  {
    id: "settings_campaign",
    tabId: "homepage-sections",
    sub: "campaign",
    titleBn: "ক্যাম্পেইন ও অ্যানিভার্সারি ব্যানার",
    titleEn: "Campaign & Anniversary Banner",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "হোমপেজের বিশেষ অফার, সেলিব্রেশন ও ক্যাম্পেইন ব্যানার টেক্সট সম্পাদনা।",
    descriptionEn: "Configure promotional campaign and anniversary celebration banners.",
    icon: "📣",
    badge: "ক্যাম্পেইন",
    keywords: [
      "campaign", "anniversary", "banner text", "offers",
      "ক্যাম্পেইন", "অ্যানিভার্সারি", "বিজ্ঞাপন", "ব্যানার টেক্সট", "অফার"
    ],
  },
  {
    id: "settings_studio_life",
    tabId: "homepage-sections",
    sub: "studioLife",
    titleBn: "স্টুডিও লাইফ ও গার্ডেন টুলস কনটেন্ট",
    titleEn: "Studio Life & Garden Tools Content",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "স্টুডিওর কাজের পরিবেশ, ফটো ও গার্ডেনিং টুলস বিষয়ক কনটেন্ট পরিবর্তন।",
    descriptionEn: "Manage studio culture narrative, tool showcase and team craft photography.",
    icon: "🌱",
    badge: "স্টুডিও লাইফ",
    keywords: [
      "studio life", "tools", "garden life", "culture",
      "স্টুডিও লাইফ", "টুলস", "যন্ত্রপাতি", "জীবন", "কাজের পরিবেশ"
    ],
  },
  {
    id: "settings_content_manager",
    tabId: "content-manager",
    titleBn: "ডায়নামিক কনটেন্ট ম্যানেজার (All Text Dynamic)",
    titleEn: "Dynamic Text Content Manager",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "পুরো ওয়েবসাইটের সকল টেক্সট, হেডলাইন ও বিবরণ বাংলা-ইংরেজিতে সরাসরি সম্পাদনা।",
    descriptionEn: "Centralized bilingual dynamic copy and section translations editor.",
    icon: "📝",
    badge: "কনটেন্ট হাব",
    keywords: [
      "content manager", "dynamic text", "translations", "copywriting",
      "কনটেন্ট", "টেক্সট", "অনুবাদ", "ভাষা", "কনটেন্ট ম্যানেজার", "হেডলাইন", "লেখা"
    ],
  },
  {
    id: "settings_about_studio",
    tabId: "about-studio",
    sub: "hero",
    titleBn: "স্টুডিও পরিচিতি ও ইতিহাস (About Us Studio)",
    titleEn: "About Us & History Studio",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "স্টুডিও পরিচিতি পেজের (/about) সকল লেখা, ছবি, গল্প, ভিশন-মিশন, পরিসংখ্যান ও টিম মেম্বার এডিট ও ডিলিট।",
    descriptionEn: "Complete dynamic manager for /about page: hero, origin story, mission, vision, stats, team and CTA.",
    icon: "📖",
    badge: "About পেজ",
    keywords: [
      "about", "/about", "about us", "about studio", "about page", "history", "milestones", "team", "founder", "mission", "vision",
      "পরিচিতি", "ইতিহাস", "মাইলস্টোন", "মাইলফলক", "ভিশন", "মিশন", "টিম", "প্রতিষ্ঠাতা", "অ্যাবাউট", "স্টুডিও পরিচিতি"
    ],
  },
  {
    id: "settings_about_stats",
    tabId: "about-studio",
    sub: "stats",
    titleBn: "অর্জনের পরিসংখ্যান কাউন্টার (/about Stats)",
    titleEn: "About Page Achievement Stats & Counters",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "/about পেজের প্রকল্প সংখ্যা, ক্লায়েন্ট, অভিজ্ঞতা ও টিম কাউন্টার এডিট, যোগ ও ডিলিট।",
    descriptionEn: "Add, edit, or delete stats counters on the /about page.",
    icon: "📊",
    badge: "পরিসংখ্যান",
    keywords: [
      "about stats", "stats", "counters", "projects completed", "happy clients",
      "পরিসংখ্যান", "কাউন্টার", "অর্জন", "সংখ্যা", "প্রকল্প সংখ্যা"
    ],
  },
  {
    id: "settings_about_story",
    tabId: "about-studio",
    sub: "story",
    titleBn: "আমাদের গল্প, মিশন ও ভিশন (/about Story)",
    titleEn: "Our Story, Mission & Vision",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "/about পেজের প্রতিষ্ঠা গল্প, মিশন এবং ভিশন কনটেন্ট সম্পাদনা ও টগল।",
    descriptionEn: "Edit origin story, mission, and vision statements on the About page.",
    icon: "🎯",
    badge: "ভিশন ও মিশন",
    keywords: [
      "story", "our story", "mission", "vision", "about story",
      "গল্প", "আমাদের গল্প", "মিশন", "ভিশন", "লক্ষ্য", "উদ্দেশ্য"
    ],
  },
  {
    id: "settings_about_milestones",
    tabId: "about-studio",
    sub: "milestones",
    titleBn: "কোম্পানি মাইলস্টোন টাইমলাইন (Timeline CRUD)",
    titleEn: "Company Milestones Timeline Manager",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "/about পেজের ২০১৬ থেকে ২০২৬ সালের সকল মাইলস্টোন অর্জন এডিট, নতুন যোগ ও ডিলিট।",
    descriptionEn: "Manage /about page company milestones timeline with full modal add, edit, and delete support.",
    icon: "⏳",
    badge: "মাইলস্টোন",
    keywords: [
      "milestones", "timeline", "years", "achievements", "history",
      "মাইলস্টোন", "টাইমলাইন", "সাল", "বছর", "অর্জন", "মাইলফলক", "ইতিহাস"
    ],
  },
  {
    id: "settings_about_team",
    tabId: "about-studio",
    sub: "team",
    titleBn: "লিডারশিপ ও টিম মেম্বার (/about Team)",
    titleEn: "About Page Leadership & Team CRUD",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "/about পেজের নেতৃত্ব ও বিশেষজ্ঞ টিম সদস্যদের নাম, পদবী ও ছবি এডিট ও ডিলিট।",
    descriptionEn: "Add, edit, upload photo or delete leadership team members displayed on /about page.",
    icon: "👥",
    badge: "লিডারশিপ টিম",
    keywords: [
      "leadership", "about team", "founder", "ceo", "architects",
      "নেতৃত্ব", "লিডারশিপ", "টিম সদস্য", "প্রতিষ্ঠাতা", "সিইও"
    ],
  },
  {
    id: "settings_about_cta",
    tabId: "about-studio",
    sub: "cta",
    titleBn: "About পেজ কল-টু-অ্যাকশন (CTA Banner)",
    titleEn: "About Page Call To Action Banner",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "feature",
    descriptionBn: "/about পেজের নিচের সিটিএ ব্যানার শিরোনাম ও বাটন এডিট।",
    descriptionEn: "Customize call-to-action banner title, copy, and buttons on the About page.",
    icon: "📣",
    badge: "সিটিএ ব্যানার",
    keywords: [
      "cta", "call to action", "remodel space", "estimate button",
      "সিটিএ", "কল টু অ্যাকশন", "এস্টিমেট বাটন", "ব্যানার"
    ],
  },
  {
    id: "settings_master_hub",
    tabId: "settings",
    sub: "general",
    titleBn: "মাস্টার সেটিংস হাব (A-Z Global Hub)",
    titleEn: "Master Settings (A-Z Global Hub)",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "ওয়েবসাইটের সামগ্রিক কনফিগারেশন, ব্র্যান্ডিং ও ইন্টিগ্রেশন হাব।",
    descriptionEn: "Central command hub for studio configurations, branding, and webhooks.",
    icon: "⚙️",
    badge: "A-Z হাব",
    keywords: [
      "settings", "master settings", "config", "global settings",
      "সেটিংস", "কনফিগ", "মাস্টার সেটিংস", "সাইট সেটিংস", "সেটিংস হাব"
    ],
  },
  {
    id: "settings_branding_logo",
    tabId: "settings",
    sub: "general",
    titleBn: "স্টুডিও নাম, লোগো ও ব্র্যান্ডিং প্রোফাইল",
    titleEn: "Studio Branding, Name & Logo Profile",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "setting",
    descriptionBn: "ওয়েবসাইটের মূল নাম, স্টুডিও ব্র্যান্ড লোগো ইমেজ ও অফিসিয়াল ট্যাগলাইন।",
    descriptionEn: "Customize site title, upload corporate SVG/PNG logo, and set tagline.",
    icon: "🏢",
    badge: "লোগো ও নাম",
    keywords: [
      "logo", "branding", "site name", "tagline", "brand image",
      "লোগো", "নাম", "ব্র্যান্ড", "ট্যাগলাইন", "স্টুডিও নাম", "লোগো পরিবর্তন"
    ],
  },
  {
    id: "settings_contact_map",
    tabId: "settings",
    sub: "contact",
    titleBn: "যোগাযোগ তথ্য, ফোন, ইমেইল ও গুগল ম্যাপ",
    titleEn: "Contact Info, Phone, Email & Google Map",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "setting",
    descriptionBn: "স্টুডিওর অফিস ঠিকানা, হটলাইন ফোন নম্বর, সাপোর্ট ইমেইল ও গুগল ম্যাপ এম্বেড লিংক।",
    descriptionEn: "Official studio street address, support email, phone hotlines and Google Maps embed.",
    icon: "📍",
    badge: "যোগাযোগ ও ম্যাপ",
    keywords: [
      "contact", "phone", "email", "address", "map", "location", "google map",
      "ফোন", "ইমেইল", "মোবাইল", "ঠিকানা", "অফিস", "ম্যাপ", "গুগল ম্যাপ", "লোকেশন", "যোগাযোগ"
    ],
  },
  {
    id: "settings_social_whatsapp",
    tabId: "settings",
    sub: "social",
    titleBn: "সোশ্যাল মিডিয়া লিঙ্কস ও হোয়াটসঅ্যাপ চ্যাট",
    titleEn: "Social Media Links & WhatsApp Chat",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "setting",
    descriptionBn: "ফেসবুক পেজ, ইনস্টাগ্রাম, লিংকডইন ও সরাসরি হোয়াটসঅ্যাপ চ্যাট নম্বর কনফিগারেশন।",
    descriptionEn: "Configure Facebook, Instagram, LinkedIn profiles and floating WhatsApp contact.",
    icon: "🌐",
    badge: "সোশ্যাল ও হোয়াটসঅ্যাপ",
    keywords: [
      "social", "facebook", "instagram", "linkedin", "whatsapp", "social links",
      "সোশ্যাল", "ফেসবুক", "ইনস্টাগ্রাম", "লিংকডইন", "হোয়াটসঅ্যাপ", "ইউটিউব", "সোশ্যাল লিংক"
    ],
  },
  {
    id: "settings_seo",
    tabId: "settings",
    sub: "seo",
    titleBn: "সার্চ ইঞ্জিন এসইও (SEO), মেটাডাটা ও পিক্সেল",
    titleEn: "Search Engine SEO, Metadata & Pixel",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "setting",
    descriptionBn: "গুগল সার্চ ইঞ্জিন মেটা টাইটেল, মেটা ডেসক্রিপশন, কী-ওয়ার্ডস ও ফেসবুক মেটা পিক্সেল।",
    descriptionEn: "SEO site description, keyword indexing tags and Meta Pixel webmaster integration.",
    icon: "🔍",
    badge: "এসইও ও মেটা",
    keywords: [
      "seo", "meta", "keywords", "search engine", "google", "meta pixel",
      "এসইও", "মেটা", "কীওয়ার্ড", "গুগল সার্চ", "পিক্সেল", "সার্চ ইঞ্জিন", "র‍্যাংকিং"
    ],
  },
  {
    id: "settings_theme_color",
    tabId: "settings",
    sub: "branding",
    titleBn: "ব্র্যান্ড কালার থিম ও নোটিশ ব্যানার",
    titleEn: "Brand Theme Color & Notice Banner",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "setting",
    descriptionBn: "ওয়েবসাইটের প্রাইমারি থিম রঙ এবং হেডারের বিশেষ জরুরি নোটিশ ব্যানার।",
    descriptionEn: "Set primary architectural hex color code and toggle sticky announcement banner.",
    icon: "🎨",
    badge: "থিম কালার",
    keywords: [
      "theme", "color", "branding", "notice", "hex color",
      "থিম", "কালার", "রং", "ব্যানার", "নোটিশ", "সবুজ রঙ", "কালার থিম"
    ],
  },
  {
    id: "settings_backup_export",
    tabId: "settings",
    sub: "backup",
    titleBn: "পূর্ণাঙ্গ ডাটাবেস ব্যাকআপ ও স্ন্যাপশট এক্সপোর্ট",
    titleEn: "Full Database Backup & JSON Export",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "setting",
    descriptionBn: "এক ক্লিকে পুরো সিস্টেমের ডাটাবেস JSON ব্যাকআপ ফাইল ডাউনলোড ও সংরক্ষণ।",
    descriptionEn: "One-click complete database export into standalone JSON snapshot.",
    icon: "💾",
    badge: "ডাটাবেস ব্যাকআপ",
    keywords: [
      "backup", "database", "export", "json", "restore", "snapshot",
      "ডাটাবেস", "ব্যাকআপ", "এক্সপোর্ট", "ডাউনলোড", "ডাটা ব্যাকআপ", "রিস্টোর", "স্ন্যাপশট"
    ],
  },
  {
    id: "settings_users",
    tabId: "users",
    titleBn: "ইউজার অ্যাকাউন্টস ও পাসওয়ার্ড নিয়ন্ত্রণ",
    titleEn: "User Accounts & Password Control",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "অ্যাডমিন ও স্টাফদের অ্যাকাউন্ট তৈরি, পাসওয়ার্ড পরিবর্তন ও এক্সেস নিয়ন্ত্রণ।",
    descriptionEn: "Create user credentials, assign roles, reset passwords and delete accounts.",
    icon: "👤",
    badge: "ইউজার অ্যাকাউন্ট",
    keywords: [
      "users", "accounts", "password reset", "admin users", "credentials",
      "ইউজার", "ব্যবহারকারী", "অ্যাকাউন্ট", "পাসওয়ার্ড", "পাসওয়ার্ড রিসেট", "লগইন তথ্য"
    ],
  },
  {
    id: "settings_security",
    tabId: "security",
    titleBn: "সিকিউরিটি ক্রেডেনশিয়াল ও অ্যাক্টিভ সেশন",
    titleEn: "Security Credentials & Active Sessions",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "লগইন সেশন স্থায়িত্ব, পাসওয়ার্ড সিকিউরিটি এবং নিরাপদ টোকেন সুরক্ষা।",
    descriptionEn: "Inspect active JWT session tokens, verify authentication and password policies.",
    icon: "🔒",
    badge: "সিকিউরিটি",
    keywords: [
      "security", "credentials", "session", "jwt", "auth", "token",
      "সিকিউরিটি", "নিরাপত্তা", "ক্রেডেনশিয়াল", "সেশন", "টোকেন", "লগআউট", "সুরক্ষা"
    ],
  },
  {
    id: "settings_roles",
    tabId: "roles",
    titleBn: "আরবিক্স (RBAC) রোল পারমিশন ম্যাট্রিক্স",
    titleEn: "Role Permissions Matrix (Admin, Moderator, Editor)",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "অ্যাডমিন, মডারেটর, এডিটর ও এমপ্লয়ি রোলের সুনির্দিষ্ট পারমিশন তালিকা ও টেবিল।",
    descriptionEn: "Inspect role-based access matrix and permission boundaries for all tabs.",
    icon: "🛡️",
    badge: "পারমিশন",
    keywords: [
      "roles", "permissions", "rbac", "access control", "moderator", "editor",
      "রোল", "পারমিশন", "অনুমতি", "এক্সেস", "মডারেটর", "এডিটর", "অ্যাডমিন", "রোল ম্যাট্রিক্স"
    ],
  },
  {
    id: "settings_activity_logs",
    tabId: "activity-logs",
    titleBn: "সিস্টেম অ্যাক্টিভিটি ও অডিট ট্রেইল লগ",
    titleEn: "System Activity & Audit Trail Logs",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "কারা কখন লগইন করেছে বা সিস্টেম ডাটা পরিবর্তন করেছে তার সার্বিক অডিট লগ।",
    descriptionEn: "Chronological audit log tracking administrative actions, logins, and mutations.",
    icon: "📜",
    badge: "অডিট লগ",
    keywords: [
      "activity logs", "audit trail", "system logs", "history", "audit",
      "অ্যাক্টিভিটি", "অডিট", "লগ", "হিস্ট্রি", "রেকর্ড", "কার্যক্রম", "সিস্টেম লগ"
    ],
  },
  {
    id: "studio_micro_texts",
    tabId: "micro-texts",
    titleBn: "সব ছোট টেক্সট, বাটন ও পেজ হেডার স্টুডিও",
    titleEn: "Micro-Texts, Buttons & All Page Headers Studio",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "যেকোনো বাটন, লেবেল, ব্যাজ, পেজ শিরোনাম, সাবটাইটেল ও মেইনটেনেন্স পেজ টেক্সট পরিবর্তন করুন।",
    descriptionEn: "Edit every button label, badge, placeholder, page header, and maintenance copy dynamically.",
    icon: "🔤",
    badge: "100% টেক্সট",
    keywords: [
      "micro text", "button text", "page headers", "dynamic text", "labels", "maintenance page",
      "টেক্সট", "বাটন", "হেডার", "শিরোনাম", "ছোট লেখা", "লেবেল", "ক্যারিয়ার হেডার"
    ],
  },
  {
    id: "studio_shop_store",
    tabId: "shop-studio",
    titleBn: "গ্রিন শপ, পণ্য ও অর্ডার স্টুডিও (/shop)",
    titleEn: "Green Shop Products & Orders Studio",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "শপ প্রোডাক্ট যোগ/এডিট/ডিলিট, ডেলিভারি চার্জ, বিকাশ/SSLCommerz ও অর্ডার ম্যানেজমেন্ট।",
    descriptionEn: "Manage e-commerce products, stock, shipping charges, payment methods, and shop orders.",
    icon: "🛒",
    badge: "ই-কমার্স",
    keywords: [
      "shop", "store", "products", "orders", "delivery charge", "bkash", "ecommerce",
      "শপ", "দোকান", "পণ্য", "অর্ডার", "ডেলিভারি", "গাছ বিক্রি"
    ],
  },
  {
    id: "studio_interactive_tools",
    tabId: "tools-studio",
    titleBn: "এস্টিমেটর, উইজার্ড, লয়্যালটি ও নিউজলেটার স্টুডিও",
    titleEn: "Estimator, Design Wizard, Loyalty & Newsletter Studio",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "বাজেট এস্টিমেটর রেট, ৩ডি গার্ডেন উইজার্ড অপশন, লয়্যালটি রিওয়ার্ডস, ট্রি ডক্টর ও নিউজলেটার তালিকা।",
    descriptionEn: "Configure estimator pricing rates, garden wizard options, loyalty rewards, tree clinic, and subscribers.",
    icon: "⚙️",
    badge: "টুলস",
    keywords: [
      "estimator", "budget calculator", "wizard", "design garden", "loyalty", "rewards", "newsletter", "subscribers", "tree doctor",
      "এস্টিমেটর", "হিসাব", "উইজার্ড", "লয়্যালটি", "রিওয়ার্ড", "নিউজলেটার", "ট্রি ডক্টর"
    ],
  },
  {
    id: "studio_legal_policies",
    tabId: "legal-studio",
    titleBn: "লিগ্যাল ও পলিসি পেজ (Privacy, Terms & Refund)",
    titleEn: "Legal Pages Studio (Privacy, Terms & Refund)",
    categoryBn: "ওয়েবসাইট স্টুডিও ও সেটিংস",
    categoryEn: "WEBSITE STUDIO & SETTINGS",
    type: "page",
    descriptionBn: "প্রাইভেসি পলিসি, ব্যবহারের শর্তাবলী ও রিফান্ড নীতিমালার সকল ধারা এডিট ও ডিলিট করুন।",
    descriptionEn: "Manage Privacy Policy, Terms & Conditions, and Refund Policy sections dynamically.",
    icon: "📜",
    badge: "লিগ্যাল",
    keywords: [
      "privacy policy", "terms", "refund policy", "legal", "clauses",
      "প্রাইভেসি", "শর্তাবলী", "রিফান্ড", "আইনি", "নীতিমালা"
    ],
  },
];

/**
 * Perform high-precision fuzzy/multi-term search across the full admin dashboard
 */
export function searchDashboard(query: string, userRole?: string): DashboardSearchItem[] {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];

  const terms = raw.split(/\s+/).filter(Boolean);

  return DASHBOARD_SEARCH_REGISTRY.filter((item) => {
    // Role permissions check
    if (item.requiredRole && userRole) {
      if (!item.requiredRole.map((r) => r.toUpperCase()).includes(userRole.toUpperCase())) {
        return false;
      }
    }

    const searchableBlob = [
      item.titleBn,
      item.titleEn,
      item.categoryBn,
      item.categoryEn,
      item.descriptionBn,
      item.descriptionEn,
      item.tabId,
      item.sub || "",
      item.badge || "",
      ...item.keywords,
    ]
      .join(" ")
      .toLowerCase();

    // Every token must be present
    return terms.every((t) => searchableBlob.includes(t));
  }).sort((a, b) => {
    // 1. Direct title exact or starts-with match gets top boost
    const aTitleMatch = a.titleBn.toLowerCase().includes(raw) || a.titleEn.toLowerCase().includes(raw);
    const bTitleMatch = b.titleBn.toLowerCase().includes(raw) || b.titleEn.toLowerCase().includes(raw);
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;

    // 2. Keyword exact match boost
    const aKeywordMatch = a.keywords.some((k) => k.toLowerCase() === raw || k.toLowerCase().startsWith(raw));
    const bKeywordMatch = b.keywords.some((k) => k.toLowerCase() === raw || k.toLowerCase().startsWith(raw));
    if (aKeywordMatch && !bKeywordMatch) return -1;
    if (!aKeywordMatch && bKeywordMatch) return 1;

    // 3. Type precedence: pages first, then features, then settings
    const typeOrder = { page: 1, feature: 2, setting: 3 };
    return (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2);
  });
}

