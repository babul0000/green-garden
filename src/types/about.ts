export interface AboutHeroConfig {
  visible: boolean;
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  coverImage?: string;
}

export interface AboutStoryConfig {
  visible: boolean;
  storyTitleEn: string;
  storyTitleBn: string;
  storyEn: string;
  storyBn: string;
  missionTitleEn: string;
  missionTitleBn: string;
  missionEn: string;
  missionBn: string;
  visionTitleEn: string;
  visionTitleBn: string;
  visionEn: string;
  visionBn: string;
}

export interface AboutStatItem {
  id: string;
  value: string;
  labelEn: string;
  labelBn: string;
}

export interface AboutStatsConfig {
  visible: boolean;
  items: AboutStatItem[];
}

export interface AboutMilestoneItem {
  id: string;
  year: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

export interface AboutMilestonesConfig {
  visible: boolean;
  headingEn: string;
  headingBn: string;
  subheadingEn: string;
  subheadingBn: string;
  items: AboutMilestoneItem[];
}

export interface AboutTeamMember {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  bioEn: string;
  bioBn: string;
  photo?: string;
  icon?: string;
}

export interface AboutTeamConfig {
  visible: boolean;
  headingEn: string;
  headingBn: string;
  subheadingEn: string;
  subheadingBn: string;
  members: AboutTeamMember[];
}

export interface AboutCtaConfig {
  visible: boolean;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  primaryBtnTextEn: string;
  primaryBtnTextBn: string;
  primaryBtnLink: string;
  secondaryBtnTextEn: string;
  secondaryBtnTextBn: string;
  secondaryBtnLink: string;
}

export interface AboutPageConfig {
  hero: AboutHeroConfig;
  storySection: AboutStoryConfig;
  statsSection: AboutStatsConfig;
  milestonesSection: AboutMilestonesConfig;
  teamSection: AboutTeamConfig;
  ctaSection: AboutCtaConfig;
}

export const DEFAULT_ABOUT_CONFIG: AboutPageConfig = {
  hero: {
    visible: true,
    badgeEn: "Our Journey",
    badgeBn: "আমাদের পথচলা",
    titleEn: "We Design Harmonious Urban Ecosystems",
    titleBn: "আমরা নির্মাণ করি প্রকৃতি ও স্থাপত্যের মেলবন্ধন",
    subtitleEn: "Bangladesh's Premier Landscape Architecture Studio",
    subtitleBn: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও",
    descriptionEn:
      "AR Green Garden is Bangladesh's premier landscape architecture and urban design studio. Since 2016, we have transformed hundreds of concrete rooftops, balconies, and indoor spaces into vibrant, living sanctuaries.",
    descriptionBn:
      "এ আর গ্রিন গার্ডেন বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার ও নগর নকশা স্টুডিও। ২০১৬ সাল থেকে আমরা শত শত কংক্রিট ছাদ, বারান্দা এবং ইনডোর স্পেসকে রূপান্তরিত করেছি সবুজ ও প্রাণবন্ত প্রাকৃতিক আবাসে।",
    coverImage: "/hero_plants.png",
  },
  storySection: {
    visible: true,
    storyTitleEn: "Our Story",
    storyTitleBn: "আমাদের গল্প",
    storyEn:
      "It all started with a simple observation: Dhaka's rapid urban growth was cutting off citizens from nature. Determined to make a change, our founders combined botanical sciences with modern architecture to create self-sustaining green solutions. Today, we are a full-service team crafting premium landscapes.",
    storyBn:
      "একটি সহজ চিন্তা থেকেই আমাদের যাত্রা শুরু: ঢাকার তীব্র নগরায়ন মানুষকে প্রকৃতি থেকে দূরে সরিয়ে দিচ্ছিল। তাই প্রকৃতি ও স্থাপত্যের মেলবন্ধন ঘটিয়ে আমরা গড়ে তুলছি টেকসই সবুজ সমাধান। আজ আমরা একটি পূর্ণাঙ্গ পেশাদার দল হিসেবে প্রিমিয়াম ল্যান্ডস্কেপ সৃষ্টিতে অগ্রগামী।",
    missionTitleEn: "Our Mission",
    missionTitleBn: "আমাদের মিশন",
    missionEn:
      "To integrate natural ecology into modern construction, reducing urban heat islands and building resilient, oxygen-rich environments.",
    missionBn:
      "স্থাপত্য নির্মাণে প্রাকৃতিক বাস্তুতন্ত্রের সংযোজন ঘটিয়ে নগরীর তাপমাত্রা হ্রাস এবং বিশুদ্ধ অক্সিজেন সমৃদ্ধ টেকসই পরিবেশ তৈরি।",
    visionTitleEn: "Our Vision",
    visionTitleBn: "আমাদের ভিশন",
    visionEn:
      "To lead Bangladesh's transition towards green cities where every building features carbon-absorbing rooftops and living vertical walls.",
    visionBn:
      "একটি সবুজ বাংলাদেশের নেতৃত্ব দেওয়া যেখানে প্রতিটি ভবন হবে কার্বন শোষণকারী ছাদবাগান এবং জীবন্ত গ্রিন ওয়ালে সজ্জিত।",
  },
  statsSection: {
    visible: true,
    items: [
      { id: "stat-1", value: "96+", labelEn: "Projects Completed", labelBn: "সম্পন্ন প্রকল্প" },
      { id: "stat-2", value: "250+", labelEn: "Happy Clients", labelBn: "সন্তুষ্ট ক্লায়েন্ট" },
      { id: "stat-3", value: "35+", labelEn: "Team Specialists", labelBn: "বিশেষজ্ঞ টিম" },
      { id: "stat-4", value: "10+", labelEn: "Years Experience", labelBn: "বছরের অভিজ্ঞতা" },
    ],
  },
  milestonesSection: {
    visible: true,
    headingEn: "Company Milestones",
    headingBn: "কোম্পানি মাইলস্টোন ও অর্জন",
    subheadingEn: "A timeline of our achievements and milestones over the years",
    subheadingBn: "বিগত বছরগুলোতে আমাদের টেকসই উন্নয়ন ও অর্জনের ধারাবাহিক টাইমলাইন",
    items: [
      {
        id: "ms-1",
        year: "2016",
        titleEn: "Company Founded",
        titleBn: "স্টুডিও প্রতিষ্ঠা",
        descEn: "Started as a small consulting firm in Dhanmondi, Dhaka with a mission to bring nature back to urban spaces.",
        descBn: "ধানমন্ডি, ঢাকায় একটি ক্ষুদ্র কনসাল্টিং ফার্ম হিসেবে নগর জীবনে প্রকৃতির ছোঁয়া ফিরিয়ে আনার প্রত্যয়ে যাত্রা শুরু।",
      },
      {
        id: "ms-2",
        year: "2019",
        titleEn: "100+ Projects Completed",
        titleBn: "১০০+ প্রকল্প সম্পন্ন",
        descEn: "Expanded operations to Chittagong and completed major rooftop setups for top real estate developers.",
        descBn: "চট্টগ্রামে কার্যক্রম বিস্তার এবং শীর্ষস্থানীয় রিয়েল এস্টেট ডেভেলপারদের জন্য বৃহৎ ছাদবাগান প্রকল্প সফলভাবে বাস্তবায়ন।",
      },
      {
        id: "ms-3",
        year: "2022",
        titleEn: "Pioneered Vertical Gardens",
        titleBn: "ভার্টিক্যাল গার্ডেনের অগ্রযাত্রা",
        descEn: "Introduced advanced drip-irrigation green wall panels to corporate offices and luxurious hotels.",
        descBn: "কর্পোরেট অফিস ও বিলাসবহুল হোটেলের জন্য উন্নত ড্রিপ-ইরিগেশন গ্রিন ওয়াল প্রযুক্তির প্রবর্তন।",
      },
      {
        id: "ms-4",
        year: "2026",
        titleEn: "Bangladesh's Premier Landscaper",
        titleBn: "দেশের শীর্ষ ল্যান্ডস্কেপ ব্র্যান্ড",
        descEn: "Ranked as the #1 design agency for sustainable urban landscaping and eco-friendly garden architecture.",
        descBn: "টেকসই নগর ল্যান্ডস্কেপিং ও পরিবেশবান্ধব গার্ডেন স্থাপত্যে দেশের শীর্ষস্থানীয় এজেন্সি হিসেবে স্বীকৃতি।",
      },
    ],
  },
  teamSection: {
    visible: true,
    headingEn: "Meet Our Leadership",
    headingBn: "আমাদের নেতৃত্ব ও বিশেষজ্ঞ দল",
    subheadingEn: "Our projects succeed thanks to our multidisciplinary team of designers, horticultural specialists, and support crew.",
    subheadingBn: "ল্যান্ডস্কেপ আর্কিটেক্ট, বোটানিস্ট ও অভিজ্ঞ সাইট ইঞ্জিনিয়ারদের সমন্বয়ে আমাদের পেশাদার দল নিরলস কাজ করছে।",
    members: [
      {
        id: "tm-1",
        nameEn: "Tanvir Ahmed",
        nameBn: "তানভীর আহমেদ",
        roleEn: "Founder & CEO",
        roleBn: "প্রতিষ্ঠাতা ও প্রধান নির্বাহী",
        bioEn: "12+ years in environmental engineering and landscape masterplanning.",
        bioBn: "পরিবেশ প্রকৌশল ও ল্যান্ডস্কেপ মাস্টারপ্ল্যানিংয়ে ১২+ বছরের অভিজ্ঞতা।",
        icon: "👨‍💼",
        photo: "/team_1.png",
      },
      {
        id: "tm-2",
        nameEn: "Sultana Yasmin",
        nameBn: "সুলতানা ইয়াসমিন",
        roleEn: "Principal Landscape Architect",
        roleBn: "প্রধান ল্যান্ডস্কেপ স্থপতি",
        bioEn: "Renowned architect specialized in bio-climatic designs and biophilic living.",
        bioBn: "বায়ো-ক্লাইম্যাটিক নকশা ও জীববৈচিত্র্য সুরক্ষায় আন্তর্জাতিকভাবে স্বীকৃত স্থপতি।",
        icon: "👩‍🎨",
        photo: "/team_2.png",
      },
      {
        id: "tm-3",
        nameEn: "Dr. Rafiqul Islam",
        nameBn: "ড. রফিকুল ইসলাম",
        roleEn: "Chief Botanist & Agronomist",
        roleBn: "প্রধান বোটানিস্ট ও কৃষিবিদ",
        bioEn: "Expert in soil microbiology and sub-tropical plant propagation.",
        bioBn: "মাটির পুষ্টি উপাদান এবং ক্রান্তীয় অঞ্চলের উদ্ভিদবিদ্যায় পিএইচডি গবেষক।",
        icon: "👨‍🔬",
        photo: "/team_3.png",
      },
    ],
  },
  ctaSection: {
    visible: true,
    titleEn: "Ready to Remodel Your Space?",
    titleBn: "আপনার ছাদ বা প্রাঙ্গণকে সবুজে সাজাতে প্রস্তুত?",
    descEn: "Get in touch with our design studio today for a free design audit and estimate callback.",
    descBn: "আমাদের অভিজ্ঞ আর্কিটেক্ট দলের সাথে আজই যোগাযোগ করুন ফ্রি সাইট নিরীক্ষা ও আনুমানিক খরচের হিসেব পেতে।",
    primaryBtnTextEn: "Get Free Estimate",
    primaryBtnTextBn: "ফ্রি এস্টিমেট পান",
    primaryBtnLink: "#estimate",
    secondaryBtnTextEn: "Contact Us",
    secondaryBtnTextBn: "যোগাযোগ করুন",
    secondaryBtnLink: "/contact",
  },
};

