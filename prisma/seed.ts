import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting AR Green Garden PostgreSQL Seeding...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const employeePassword = await bcrypt.hash("doctor123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  // 1. Create or upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@argreengarden.com" },
    update: {},
    create: {
      name: "AR Green Garden Admin",
      email: "admin@argreengarden.com",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "01620692449",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // 2. Create Employee User & Employee Profile
  const employeeUser = await prisma.user.upsert({
    where: { email: "doctor@argreengarden.com" },
    update: {},
    create: {
      name: "Md. Rahim",
      email: "doctor@argreengarden.com",
      password: employeePassword,
      role: Role.EMPLOYEE,
      phone: "01712345678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
  });

  const employee = await prisma.employee.upsert({
    where: { employeeId: "EMP-101" },
    update: {},
    create: {
      employeeId: "EMP-101",
      userId: employeeUser.id,
      name: "Md. Rahim",
      designation: "Senior Tree Doctor",
      department: "Tree Doctor & Plant Health",
      responsibility: "Plant diagnosis, disease treatment, tree surgery & pest management",
      joiningDate: new Date("2021-03-01"),
      experienceYears: 4,
      experienceMonths: 6,
      education: "B.Sc in Agriculture & Horticulture, BAU",
      training: "Advanced Arboriculture & Tree Surgery Certified",
      skills: ["Tree Diagnosis", "Plant Health", "Pest Management", "Soil Testing", "Fungicide Application"],
      salary: 45000,
      personalPhone: "01712345678",
      personalAddress: "Dhanmondi, Dhaka",
      status: "ACTIVE",
      isPublicTeam: true,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
  });
  console.log("✅ Employee created:", employee.name);

  // 3. Create Client User
  const clientUser = await prisma.user.upsert({
    where: { email: "client@gmail.com" },
    update: {},
    create: {
      name: "Tanvir Ahmed",
      email: "client@gmail.com",
      password: clientPassword,
      role: Role.CLIENT,
      phone: "01811223344",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
  });
  console.log("✅ Client created:", clientUser.email);

  // 4. Seed Services
  const services = [
    {
      slug: "residential-landscape",
      label: "Residential Landscape Design",
      category: "Landscape Design & Implementation",
      desc: "Comprehensive villa and residential garden planning with luxury aesthetics and sustainable plant species.",
      icon: "🏡",
      pricing: "Starting from ৳50,000",
      features: ["Custom 3D Layout Plan", "Hardscape & Softscape", "Lawn Installation", "Plant Selection"],
      benefits: ["High property value", "Eco-friendly environment", "Low maintenance design"],
    },
    {
      slug: "rooftop-gardening",
      label: "Rooftop Garden & Terrace",
      category: "Garden Services",
      desc: "Turn your urban rooftop into a lush, tranquil oasis with specialized waterproof containers and automated drip irrigation.",
      icon: "🌴",
      pricing: "Starting from ৳40,000",
      features: ["Waterproof Membrane Check", "Lightweight Soil Media", "Pergola & Seating", "Wind Barrier Plants"],
      benefits: ["Thermal cooling for house", "Fresh organic vegetables", "Stunning cityscape view"],
    },
    {
      slug: "tree-doctor-service",
      label: "Tree Doctor & Plant Health",
      category: "Plant Health",
      desc: "Specialized clinical diagnosis and treatments for sick, infested, or stunted trees and landscape plants.",
      icon: "🩺",
      pricing: "Visit fee ৳1,500 + Medication",
      features: ["On-site Pathogen Diagnosis", "Soil Acidity & Nutrients Test", "Targeted Fungicide/Pesticide", "Follow-up Report"],
      benefits: ["Saves dying expensive trees", "Prevents insect spread", "Long-term vigor"],
    },
    {
      slug: "smart-irrigation",
      label: "Smart & Automatic Irrigation",
      category: "Irrigation",
      desc: "Water-conserving automated drip and sprinkler systems controllable via digital timers and smartphone.",
      icon: "💧",
      pricing: "Starting from ৳25,000",
      features: ["Timer Automated Controller", "Micro Drip Nozzles", "Rotary Sprinklers", "Rain Sensor Integration"],
      benefits: ["Saves 70% water", "Zero manual effort", "Consistent root moisture"],
    },
    {
      slug: "regular-garden-maintenance",
      label: "Garden Maintenance Package",
      category: "Maintenance",
      desc: "Scheduled weekly or monthly gardener and supervisor visits for lawn mowing, weeding, pruning, and fertilization.",
      icon: "🔧",
      pricing: "Starting from ৳5,000 / month",
      features: ["Weekly/Monthly visits", "Lawn Trimming & Edging", "Pest Prevention Sprays", "Organic Compost Feeding"],
      benefits: ["Garden always looks prime", "Trained reliable staff", "Guaranteed plant longevity"],
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log("✅ Services seeded");

  // 5. Seed Inventory Items
  const inventory = [
    { name: "Ficus Benjamina (Large)", category: "Plants", stockQuantity: 45, minThreshold: 10, unit: "pcs", unitCost: 1200 },
    { name: "Areca Palm (6ft)", category: "Plants", stockQuantity: 32, minThreshold: 8, unit: "pcs", unitCost: 850 },
    { name: "Japanese Grass Sod (Sqft)", category: "Plants", stockQuantity: 2500, minThreshold: 500, unit: "sqft", unitCost: 28 },
    { name: "Organic Vermicompost", category: "Soil/Media", stockQuantity: 120, minThreshold: 20, unit: "bags (25kg)", unitCost: 450 },
    { name: "Cocopeat Block (5kg)", category: "Soil/Media", stockQuantity: 80, minThreshold: 15, unit: "blocks", unitCost: 220 },
    { name: "Ceramic Glazed Planter 18-inch", category: "Pots/Tubs", stockQuantity: 24, minThreshold: 5, unit: "pcs", unitCost: 1600 },
    { name: "Micro Drip Emitter 4L/H", category: "Irrigation", stockQuantity: 450, minThreshold: 100, unit: "pcs", unitCost: 25 },
    { name: "Solar Garden Spike Light (Warm)", category: "Lighting", stockQuantity: 65, minThreshold: 15, unit: "pcs", unitCost: 650 },
  ];

  for (const item of inventory) {
    const existing = await prisma.inventoryItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.inventoryItem.create({ data: item });
    }
  }
  console.log("✅ Inventory seeded");

  // 6. Seed Projects
  const sampleProject = await prisma.project.upsert({
    where: { slug: "dhanmondi-luxury-rooftop-retreat" },
    update: {},
    create: {
      slug: "dhanmondi-luxury-rooftop-retreat",
      name: "Dhanmondi Luxury Rooftop Retreat",
      clientId: clientUser.id,
      clientName: "Tanvir Ahmed",
      clientPhone: "01811223344",
      category: "Rooftop Garden",
      location: "Road 9/A, Dhanmondi, Dhaka",
      description: "A 2,200 sqft penthouse rooftop featuring Japanese grass lawn, illuminated pergola, and automated drip irrigation.",
      progress: 75,
      status: "RUNNING",
      budget: 350000,
      totalExpense: 240000,
      startDate: new Date("2026-08-10"),
      deadline: new Date("2026-10-01"),
      featured: true,
      beforeImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      ],
    },
  });
  console.log("✅ Sample Project seeded:", sampleProject.name);

  // 7. Seed Site Setting
  await prisma.setting.upsert({
    where: { key: "site_config" },
    update: {},
    create: {
      key: "site_config",
      value: {
        title: "A R Green Garden",
        headline: "প্রকৃতির ছোঁয়ায় বদলে দিন আপনার চারপাশ",
        subheadline: "আপনার স্বপ্নের সবুজায়ন, আমাদের দক্ষতায়",
        phone: "01620692449",
        email: "info@argreengarden.com",
        address: "42/A, Road 9/A, Dhanmondi, Dhaka",
        whatsapp: "+8801620692449",
        fbPage: "https://facebook.com/argreengarden",
        instagram: "https://instagram.com/argreengarden",
      },
    },
  });
  console.log("✅ Site configuration settings seeded");

  console.log("🎉 Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
