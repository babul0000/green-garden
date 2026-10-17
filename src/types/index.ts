export type UserRole = "client" | "admin" | "editor" | "moderator" | "employee";

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IService {
  id?: string;
  _id?: string;
  label?: string;
  title?: string;
  slug: string;
  desc?: string;
  description?: string;
  longContent?: string;
  icon?: string;
  banner?: string;
  bannerImage?: string;
  pricing?: string;
  features?: string[];
  benefits?: string[];
  titleBn?: string;
  descBn?: string;
  order?: number;
  process?: { title: string; text: string }[];
  faqs?: { q: string; a: string }[];
  createdAt?: string | Date;
}

export interface ITestimonial {
  name?: string;
  text?: string;
  rating?: number;
  location?: string;
  date?: string;
}

export interface IProject {
  id?: string;
  _id?: string;
  name: string;
  title?: string;
  slug: string;
  clientId?: string;
  client?: string;
  clientName?: string;
  clientPhone?: string;
  category: string;
  imageUrl?: string;
  beforeImage?: string;
  afterImage?: string;
  wipImages?: string[];
  images?: string[];
  videoUrl?: string;
  location?: string;
  duration?: string;
  budgetRange?: string;
  budget?: number;
  totalExpense?: number;
  cost?: number;
  progress?: number;
  status?: string;
  startDate?: string | Date;
  deadline?: string | Date;
  completionDate?: string | Date;
  warrantyMonths?: number;
  description?: string;
  challenges?: string;
  solution?: string;
  clientTestimonial?: ITestimonial;
  featured?: boolean;
  notes?: string;
  materialsUsed?: any;
  titleBn?: string;
  descBn?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IGalleryItem {
  id?: string;
  _id?: string;
  imageUrl: string;
  beforeImageUrl?: string;
  category: string;
  title: string;
  caption?: string;
  watermarked?: boolean;
  order?: number;
  featured?: boolean;
  createdAt?: string | Date;
}

export interface IBlogComment {
  id?: string;
  _id?: string;
  name?: string;
  user?: string;
  text: string;
  approved?: boolean;
  date?: string | Date;
  createdAt?: string | Date;
}

export interface IBlog {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  author: string;
  coverImage?: string;
  category: string;
  content: string;
  titleBn?: string;
  descBn?: string;
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED" | string;
  readingTime?: string;
  comments?: IBlogComment[];
  createdAt?: string | Date;
}

export interface IBooking {
  id?: string;
  _id?: string;
  clientName?: string;
  clientEmail?: string;
  user?: string;
  phone?: string;
  address?: string;
  service: string;
  budgetRange?: string;
  budgetTier?: string;
  size?: number;
  message?: string;
  status?: "pending" | "confirmed" | "completed" | "Pending" | "Confirmed" | "Completed";
  assignedStaff?: string;
  assignedStaffId?: string;
  assignedStaffMember?: {
    id: string;
    name: string;
    designation?: string;
    photo?: string;
  };
  bookingDate?: string | Date;
  date?: string | Date;
  createdAt?: string | Date;
}

export interface IReview {
  id?: string;
  _id?: string;
  name: string;
  rating: number;
  comment?: string;
  text?: string;
  service?: string;
  location?: string;
  status?: "Pending" | "Approved" | "Rejected" | string;
  featured?: boolean;
  adminReply?: string;
  photoUrl?: string;
  projectId?: string;
  date?: string;
  createdAt?: string | Date;
}

export interface ICareerApplication {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  coverLetter?: string;
  resumeUrl: string;
  status?: "Pending" | "Reviewing" | "Shortlisted" | "Rejected";
  createdAt?: string | Date;
}

export interface IProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  desc: string;
}

export interface ICartItem extends IProduct {
  qty: number;
}

export interface IMessage {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status?: string;
  createdAt?: string | Date;
}

export interface ISetting {
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  fbPage?: string;
  youtube?: string;
  themeColor?: string;
  seoDescription?: string;
  hero_config?: IHeroSettings;
  [key: string]: any;
}

export interface IHeroSettings {
  // 1. Background Media Settings
  mediaType: "video" | "image";
  videoUrl: string;
  posterImageUrl: string;
  autoPlay: boolean;
  loop: boolean;
  muted: boolean;
  playbackSpeed: number;
  imageUrl?: string;

  // 2. Visual Vignette & Overlay
  overlayDarkness: number; // 0 - 80 %
  showTopVignette: boolean;
  showBottomVignette: boolean;

  // 3. Slide-Out CTA Button Controller
  ctaEnabled: boolean;
  ctaTriggerMode: "hover" | "always_visible";
  ctaHoverZoneWidth: number;
  ctaAnimationDuration: number;

  // Button 1 (Projects)
  btnProjectsVisible: boolean;
  btnProjectsTextEn: string;
  btnProjectsTextBn: string;
  btnProjectsLink: string;
  btnProjectsAction: "scroll" | "navigate";
  btnProjectsStyle: "white-pill" | "dark-glass" | "emerald";

  // Button 2 (Contact)
  btnContactVisible: boolean;
  btnContactTextEn: string;
  btnContactTextBn: string;
  btnContactLink: string;
  btnContactStyle: "emerald-glow" | "white-pill" | "dark-glass";

  // 4. Optional Text Overlay
  enableTextOverlay: boolean;
  taglineEn?: string;
  taglineBn?: string;
  headlineEn?: string;
  headlineBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
  textPosition?: "center" | "bottom-left";
  version?: number | string;
  updatedAt?: number | string;
}

export const defaultHeroSettings: IHeroSettings = {
  mediaType: "image",
  videoUrl: "",
  posterImageUrl: "/hero_plants.png",
  autoPlay: true,
  loop: true,
  muted: true,
  playbackSpeed: 1.0,
  imageUrl: "/hero_plants.png",

  overlayDarkness: 10,
  showTopVignette: true,
  showBottomVignette: true,

  ctaEnabled: true,
  ctaTriggerMode: "hover",
  ctaHoverZoneWidth: 280,
  ctaAnimationDuration: 400,

  btnProjectsVisible: true,
  btnProjectsTextEn: "Projects",
  btnProjectsTextBn: "প্রকল্পসমূহ",
  btnProjectsLink: "#projects",
  btnProjectsAction: "scroll",
  btnProjectsStyle: "white-pill",

  btnContactVisible: true,
  btnContactTextEn: "Contact",
  btnContactTextBn: "যোগাযোগ",
  btnContactLink: "/contact",
  btnContactStyle: "emerald-glow",

  enableTextOverlay: true,
  taglineEn: "LANDSCAPE ARCHITECTURE & URBAN BIOPHILIA",
  taglineBn: "ল্যান্ডস্কেপ আর্কিটেকচার ও বায়োফিলিক সবুজায়ন",
  headlineEn: "WEAVING NATURE INTO MODERN ARCHITECTURE",
  headlineBn: "প্রকৃতিকে আধুনিক স্থাপত্যের সাথে সমন্বিত করা",
  descriptionEn: "Creating living, breathing ecosystems that enhance well-being, cool urban density, and restore biodiversity.",
  descriptionBn: "টেকসই ও মনোরম ল্যান্ডস্কেপ তৈরির মাধ্যমে প্রতিটি স্থানকে একটি জীবন্ত মরূদ্যানে রূপান্তর করি।",
  textPosition: "bottom-left",
};

