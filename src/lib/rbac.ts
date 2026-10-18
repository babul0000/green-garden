// Role-Based Access Control (RBAC) Matrix for AR Green Garden Admin Dashboard
// Configured strictly according to the specified permissions table:
// | Section | Admin | Moderator | Editor | Employee | Client |
// | Overview & Messages | ✅ | ✅ | ❌ | ❌ | ❌ |
// | Portfolio (Projects, Gallery, Blogs) | ✅ | ✅ | ✅ | ❌ | ❌ |
// | Reviews Approval | ✅ | ✅ | ❌ | ❌ | ❌ |
// | Services & Bookings | ✅ | ✅ | ❌ | ✅ (assigned) | ❌ |
// | Finance & P&L | ✅ | ❌ | ❌ | ❌ | ❌ |
// | Staff & Careers | ✅ | ❌ | ❌ | ❌ | ❌ |
// | Website Studio | ✅ | ❌ | ✅ (content) | ❌ | ❌ |
// | Security & User Roles | ✅ | ❌ | ❌ | ❌ | ❌ |

export type UserRole = "ADMIN" | "MODERATOR" | "EDITOR" | "EMPLOYEE" | "CLIENT";

export type AdminSection =
  | "overview"          // analytics, messages
  | "portfolio"         // projects, gallery, blogs
  | "reviews"           // reviews approval
  | "services_bookings" // services, bookings, tree-doctor, maintenance, service-card, design-requests
  | "finance"           // finance, procurement, P&L
  | "staff_careers"     // employees, careers job openings
  | "website_studio"    // header-nav, hero, homepage-sections, content-manager
  | "security_roles";   // settings, security, users, roles

export const TAB_SECTION_MAP: Record<string, AdminSection> = {
  analytics: "overview",
  messages: "overview",
  projects: "portfolio",
  gallery: "portfolio",
  blogs: "portfolio",
  reviews: "reviews",
  services: "services_bookings",
  bookings: "services_bookings",
  "tree-doctor": "services_bookings",
  maintenance: "services_bookings",
  "service-card": "services_bookings",
  "design-requests": "services_bookings",
  finance: "finance",
  employees: "staff_careers",
  careers: "staff_careers",
  "header-nav": "website_studio",
  hero: "website_studio",
  "homepage-sections": "website_studio",
  "content-manager": "website_studio",
  content: "website_studio",
  settings: "security_roles",
  security: "security_roles",
  users: "security_roles",
  roles: "security_roles",
  "activity-logs": "security_roles",
};

/**
 * Check if a role has access to a dashboard section
 */
export function canAccessSection(role: string | undefined | null, section: AdminSection): boolean {
  if (!role) return false;
  const upper = role.toUpperCase();
  if (upper === "ADMIN") return true;
  if (upper === "CLIENT" || upper === "CUSTOMER") return false;

  switch (section) {
    case "overview":
      return upper === "MODERATOR";
    case "portfolio":
      return upper === "MODERATOR" || upper === "EDITOR";
    case "reviews":
      return upper === "MODERATOR";
    case "services_bookings":
      return upper === "MODERATOR" || upper === "EMPLOYEE";
    case "website_studio":
      return upper === "EDITOR";
    case "finance":
    case "staff_careers":
    case "security_roles":
      return false; // Admin only
    default:
      return false;
  }
}

/**
 * Check if a role has access to a specific tab ID
 */
export function canAccessTab(role: string | undefined | null, tabId: string): boolean {
  const section = TAB_SECTION_MAP[tabId] || "security_roles";
  return canAccessSection(role, section);
}

/**
 * Determine if a user is allowed to access the admin portal at all
 */
export function canEnterAdmin(role: string | undefined | null): boolean {
  if (!role) return false;
  const upper = role.toUpperCase();
  return upper === "ADMIN" || upper === "MODERATOR" || upper === "EDITOR" || upper === "EMPLOYEE";
}

/**
 * Get the initial landing tab for a role
 */
