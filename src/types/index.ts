export type UserRole = "client" | "admin" | "editor" | "moderator";

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
  client?: string;
  category: string;
  imageUrl?: string;
  images?: string[];
  videoUrl?: string;
  location?: string;
  duration?: string;
  budgetRange?: string;
  cost?: number;
  challenges?: string;
  solution?: string;
  clientTestimonial?: ITestimonial;
  featured?: boolean;
  status?: string;
  createdAt?: string | Date;
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
  paymentStatus?: "unpaid" | "paid";
  assignedStaff?: string;
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
  status?: "Pending" | "Approved" | "Rejected";
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
  [key: string]: any;
}
