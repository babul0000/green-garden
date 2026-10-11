export interface NavbarProps {
  onOpenEstimator?: () => void;
}

export interface IMenuLink {
  id: string;
  titleBn: string;
  titleEn: string;
  url: string;
  badge?: string;
  isVisible: boolean;
  order: number;
}

export interface INavbarConfig {
  logoType?: "TEXT" | "IMAGE";
  logoText?: string;
  logoImage?: string;
  logoHeight?: number;
  logoTracking?: string;
  hotlinePhone?: string;
  hotlineDisplay?: string;
  hotlineVisible?: boolean;
  whatsappNumber?: string;
  whatsappMessage?: string;
  whatsappVisible?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  socialVisible?: boolean;
  enableLanguageSwitch?: boolean;
  enable3dWizardLink?: boolean;
  enableEmergencyDoctor?: boolean;
  menuLinks?: IMenuLink[];
}

export const defaultNavbarConfig: INavbarConfig = {
  logoType: "TEXT",
  logoText: "A R GREEN GARDEN",
  logoImage: "",
  logoHeight: 28,
  logoTracking: "0.24em",
  hotlinePhone: "01883012641",
  hotlineDisplay: "০১88৩-০১২৬৪১",
  hotlineVisible: true,
  whatsappNumber: "8801883012641",
  whatsappMessage: "Hello A R Green Garden, I would like to consult about my garden.",
  whatsappVisible: true,
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  youtubeUrl: "https://youtube.com",
  socialVisible: true,
  enableLanguageSwitch: true,
  enable3dWizardLink: true,
  enableEmergencyDoctor: true,
  menuLinks: [
    { id: "1", titleBn: "প্রকল্পসমূহ", titleEn: "Projects", url: "/projects", isVisible: true, order: 1 },
    { id: "2", titleBn: "মেথডোলজি", titleEn: "Methodology", url: "#process", isVisible: true, order: 2 },
    { id: "3", titleBn: "আমাদের টিম", titleEn: "Our Team", url: "/team", isVisible: true, order: 3 },
    { id: "4", titleBn: "স্টুডিও পরিচিতি", titleEn: "About Studio", url: "/about", isVisible: true, order: 4 },
    { id: "5", titleBn: "সেবাসমূহ", titleEn: "Services", url: "/services", isVisible: true, order: 5 },
    { id: "6", titleBn: "প্ল্যান্ট শপ ও নার্সারি", titleEn: "Plant Nursery & Shop", url: "/shop", badge: "SHOP", isVisible: true, order: 6 },
    { id: "7", titleBn: "বিফোর-আফটার রূপান্তর", titleEn: "Before & After", url: "/before-after", badge: "NEW", isVisible: true, order: 7 },
    { id: "8", titleBn: "ফটো গ্যালারি", titleEn: "Gallery", url: "/gallery", isVisible: true, order: 8 },
    { id: "9", titleBn: "গ্রাহক মতামত", titleEn: "Testimonials", url: "/testimonials", isVisible: true, order: 9 },
    { id: "10", titleBn: "সংবাদ ও ইভেন্টস", titleEn: "Recent News & Events", url: "/blog", isVisible: true, order: 10 },
    { id: "11", titleBn: "সাধারণ জিজ্ঞাসা", titleEn: "FAQ", url: "/faq", isVisible: true, order: 11 },
    { id: "12", titleBn: "ক্যারিয়ার", titleEn: "Careers", url: "/career", isVisible: true, order: 12 },
    { id: "13", titleBn: "যোগাযোগ", titleEn: "Contact Us", url: "/contact", isVisible: true, order: 13 },
  ],
};