export function getDefaultTabForRole(role: string | undefined | null): string {
  if (!role) return "analytics";
  const upper = role.toUpperCase();
  if (upper === "ADMIN" || upper === "MODERATOR") return "analytics";
  if (upper === "EDITOR") return "projects";
  if (upper === "EMPLOYEE") return "bookings";
  return "analytics";
}

export interface RoleMatrixItem {
  sectionId: AdminSection;
  titleBn: string;
  titleEn: string;
  scope: string;
  admin: boolean;
  moderator: boolean;
  editor: boolean;
  employee: boolean;
  client: boolean;
}

export const ROLE_PERMISSION_MATRIX: RoleMatrixItem[] = [
  {
    sectionId: "overview",
    titleBn: "ওভারভিউ ও অ্যানালিটিক্স",
    titleEn: "Overview & Analytics, Contact Inbox",
    scope: "ড্যাশবোর্ড মেট্রিক্স ও সাধারণ গ্রাহক বার্তা পর্যবেক্ষণ",
    admin: true,
    moderator: true,
    editor: false,
    employee: false,
    client: false,
  },
  {
    sectionId: "portfolio",
    titleBn: "পোর্টফোলিও ও জার্নাল",
    titleEn: "Portfolio (Projects, Gallery, Blogs)",
    scope: "ল্যান্ডস্কেপ প্রকল্প, ফটো গ্যালারি ও ব্লগ প্রকাশনা",
    admin: true,
    moderator: true,
    editor: true,
    employee: false,
    client: false,
  },
  {
    sectionId: "reviews",
    titleBn: "রিভিউ মডারেশন",
    titleEn: "Reviews Approval",
    scope: "গ্রাহকদের রিভিউ নিরীক্ষণ ও প্রকাশনা অনুমোদন",
    admin: true,
    moderator: true,
    editor: false,
    employee: false,
    client: false,
  },
  {
    sectionId: "services_bookings",
    titleBn: "সার্ভিস ও অপারেশনাল টাস্ক",
    titleEn: "Services & Bookings (Operations)",
    scope: "বুকিং, ডিজাইন রিকোয়েস্ট, ট্রি ডক্টর, মেইনটেনেন্স ও সার্ভিস কার্ড",
    admin: true,
    moderator: true,
    editor: false,
    employee: true,
    client: false,
  },
  {
    sectionId: "finance",
    titleBn: "ফাইন্যান্স ও ইনভেন্টরি",
    titleEn: "Finance & Studio P&L",
    scope: "আয়-ব্যয়, ইনভেন্টরি কস্ট, কোটেশন ও চালান",
    admin: true,
    moderator: false,
    editor: false,
    employee: false,
    client: false,
  },
  {
    sectionId: "staff_careers",
    titleBn: "স্টাফ ও নিয়োগ কার্যক্রম",
    titleEn: "Staff & Careers HR",
    scope: "কর্মচারী প্রোফাইল, উপস্থিতি, বেতন ও চাকরির আবেদন যাচাই",
    admin: true,
    moderator: false,
    editor: false,
    employee: false,
    client: false,
  },
  {
    sectionId: "website_studio",
    titleBn: "ওয়েবসাইট স্টুডিও ডিজাইন",
    titleEn: "Website Studio (Navbar, Hero, Sections)",
    scope: "হেডার, হিরো ব্যানার, হোমপেজ সেকশন ও টেক্সট কনটেন্ট",
    admin: true,
    moderator: false,
    editor: true,
    employee: false,
    client: false,
  },
  {
    sectionId: "security_roles",
    titleBn: "সিকিউরিটি ও মাস্টার কনফিগ",
    titleEn: "Security & User Roles",
    scope: "মাস্টার সেটিংস, ইউজার অ্যাকাউন্ট ও পাসওয়ার্ড কন্ট্রোল",
    admin: true,
    moderator: false,
    editor: false,
    employee: false,
    client: false,
  },
];
