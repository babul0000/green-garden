import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedDemoData = async (): Promise<void> => {
  console.log("🌱 Starting AR Green Garden DEMO Seeding (Services, Projects & Gallery)...");

  // 1. All 7 Categories of Services
  const servicesData = [
    // ----------------------------------------------------
    // Category 1: Landscape Design & Implementation
    // ----------------------------------------------------
    {
      label: "Residential Landscape Design",
      slug: "residential-landscape",
      category: "Landscape Design & Implementation",
      desc: "ব্যক্তিগত বাড়ি, ডুপ্লেক্স বা ভিলার চারপাশ ও উঠানের নান্দনিক স্থাপত্য নকশা ও পূর্ণাঙ্গ বাস্তবায়ন।",
      icon: "🏡",
      pricing: "৳৫০,০০০ থেকে শুরু",
      features: [
        "2D & 3D Master Architectural Layout",
        "Bermuda / Japanese Sod Lawn",
        "Natural Stone Walkway Paving",
        "Ambient Landscape Mood Lighting",
        "Custom Plant Bed Sculpting",
      ],
      benefits: [
        "বাড়ির নান্দনিক রূপ ও বাজারমূল্য বহুগুণ বৃদ্ধি করে",
        "প্রাকৃতিক ছায়াশীতল পরিবেশ ও শিশুদের নিরাপদ খেলার জায়গা",
        "সম্পূর্ণ পানি নিষ্কাশন ও ড্রেনেজ নিশ্চয়তা",
      ],
      process: [
        { title: "১. সাইট সার্ভে ও সয়েল টেস্ট", text: "আমাদের ল্যান্ডস্কেপ আর্কিটেক্ট সাইট ভিজিট করে মাপজোখ ও মাটির মান যাচাই করেন।" },
        { title: "২. থ্রি-ডি (3D) ডিজাইন উপস্থাপন", text: "ক্লায়েন্টকে পছন্দসই গাছপালা ও ওয়াকওয়ের পূর্ণাঙ্গ 3D ভিজ্যুয়ালাইজেশন দেখানো হয়।" },
        { title: "৩. হার্ডস্কেপ ও সয়েল প্রিপারেশন", text: "মাটি প্রস্তুতকরণ, ওয়াকওয়ে ও বর্ডার নির্মাণ সম্পন্ন করা হয়।" },
        { title: "৪. বৃক্ষরোপণ ও লাইটিং ফিনিশিং", text: "উন্নত প্রজাতির গাছ, কার্পেট ঘাস এবং নাইট লাইটিং স্থাপন করে প্রজেক্ট হ্যান্ডওভার করা হয়।" },
      ],
      faqs: [
        { q: "একটি রেসিডেন্সিয়াল প্রজেক্ট সম্পন্ন করতে কতদিন সময় লাগে?", a: "সাধারণত জায়গার পরিমাপ অনুযায়ী ১০ থেকে ২৫ কার্যদিবসের মধ্যে সম্পন্ন হয়।" },
        { q: "আমরা কি আমাদের পছন্দমতো গাছ নির্বাচন করতে পারব?", a: "হ্যাঁ, আমাদের ক্যাটালগ থেকে আপনি যেকোনো দেশি ও বিদেশি গাছ নির্বাচন করতে পারবেন।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Commercial & Corporate Landscape",
      slug: "commercial-landscape",
      category: "Landscape Design & Implementation",
      desc: "করপোরেট অফিস, শপিং মল এবং বাণিজ্যিক ভবনের প্রিমিয়াম গ্রিন এক্সটেরিয়র ও পরিবেশবান্ধব বায়োফিলিক ডিজাইন।",
      icon: "🏢",
      pricing: "৳১,০০,০০০ থেকে শুরু",
      features: [
        "Corporate Executive Entryway Planters",
        "Zero-leakage Waterproof Facade Planters",
        "Pollution-absorbing Tree Belts",
        "Automated Sub-surface Fertigation",
        "VIP Lounge Greenery Integration",
      ],
      benefits: [
        "করপোরেট প্রতিষ্ঠানের ইকো-ফ্রেন্ডলি ব্র্যান্ড ইমেজ বৃদ্ধি",
        "কর্মীদের কাজের স্পৃহা ও উৎপাদনশীলতা বৃদ্ধি",
        "বাতাসের ক্ষতিকর কার্বন ও ধুলাবালি ফিল্টারিং",
      ],
      process: [
        { title: "১. কর্পোরেট সাইট অ্যানালাইসিস", text: "ভবনের স্থাপত্য শৈলী ও সানলাইট এক্সপোজার বিশ্লেষণ।" },
        { title: "২. কমপ্লায়েন্স ও ডিজাইন অনুমোদন", text: "বিল্ডিং কোড ও অগ্নি-নিরাপত্তা মেনে মাস্টারপ্ল্যান ফাইনাল।" },
        { title: "৩. দ্রুত ও সুশৃঙ্খল বাস্তবায়ন", text: "অফিস কার্যক্রমে বিঘ্ন না ঘটিয়ে দ্রুততম সময়ে বাস্তবায়ন।" },
      ],
      faqs: [
        { q: "অফিস চলাকালীন কি কাজ করা সম্ভব?", a: "হ্যাঁ, আমরা ছুটির দিন বা অফিস টাইমের বাইরে কাজ করার বিশেষ শিফট পরিচালনা করি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Resort & Eco-Park Landscape",
      slug: "resort-landscape",
      category: "Landscape Design & Implementation",
      desc: "বিলাসবহুল রিসোর্ট, ফার্মহাউস ও অবকাশ যাপন কেন্দ্রের জন্য প্রাকৃতিক লেক, গার্ডেন কটেজ ও ওয়াকওয়ে নকশা।",
      icon: "🏝️",
      pricing: "কাস্টম প্রজেক্ট কোটেশন",
      features: [
        "Tropical Waterbody & Pond Landscaping",
        "Woodland Trails & Cobblestone Paths",
        "Traditional Wooden Pergolas & Gazebos",
        "Native Fruit & Flowering Forests",
        "Campfire & Outdoor Lounge Amphitheater",
      ],
      benefits: [
        "পর্যটকদের জন্য অনন্য প্রাকৃতিক অবকাশ ও ইনস্টাগ্রাম-ফ্রেন্ডলি ফটো জোন",
        "দীর্ঘস্থায়ী ও কম রক্ষণাবেক্ষণযোগ্য স্থানীয় উদ্ভিদের সমাবেশ",
      ],
      process: [
        { title: "১. টপোগ্রাফি ও ল্যান্ডস্কেপ জনিং", text: "উঁচু-নিচু ভূমি রূপ অনুযায়ী বিভিন্ন থিমভিত্তিক জোনিং।" },
        { title: "২. লেক ও ওয়াটার ফিচার ক্রিয়েশন", text: "প্রাকৃতিক লেক উন্নয়ন ও ফ্লোটিং প্ল্যান্টার স্থাপন।" },
        { title: "৩. বৃক্ষরোপণ ও পাথওয়ে উন্নয়ন", text: "ছায়াদানকারী ও আকর্ষণীয় ফুলের গাছের সমাহার।" },
      ],
      faqs: [
        { q: "ঢাকার বাইরে কি আপনারা রিসোর্টের কাজ করেন?", a: "হ্যাঁ, আমরা কক্সবাজার, শ্রীমঙ্গল, গাজীপুর ও সিলেটসহ সারা দেশে রিসোর্ট ল্যান্ডস্কেপিং পরিচালনা করি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Café & Restaurant Landscape",
      slug: "cafe-restaurant-landscape",
      category: "Landscape Design & Implementation",
      desc: "গ্রাহকদের আকর্ষিত করতে রুফটপ ক্যাফে, গার্ডেন রেস্তোরাঁ ও আলফ্রেসকো ডাইনিং এর নান্দনিক সবুজায়ন।",
      icon: "☕",
      pricing: "৳৪০,০০০ থেকে শুরু",
      features: [
        "Hanging Planters & Climber Trellis",
        "Warm Fairy Lights & Canopy Illumination",
        "Aromatic Herb Garden for Kitchen",
        "Compact Green Screens between Tables",
      ],
      benefits: [
        "গ্রাহকদের জন্য আকর্ষণীয় ফটো-অপ ও প্রিমিয়াম ক্যাফে ভাইব",
        "প্রাকৃতিক শীতল পরিবেশ যা এসির বিদ্যুৎ খরচ সাশ্রয় করে",
      ],
      process: [
        { title: "১. ডাইনিং লেআউট স্টাডি", text: "গ্রাহকদের বসার পর্যাপ্ত জায়গা রেখে সবুজায়নের নকশা প্রণয়ন।" },
        { title: "২. প্ল্যান্টার্স ও লাইটিং সেটআপ", text: "হ্যাংগিং টব ও নাইট লাইটিং স্থাপন।" },
      ],
      faqs: [
        { q: "গাছপালায় কি মশা বা পোকার উপদ্রব হবে?", a: "না, আমরা মশা তাড়ানো তুলসী, সিট্রোনেলা ও সুগন্ধি ভেষজ গাছ এবং নিয়মিত অর্গানিক স্প্রে ব্যবহারের সুপারিশ করি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    },

    // ----------------------------------------------------
    // Category 2: Garden Services
    // ----------------------------------------------------
    {
      label: "Rooftop Garden Setup",
      slug: "rooftop-gardening",
      category: "Garden Services",
      desc: "১০০% ওয়াটারপ্রুফিং গ্যারান্টি, ড্রেনেজ সেল ও হালকা সয়েল মিডিয়ায় কংক্রিটের ছাদকে সবুজ স্বর্গে রূপান্তর।",
      icon: "🌇",
      pricing: "৳১,৫০,০০০ থেকে শুরু",
      features: [
        "3-Layer Elastomeric Membrane Waterproofing (10-Yr Guarantee)",
        "Heavy-duty HDPE Drainage Cells & Geotextile Membrane",
        "Lightweight Cocopeat-Vermicompost Soil Blend",
        "Automated Wi-Fi Controlled Micro Drip Network",
        "Fruit Trees, Exotic Flowers & Bermuda Lawn",
      ],
      benefits: [
        "ছাদের কংক্রিটের তাপমাত্রা ১২-১৫ ডিগ্রি সেলসিয়াস পর্যন্ত কমায়",
        "তাজা ও বিষমুক্ত পরিবারের দৈনন্দিন শাক-সবজি ও ফলমূল প্রাপ্তি",
        "বিল্ডিংয়ের ছাদের স্থায়িত্ব ও ওয়াটারপ্রুফ সুরক্ষা নিশ্চিত করে",
      ],
      process: [
        { title: "১. ছাদের লোড ও ওয়াটারপ্রুফিং টেস্ট", text: "ছাদের লোড বিয়ারিং ক্ষমতা পরিমাপ ও ৪৮ ঘণ্টার পানি আটকে রেখে লিকেজ পরীক্ষা।" },
        { title: "২. ড্রেনেজ সেল ও জিওটেক্সটাইল লেয়ার", text: "অতিরিক্ত পানি দ্রুত নেমে যাওয়ার জন্য ড্রেনেজ গ্রিড স্থাপন।" },
        { title: "৩. লাইটওয়েট মাটি প্রস্তুতকরণ", text: "ভারী মাটির বদলে কোকোপিট, পার্লাইট ও কেঁচো সারের বৈজ্ঞানিক মিশ্রণ।" },
        { title: "৪. প্ল্যান্টেশন ও অটো সেচ সংযোগ", text: "গাছ রোপণ ও স্বয়ংক্রিয় পানির পাইপলাইন সংযোগ।" },
      ],
      faqs: [
        { q: "ছাদবাগানে ছাদের কোনো ক্ষতি হবে কি?", a: "একদমই না। আমরা আন্তর্জাতিক মানের ৩-স্তর ওয়াটারপ্রুফিং ও ড্রেনেজ সেল ব্যবহার করি, যার ফলে ছাদে পানি জমার কোনো সুযোগ থাকে না।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Vertical Wall Greenery",
      slug: "vertical-garden",
      category: "Garden Services",
      desc: "ঘরের দেয়াল বা বিল্ডিংয়ের বাইরের দেয়ালে জীবিত গাছের উচ্চ ঘনত্বের জীবন্ত গ্রিন ওয়াল আর্টওয়ার্ক।",
      icon: "🍃",
      pricing: "৳৪৫০ - ৬৫০ / sqft",
      features: [
        "Rust-proof Aluminum Frame & Waterproof PVC Backing",
        "Non-woven Geotextile Felt Pocket Growth System",
        "Integrated Micro Irrigation & Fertilizer Injection",
        "Air-purifying Ferns, Syngonium & Epipremnum Foliage",
        "Indoor Ambient Grow Lights Integration",
      ],
      benefits: [
        "মেঝের জায়গা নষ্ট না করেই সর্বোচ্চ সবুজায়ন",
        "প্রাকৃতিক শব্দ শোষণকারী ইনসুলেশন হিসেবে কাজ করে",
        "ইনডোর বায়ুর আর্দ্রতা ও অক্সিজেনের মাত্রা বৃদ্ধি করে",
      ],
      process: [
        { title: "১. দেয়াল সুরক্ষামূলক ফ্রেম স্থাপন", text: "দেয়াল থেকে আর্দ্রতা দূরে রাখতে অ্যালুমিনিয়াম ও পিভিসি বোর্ড মাউন্ট।" },
        { title: "২. ফেল্ট গ্রোথ পকেট সংযোজন", text: "গাছের শিকড়ের স্বাভাবিক বৃদ্ধির জন্য ডুয়াল লেয়ার জিওটেক্সটাইল পকেট স্থাপন।" },
        { title: "৩. অটো ড্রিপ পাইপলাইন সংযোগ", text: "প্রতিটি পকেটে নিয়মিত পানি ও পুষ্টি পৌঁছাতে টাইমার ড্রিপার স্থাপন।" },
        { title: "৪. নান্দনিক প্যাটার্নে গাছ সংযোজন", text: "রং ও পাতার টেক্সচার মিলিয়ে প্যাটার্নভিত্তিক গাছ স্থাপন।" },
      ],
      faqs: [
        { q: "দেয়ালে পানি জমে কি ড্যাম্প বা প্লাস্টার নষ্ট হবে?", a: "কখনোই নয়। ফ্রেম এবং দেয়ালের মাঝে ওয়াটারপ্রুফ ব্যারিয়ার ও আলাদা ড্রেনেজ চ্যানেল থাকে।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Luxury Villa & Zen Garden",
      slug: "luxury-zen-garden",
      category: "Garden Services",
      desc: "আমদানিকৃত দুর্লভ বনসাই, জাপানিজ হোয়াইট পেবল রক্স, ব্যাম্বু ওয়াটার ড্রপ ও সিরামিক প্ল্যান্টারের রাজকীয় বাগান।",
      icon: "⛩️",
      pricing: "৳১,৮০,০০০ থেকে শুরু",
      features: [
        "Aged Bonsai & Ficus Masterpieces",
        "Imported White Pebble & Granite Boulders",
        "Bamboo Shishi-Odoshi Water Spouts",
        "Custom Teakwood Meditation Deck & Pergola",
        "Architectural Brass Ground Uplighting",
      ],
      benefits: [
        "বাড়িতে শান্তিময় মেডিটেশন ও মানসিক প্রশান্তির স্বর্গ",
        "আন্তর্জাতিক মানের রাজকীয় এক্সক্লুসিভ সৌন্দর্য",
      ],
      process: [
        { title: "১. জেন কনসেপ্ট স্কেচ", text: "জাপানিজ ও মিনিমালিস্ট দর্শনের সমন্বয়ে নকশা প্রণয়ন।" },
        { title: "২. পাথর ও ওয়াটার ফিচার স্থাপন", text: "প্রাকৃতিক পাথর ও ব্যাম্বু ফাউন্টেন আর্কিটেকচার।" },
        { title: "৩. স্কাল্পটেড বনসাই রোপণ", text: "বিশেষভাবে প্রশিক্ষিত মাস্টার মালী দ্বারা বৃক্ষ স্থাপন।" },
      ],
      faqs: [
        { q: "বনসাই গাছগুলোর রক্ষণাবেক্ষণ কি কঠিন?", a: "আমাদের ট্রি ডক্টর টিম নিয়মিত পরিচর্যা ও ট্রেনিং নির্দেশিকা সরবরাহ করে থাকে।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Indoor & Balcony Mini Garden",
      slug: "balcony-indoor-garden",
      category: "Garden Services",
      desc: "ছোট অ্যাপার্টমেন্টের ব্যালকনি ও ড্রয়িং রুমের জন্য পরিপাটি সেল্ফ-ওয়াটারিং হ্যাংগিং ও ফ্লোর প্ল্যান্ট গার্ডেন।",
      icon: "🪴",
      pricing: "৳১৫,০০০ থেকে শুরু",
      features: [
        "Space-saving Vertical Railing Planters",
        "Air-purifying Snake Plants, Monsteras & Peace Lilies",
        "Anti-spill Drainage Trays & Ceramic Pots",
        "LED Grow Lights for Low-light Corners",
      ],
      benefits: [
        "কম জায়গায় আধুনিক ফ্ল্যাটে সবুজের ছোঁয়া",
        "পরিবারের জন্য ফ্রেশ অক্সিজেনের নিয়মিত উৎস",
      ],
      process: [
        { title: "১. আলো ও বাতাসের মাত্রা পরীক্ষা", text: "ব্যালকনির রোদ ও আলো অনুযায়ী উপযুক্ত গাছ বাছাই।" },
        { title: "২. প্ল্যান্টার্স ইনস্টলেশন", text: "রেলিং ও কর্নারে নান্দনিক টব ও গাছ সাজানো।" },
      ],
      faqs: [
        { q: "আমার ব্যালকনিতে খুব কম রোদ আসে, সেখানে কি বাগান সম্ভব?", a: "অবশ্যই! ছায়া ও কম আলোতে চমৎকারভাবে বেড়ে ওঠে এমন ৫০+ ইনডোর গাছের বৈচিত্র্য রয়েছে আমাদের।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    },

    // ----------------------------------------------------
    // Category 3: Garden Maintenance
    // ----------------------------------------------------
    {
      label: "Scheduled Garden Maintenance",
      slug: "garden-maintenance",
      category: "Maintenance",
      desc: "সাপ্তাহিক বা মাসিক নিয়মিত পরিচর্যা, ঘাস কাটিং, আগাছা দমন, গাছের কাটাই-ছাঁটাই এবং জৈব সার প্রয়োগ সেবা।",
      icon: "✂️",
      pricing: "৳৪,০০০ / মাসিক থেকে শুরু",
      features: [
        "Certified Trained Professional Mali / Gardeners",
        "Scheduled Weekly or Bi-weekly On-site Visits",
        "Complimentary Organic Bio-Fertilizer Feeding",
        "Hedge Trimming, Lawn Mowing & Pruning",
        "Quarterly Plant Pathology & Health Checkup",
      ],
      benefits: [
        "আপনার মূল্যবান গাছের শতভাগ সজীবতা ও স্বাস্থ্য সুরক্ষা",
        "আপনাকে নিজের সময় ব্যয় করতে হয় না — পুরো দায়িত্ব আমাদের দক্ষ টিমের",
      ],
      process: [
        { title: "১. প্রাথমিক গার্ডেন অডিট", text: "আপনার বাগানের বর্তমান অবস্থা ও গাছের সংখ্যা যাচাই।" },
        { title: "২. ডেডিকেটেড শিডিউল বরাদ্দ", text: "নির্দিষ্ট দিন ও সময় অনুযায়ী মালীর রুটিন ভিজিট।" },
        { title: "৩. রিপোর্ট ও ডিজিটাল সার্ভিস লগ", text: "প্রতিটি ভিজিটের পর কাজের বিবরণী ও পরামর্শ প্রদান।" },
      ],
      faqs: [
        { q: "মালী কি নিজস্ব যন্ত্রপাতি সাথে নিয়ে আসবেন?", a: "হ্যাঁ, লনমোয়ার, সিকেচার, স্প্রেয়ার ও অন্যান্য সকল প্রফেশনাল যন্ত্রপাতি আমাদের টিম সাথে নিয়ে আসে।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "One-Time Deep Garden Overhaul",
      slug: "one-time-maintenance",
      category: "Maintenance",
      desc: "পরিত্যক্ত বা দীর্ঘদিন অযত্নে থাকা বাগানের আগাছা পরিষ্কার, নতুন মাটি ও সার টপ-ড্রেসিং ও কাটাই-ছাঁটাই।",
      icon: "🧹",
      pricing: "৳৩,৫০০ থেকে শুরু",
      features: [
        "Overgrowth Clearance & Weeding",
        "Tree Canopy Surgical Pruning",
        "Topsoil Rejuvenation with Worm Compost",
        "Immediate Pest Spraying & Sanitization",
      ],
      benefits: [
        "এক দিনেই আপনার পুরনো বাগানকে প্রাণবন্ত ও পরিচ্ছন্ন রূপ দান",
        "মৃত ও রোগাক্রান্ত ডালপালা অপসারণ",
      ],
      process: [
        { title: "১. ফুল-টিম ডেপ্লয়মেন্ট", text: "অভিজ্ঞ ২-৩ জনের দল নিয়ে পূর্ণাঙ্গ সাফাই অভিযান।" },
        { title: "২. সয়েল রিফ্রেশিং ও নার্সিং", text: "শিকড়ে পুষ্টি প্রদান ও নতুন মাটি যোগ।" },
      ],
      faqs: [
        { q: "একদিনের কাজে কি বড় বাগান সম্পূর্ণ করা সম্ভব?", a: "বাগানের আয়তন অনুযায়ী আমরা অতিরিক্ত কর্মী নিয়োগ করে দ্রুততম সময়ে শেষ করি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1200&auto=format&fit=crop",
    },

    // ----------------------------------------------------
    // Category 4: Plant Health & Tree Doctor
    // ----------------------------------------------------
    {
      label: "Tree Doctor & Clinical Plant Pathology",
      slug: "tree-doctor",
      category: "Plant Health",
      desc: "গাছের পাতা পোড়া, কান্ড পচা, উইপোকা বা ছত্রাক সংক্রমণ নির্ণয় ও বিশেষজ্ঞ এগ্রোনমিস্টের অন-সাইট চিকিৎসা সেবা।",
      icon: "🩺",
      pricing: "৳১,৫০০ / ভিজিট",
      features: [
        "Senior Plant Pathologist / Agronomist Direct Visit",
        "Microscopic Pest & Fungal Diagnosis",
        "Soil pH, EC & Chemical Salinity Lab Testing",
        "Organic Eco-friendly Fungicide & Micronutrient Spray",
        "Digital Plant Health Card & Treatment Prescription",
      ],
      benefits: [
        "মুমূর্ষু ও মূল্যবান শখের গাছ বাঁচানোর বৈজ্ঞানিক নিশ্চয়তা",
        "অপ্রয়োজনীয় কেমিক্যাল ব্যবহারের বদলে নিরাপদ অর্গানিক বালাই দমন",
      ],
      process: [
        { title: "১. ডিজিটাল ট্রায়াজ ও বুকিং", text: "আক্রান্ত গাছের ছবি আপলোড করে চিকিৎসকের অ্যাপয়েন্টমেন্ট গ্রহণ।" },
        { title: "২. অন-সাইট ল্যাব ডায়াগনস্টিক", text: "গাছের পাতা ও মাটির নমুনা সংগ্রহ ও তাত্ক্ষণিক ডায়াগনসিস।" },
        { title: "৩. ট্রিটমেন্ট অ্যাপ্লিকেশন", text: "ছত্রাকনাশক স্প্রে, স্টেম ইনজেকশন বা ডাল ছাঁটাই।" },
        { title: "৪. ফলো-আপ ও ডিজিটাল হেলথ রেকর্ড", text: "১৪ দিন পর গাছের পুনরুদ্ধারের অবস্থা পর্যালোচনা।" },
      ],
      faqs: [
        { q: "জরুরি অবস্থায় কি তাৎক্ষণিক ট্রি ডক্টর পাওয়া যায়?", a: "হ্যাঁ! আমাদের 'Emergency Tree Doctor' সার্ভিসের মাধ্যমে ২৪ ঘণ্টার মধ্যে চিকিৎসক পৌঁছানোর ব্যবস্থা রয়েছে।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Soil Testing & Nutrition Balancing",
      slug: "soil-testing-treatment",
      category: "Plant Health",
      desc: "মাটির পুষ্টি উপাদান (N-P-K), জৈব পদার্থ ও পিএইচ পরীক্ষা করে গাছের বৃদ্ধি বাড়াতে উপযোগী মাটি তৈরি।",
      icon: "🔬",
      pricing: "৳২,০০০ / স্যাম্পল",
      features: [
        "Digital pH, Moisture & Sunlight Sensor Measurement",
        "Nitrogen, Phosphorus, Potassium (NPK) Assessment",
        "Drainage Capacity & Root Rot Risk Analysis",
        "Custom Micronutrient Remediation Formula",
      ],
      benefits: [
        "গাছে পর্যাপ্ত ফুল ও ফল না আসার মূল কারণ চিহ্নিতকরণ",
        "অতিরিক্ত সার ব্যবহারের অপচয় ও গাছের ক্ষতি রোধ",
      ],
      process: [
        { title: "১. নমুনা সংগ্রহ", text: "টব ও মাটির স্তর থেকে ৩টি পয়েন্টের স্যাম্পল গ্রহণ।" },
        { title: "২. পুষ্টি রিপোর্ট তৈরি", text: "ল্যাব টেস্ট সম্পন্ন করে বিস্তারিত পুষ্টি রিপোর্ট প্রস্তুত।" },
      ],
      faqs: [
        { q: "মাটি টেস্টের রিপোর্ট পেতে কতদিন লাগে?", a: "সাধারণত ৪৮ ঘণ্টার মধ্যে ডিজিটাল রিপোর্ট প্রদান করা হয়।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
    },

    // ----------------------------------------------------
    // Category 5: Irrigation & Drainage
    // ----------------------------------------------------
    {
      label: "Smart Automated Drip Irrigation",
      slug: "smart-irrigation",
      category: "Irrigation",
      desc: "ওয়াইফাই নিয়ন্ত্রিত স্বয়ংক্রিয় ড্রিপ ইরিগেশন — প্রতিটি গাছের গোড়ায় প্রয়োজন অনুযায়ী পানি সরবরাহ ও ৭০% পানি সাশ্রয়।",
      icon: "💧",
      pricing: "৳২৫,০০০ থেকে শুরু",
      features: [
        "Smart Wi-Fi App & Digital Battery Timer Controllers",
        "Pressure-Compensating Micro Drip Emitters",
        "Rain Sensor Automatic Weather Cut-off",
        "Zero Water Wastage & 70% Municipal Water Savings",
        "Concealed UV-resistant Polyethylene Pipelines",
      ],
      benefits: [
        "আপনি দেশ বা বিদেশে যেখানেই থাকুন — স্বয়ংক্রিয়ভাবে বাগানে পানি পৌঁছাবে",
        "গাছের গোড়ায় সুষম আর্দ্রতা বজায় থাকে, শিকড় পচা রোধ হয়",
      ],
      process: [
        { title: "১. হাইড্রোলিক ফ্লো গণনা", text: "পানির প্রেশার ও গাছের সংখ্যার ভিত্তিতে পাইপ সাইজিং।" },
        { title: "২. পাইপলাইন ও ড্রিপার ফিটিং", text: "প্রতিটি টব ও বেডে নির্ভুল ড্রিপ লাইন স্থাপন।" },
        { title: "৩. স্মার্ট টাইমার ও অ্যাপ কনফিগার", text: "গ্রাহকের মোবাইলে অ্যাপ্লিকেশন ইনস্টল ও পানির সময়সূচি সেট।" },
      ],
      faqs: [
        { q: "বিদ্যুৎ চলে গেলে কি টাইমার কাজ করবে?", a: "আমাদের ডিজিটাল কন্ট্রোলারে বিল্ট-ইন ব্যাকআপ ব্যাটারি থাকে যা বিদ্যুৎ না থাকলেও শিডিউল বজায় রাখে।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Lawn Pop-Up Sprinkler Systems",
      slug: "lawn-sprinklers",
      category: "Irrigation",
      desc: "ঘাসের মাঠে ৩৬০ ডিগ্রি কোণ জুড়ে সূক্ষ্ম বৃষ্টির মতো পানি ছিটানোর জন্য আধুনিক পপ-আপ স্প্রিংকলার নেটওয়ার্ক।",
      icon: "🌧️",
      pricing: "৳২০,০০০ থেকে শুরু",
      features: [
        "Retractable Pop-up Sprinkler Heads (Lawn-mower Safe)",
        "360° & Adjustable Arc Spray Patterns",
        "High-efficiency Rotating Multi-stream Nozzles",
        "Underground Drainage Check Valves",
      ],
      benefits: [
        "পুরো লন সমানভাবে সতেজ ও সবুজ থাকে",
        "ঘাস কাটার সময় কোনো পাইপ বা নোজল বাধা সৃষ্টি করে না",
      ],
      process: [
        { title: "১. কভারেজ জোন ম্যাপিং", text: "স্প্রিংকলার স্প্রে কোণ ও দূরত্বের নিখুঁত হিসাব।" },
        { title: "২. আন্ডারগ্রাউন্ড ট্রেঞ্চিং ও ইনস্টল", text: "মাটির নিচে পাইপলাইন ও হেড বসানো।" },
      ],
      faqs: [
        { q: "পপ-আপ হেডগুলো কি ঘাসের নিচে লুকানো থাকে?", a: "হ্যাঁ, পানি চালু হলে স্বয়ংক্রিয়ভাবে উপরে ওঠে এবং বন্ধ হলে আবার মাটির সাথে সমান হয়ে মিশে যায়।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=1200&auto=format&fit=crop",
    },

    // ----------------------------------------------------
    // Category 6: Additional Landscape Features
    // ----------------------------------------------------
    {
      label: "Garden Lighting & Warm Atmospheric LEDs",
      slug: "garden-lighting-fountain",
      category: "Additional Services",
      desc: "IP68 ওয়াটারপ্রুফ আর্কিটেকচারাল ওয়ার্ম লাইট, স্পটলাইট, পাথওয়ে বোলার্ড এবং নাইট গার্ডেন ইলুমিনেশন।",
      icon: "💡",
      pricing: "৳৩৫,০০০ থেকে শুরু",
      features: [
        "IP68 Fully Submersible Waterproof Brass & Aluminum Fixtures",
        "Warm 3000K Soft Glow Architectural Tree Uplighting",
        "Automated Dusk-to-Dawn Sunset Photocell Sensors",
        "Safe Low-Voltage (12V/24V) Transformer Protection",
        "Solar Powered Eco-Friendly Pathway Lights",
      ],
      benefits: [
        "রাতের বেলা বাগানে নিয়ে আসে চোখ জুড়ানো মোহনীয় আবহ",
        "বাড়ির নিরাপত্তা বৃদ্ধি ও রাতে বাগান ব্যবহারের স্বাচ্ছন্দ্য",
      ],
      process: [
        { title: "১. লাইটিং ইফেক্ট প্ল্যান", text: "কোন গাছে আপলাইট ও কোন পাথওয়েতে বোলার্ড বসবে তার ড্রয়িং।" },
        { title: "২. সেফ ক্যাবলিং ও ট্রান্সফরমার", text: "মাটির নিচে সুরক্ষিত আর্মার্ড ক্যাবল স্থাপন।" },
      ],
      faqs: [
        { q: "বৃষ্টির দিনে লাইটিংয়ে শর্ট সার্কিট বা শক লাগার ঝুঁকি আছে কি?", a: "একদমই না। আমরা ১২ ভোল্টের লো-ভোল্টেজ ও ওয়াটারপ্রুফ সার্কিট ব্যবহার করি যা মানুষ ও পোষা প্রাণীর জন্য ১০০% নিরাপদ।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Natural Stone Fountains & Waterfalls",
      slug: "fountain-waterfall",
      category: "Additional Services",
      desc: "মার্বেল ও গ্রানাইটের দৃষ্টিনন্দন ঝর্ণা, ওয়াটারফল এবং মৃদু পানির কলতান সম্বলিত ল্যান্ডস্কেপ ওয়াটার ফিচার।",
      icon: "⛲",
      pricing: "৳৪৫,০০০ থেকে শুরু",
      features: [
        "Submersible Silent Water Circulating Pumps",
        "Underwater Multi-color LED Glow Lighting",
        "Natural Slate Stone Cascading Water Walls",
        "Bio-filter Chamber for Algae-free Crystal Clear Water",
      ],
      benefits: [
        "পানির মিষ্টি কলতান শহুরে কোলাহল দূর করে গভীর প্রশান্তি আনে",
        "পাখি ও প্রজাপতির প্রাকৃতিক অভয়ারণ্য গড়ে তোলে",
      ],
      process: [
        { title: "১. স্ট্রাকচারাল বেসিন তৈরি", text: "ওয়াটারপ্রুফ আরসিসি বা প্রি-ফেব্রিকেটেড বেসিন স্থাপন।" },
        { title: "২. পাম্প ও ক্যাস্কেড ফিটিং", text: "পানির নিখুঁত প্রবাহ ও ফিল্টারেশন সিস্টেম ইনস্টলেশন।" },
      ],
      faqs: [
        { q: "ফাউন্টেনের পানিতে কি মশা ডিম পাড়বে?", a: "চলমান পানিতে মশা ডিম পাড়ে না, এছাড়াও আমরা ওয়াটার ট্রিটমেন্ট প্যালেট ব্যবহার করি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop",
    },

    // ----------------------------------------------------
    // Category 7: Gardening Materials & Supplies
    // ----------------------------------------------------
    {
      label: "Premium Soil Media & Organic Fertilizers",
      slug: "soil-media-fertilizers",
      category: "Gardening Materials",
      desc: "জীবাণুমুক্ত জৈব মাটি, ভার্মিকম্পোস্ট, কোকোপিট ব্রিক, হাড়ের গুঁড়া ও প্রিমিয়াম মাইক্রোনিউট্রিয়েন্ট সরবরাহ।",
      icon: "🌱",
      pricing: "৳৫০০ থেকে শুরু",
      features: [
        "100% Pathogen-free Steam Sterilized Potting Soil",
        "High Organic Vermicompost with Active Microorganisms",
        "Low EC Washed Cocopeat Block for Rooftop Weight Saving",
        "Slow-release Plant Food Tablets for Continuous Nutrition",
      ],
      benefits: [
        "গাছের শিকড় দ্রুত ছড়িয়ে পড়ে এবং নতুন কুঁড়ি আসে দ্বিগুণ গতিতে",
        "ছাদের জন্য অতিরিক্ত ওজন কমানোর আদর্শ মাধ্যম",
      ],
      process: [
        { title: "১. কোয়ালিটি ল্যাব টেস্টিং", text: "প্রতিটি ব্যাচ জীবাণুমুক্ত ও সঠিক পিএইচ সমন্বিত কিনা যাচাই।" },
        { title: "২. ডোরস্টেপ ডেলিভারি", text: "সরাসরি আপনার বাগানে বা বাসায় ডেলিভারি সম্পন্ন।" },
      ],
      faqs: [
        { q: "ছাদবাগানের জন্য কোন মাটি সবচেয়ে ভালো?", a: "আমরা ৪০% কোকোপিট, ৩০% ভার্মিকম্পোস্ট, ২০% হালকা মাটি ও ১০% পার্লাইটের বিশেষ মিশ্রণ সুপারিশ করি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
    },
    {
      label: "Exotic Plants, Fruit Trees & Ceramic Planters",
      slug: "plants-pots-materials",
      category: "Gardening Materials",
      desc: "আমদানিকৃত থাই ভ্যারাইটির ফলজ গাছ, এডেল বাউন্ডিং বনসাই, আধুনিক সিরামিক ও ফাইবার টব এবং উন্নত টুলস।",
      icon: "🪴",
      pricing: "৳৮০০ থেকে শুরু",
      features: [
        "Grafted High-yield Dwarf Mango, Guava & Citrus Trees",
        "Imported Weatherproof Ceramic & Fiber Reinforced Pots",
        "Japanese Carbon Steel Pruning Shears & Tools",
        "Guaranteed 100% Varietal Authenticity",
      ],
      benefits: [
        "ছোট গাছেই প্রচুর মিষ্টি ফল ও দৃষ্টিনন্দন ফুলের নিশ্চয়তা",
        "দীর্ঘস্থায়ী ও আকর্ষণীয় নকশার টব যা আপনার রুচির পরিচয় বহন করে",
      ],
      process: [
        { title: "১. নার্সারি সিলেকশন", text: "আমাদের নিজস্ব গ্রিনহাউস থেকে স্বাস্থ্যবান চারা নির্বাচন।" },
        { title: "২. রিপটিং ও রোপণ সুবিধা", text: "আমাদের মালীদের দিয়ে সরাসরি আপনার টবে প্রতিস্থাপন।" },
      ],
      faqs: [
        { q: "টবে কি আম বা লেবু ভালো ফলন দেবে?", a: "হ্যাঁ, আমাদের কলমের জাতগুলো বিশেষভাবে টব ও ড্রামের উপযোগী করে তৈরি।" },
      ],
      bannerImage: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        label: s.label,
        category: s.category,
        desc: s.desc,
        icon: s.icon,
        pricing: s.pricing,
        features: s.features,
        benefits: s.benefits,
        process: s.process,
        faqs: s.faqs,
        bannerImage: s.bannerImage,
      },
      create: {
        slug: s.slug,
        label: s.label,
        category: s.category,
        desc: s.desc,
        icon: s.icon,
        pricing: s.pricing,
        features: s.features,
        benefits: s.benefits,
        process: s.process,
        faqs: s.faqs,
        bannerImage: s.bannerImage,
      },
    });
  }
  console.log(`✅ Demo Services seeded (${servicesData.length} items).`);

  // 2. Comprehensive Projects for all Filter Categories
  const projectsData = [
    {
      name: "Dhanmondi Sky Haven Luxury Rooftop",
      slug: "dhanmondi-sky-haven",
      clientName: "Tanvir Rahman",
      clientPhone: "01711223344",
      category: "Rooftop",
      location: "Road 9/A, Dhanmondi, Dhaka",
      progress: 100,
      status: "COMPLETED",
      budget: 350000,
      totalExpense: 260000,
      description: "২,২০০ বর্গফুটের ছাদবাগান যাতে রয়েছে ৩-স্তর ওয়াটারপ্রুফ ড্রেনেজ, জাপানিজ গ্রাস লন, মেহগনি কাঠের পারগোলা ও অটো ড্রিপ সেচ।",
      beforeImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2026-08-15"),
    },
    {
      name: "Gulshan Corporate Eco-Lawn & Vertical Wall",
      slug: "gulshan-corporate-eco-lawn",
      clientName: "Green Horizon Developments",
      clientPhone: "01819223344",
      category: "Commercial",
      location: "Gulshan Avenue, Dhaka",
      progress: 100,
      status: "COMPLETED",
      budget: 550000,
      totalExpense: 380000,
      description: "করপোরেট হেডকোয়ার্টারের ৩ তলা বিশিষ্ট জীবন্ত দেয়ালবাগান এবং বারমুডা টার্ফ গ্রিনারি। স্বয়ংক্রিয় ফার্টিগেশন এবং এয়ার পিউরিফাইং গাছপালায় সমৃদ্ধ।",
      beforeImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2026-07-20"),
    },
    {
      name: "Banani Royal Residence Landscape",
      slug: "banani-royal-residence",
      clientName: "Farhan Hossain",
      clientPhone: "01722334455",
      category: "Residential",
      location: "Road 11, Banani, Dhaka",
      progress: 100,
      status: "COMPLETED",
      budget: 420000,
      totalExpense: 310000,
      description: "আবাসিক ভিলার এন্ট্রান্স ও উঠান ঘিরে প্রিমিয়াম লন কার্পেট, প্রাকৃতিক পাথরের হাঁটার পথ ও ওয়াটারপ্রুফ গার্ডেন স্পাইক লাইটিং।",
      beforeImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=800&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2026-09-02"),
    },
    {
      name: "Sreemangal Tea Valley Resort Oasis",
      slug: "sreemangal-resort-oasis",
      clientName: "Grand Valley Hospitality",
      clientPhone: "01733445566",
      category: "Resort",
      location: "Sreemangal, Sylhet",
      progress: 100,
      status: "COMPLETED",
      budget: 850000,
      totalExpense: 620000,
      description: "প্রাকৃতিক পাহাড় ও লেকসংলগ্ন রিসোর্টের প্রাকৃতিক ল্যান্ডস্কেপ ও ট্রপিক্যাল ফ্লোরাল জোন এবং ফায়ারপিট লাউঞ্জ।",
      beforeImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2026-06-18"),
    },
    {
      name: "Uttara Zen Terrace Japanese Garden",
      slug: "uttara-zen-japanese-garden",
      clientName: "Barrister Rafiqul Alam",
      clientPhone: "01744556677",
      category: "Luxury",
      location: "Sector 4, Uttara, Dhaka",
      progress: 75,
      status: "RUNNING",
      budget: 280000,
      totalExpense: 190000,
      description: "জাপানিজ জেন গার্ডেন শৈলীতে মিনি রোক্স, সাদা নুড়িপাথর, বনসাই কালেকশন ও ব্যাম্বু ওয়াটার ড্রপ ফাউন্টেন।",
      beforeImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=800&auto=format&fit=crop",
      ],
      featured: true,
      deadline: new Date("2026-10-30"),
    },
    {
      name: "Bashundhara R/A Pergola & Fountain Plaza",
      slug: "bashundhara-fountain-plaza",
      clientName: "Architect Saiful Islam",
      clientPhone: "01755667788",
      category: "Fountain",
      location: "Block I, Bashundhara R/A, Dhaka",
      progress: 100,
      status: "COMPLETED",
      budget: 380000,
      totalExpense: 275000,
      description: "আন্ডারওয়াটার এলইডি লাইট সম্বলিত মার্বেল ফাউন্টেন এবং কাস্টমাইজড গার্ডেন লাইটিং পাথওয়ে।",
      beforeImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2026-05-10"),
    },
    {
      name: "Mapletree Urban Wilderness Park",
      slug: "mapletree-business-city",
      clientName: "Apex Commercial Holdings",
      clientPhone: "01711002233",
      category: "Commercial",
      location: "Alexandra Road, Singapore",
      progress: 100,
      status: "COMPLETED",
      budget: 1500000,
      totalExpense: 1200000,
      description: "An eco-friendly nature-inspired urban wilderness landscape integrating modern corporate towers with lush native flora.",
      beforeImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2025-06-15"),
    },
    {
      name: "The Standard Hua Hin Seaside Oasis",
      slug: "the-standard-hua-hin",
      clientName: "Royal Orchid International",
      clientPhone: "01711003344",
      category: "Resort",
      location: "Prachuap Khiri Khan, Thailand",
      progress: 100,
      status: "COMPLETED",
      budget: 2200000,
      totalExpense: 1750000,
      description: "A tranquil beachfront retreat woven around native trees, preserving coastal canopy and endemic green sanctuaries.",
      beforeImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop",
      ],
      featured: true,
      completionDate: new Date("2026-09-01"),
    },
    {
      name: "One City Centre Sunken Rain Gardens",
      slug: "one-city-centre-occ",
      clientName: "Metropolis Urban Estates",
      clientPhone: "01711004455",
      category: "Public Realm",
      location: "Ploenchit, Bangkok, Thailand",
      progress: 100,
      status: "COMPLETED",
      budget: 1800000,
      totalExpense: 1400000,
      description: "Visionary corporate hub enveloped in sunken rain gardens, permeable green paving, and climate-resilient pedestrian promenades.",
      beforeImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?w=1200&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1530731141654-59610f3b729f?w=1200&q=80",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80",
      ],
      featured: true,
      completionDate: new Date("2025-10-15"),
    },
  ];

  for (const p of projectsData) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        clientName: p.clientName,
        clientPhone: p.clientPhone,
        category: p.category,
        location: p.location,
        progress: p.progress,
        status: p.status,
        budget: p.budget,
        totalExpense: p.totalExpense,
        description: p.description,
        beforeImage: p.beforeImage,
        afterImage: p.afterImage,
        images: p.images,
        featured: p.featured,
        completionDate: p.completionDate || null,
        deadline: p.deadline || null,
      },
      create: {
        name: p.name,
        slug: p.slug,
        clientName: p.clientName,
        clientPhone: p.clientPhone,
        category: p.category,
        location: p.location,
        progress: p.progress,
        status: p.status,
        budget: p.budget,
        totalExpense: p.totalExpense,
        description: p.description,
        beforeImage: p.beforeImage,
        afterImage: p.afterImage,
        images: p.images,
        featured: p.featured,
        completionDate: p.completionDate || null,
        deadline: p.deadline || null,
      },
    });
  }
  console.log(`✅ Demo Projects seeded (${projectsData.length} items).`);

  // 3. Gallery Items matching all filters
  const galleryItems = [
    {
      title: "Dhanmondi Sky Garden Transformation",
      category: "Rooftop",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
      caption: "Concrete slab transformed into a lush tropical rooftop oasis.",
      featured: true,
    },
    {
      title: "Gulshan Vertical Living Wall",
      category: "Vertical Garden",
      imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
      caption: "200 sqft breathing wall on commercial building exterior.",
      featured: true,
    },
    {
      title: "Banani Royal Residence Lawn & Mood Lighting",
      category: "Residential",
      imageUrl: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop",
      caption: "Villa entrance courtyard with Bermuda carpet grass and walkway pavers.",
      featured: true,
    },
    {
      title: "Sreemangal Tea Resort Landscape",
      category: "Resort",
      imageUrl: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
      caption: "Eco-friendly resort landscape overlooking the misty hills.",
      featured: true,
    },
    {
      title: "Uttara Zen Terrace Japanese Garden",
      category: "Luxury",
      imageUrl: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=800&auto=format&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
      caption: "Minimalist Japanese Zen garden with ancient bonsai and white pebbles.",
      featured: true,
    },
    {
      title: "Bashundhara R/A Pergola & Fountain Plaza",
      category: "Fountain",
      imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
      caption: "Illuminated nighttime fountain with cascading jets and stone tiles.",
      featured: true,
    },
    {
      title: "Baridhara Diplomatic Enclave Flower Garden",
      category: "Flower Garden",
      imageUrl: "https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=800&auto=format&fit=crop",
      caption: "Seasonal multi-color perennial flower beds with automatic misting.",
      featured: true,
    },
    {
      title: "Gulshan Tech Hub Biophilic Indoor Atrium",
      category: "Indoor",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
      caption: "Indoor office biophilic atrium with giant Monsteras and Ficus trees.",
      featured: true,
    },
    {
      title: "Dhanmondi Lakeview Bermuda Turf Lawn",
      category: "Lawn",
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop",
      caption: "Seamless roll-sod Bermuda turf lawn with popup underground sprinkler grid.",
      featured: true,
    },
    {
      title: "Motijheel Corporate Headquarters Office Landscape",
      category: "Office",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
      caption: "Executive boardroom and reception planters with low-maintenance air purifiers.",
      featured: false,
    },
    {
      title: "Dhanmondi 27 Rooftop Alfresco Café & Bistro",
      category: "Restaurant/Café",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      caption: "Instagram-worthy open-air cafe greenery with fairy canopy lights.",
      featured: true,
    },
    {
      title: "Mirpur DOHS Compact Balcony Mini Garden",
      category: "Balcony",
      imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop",
      caption: "Space-saving vertical railing planters and decorative stone bedding.",
      featured: false,
    },
    {
      title: "Gulshan Residence Architectural Tree Uplighting",
      category: "Lighting",
      imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
      caption: "IP68 warm 3000K waterproof landscape uplights turning trees into night art.",
      featured: true,
    },
    {
      title: "Standard Home Garden Setup",
      category: "Standard",
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=800&auto=format&fit=crop",
      caption: "Clean, tidy and budget-friendly household garden with seasonal flora.",
      featured: false,
    },
  ];

  for (const item of galleryItems) {
    const existing = await prisma.galleryItem.findFirst({
      where: { title: item.title },
    });
    if (existing) {
      await prisma.galleryItem.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.galleryItem.create({
        data: item,
      });
    }
  }
  console.log(`✅ Demo Gallery items seeded (${galleryItems.length} items, safe upsert).`);

  console.log("🎉 AR Green Garden Demo Seeding Completed Successfully!");
};

seedDemoData()
  .catch((e) => {
    console.error("❌ Error during demo seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
