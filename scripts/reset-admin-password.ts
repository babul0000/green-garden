import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAdminPassword() {
  console.log("🔒 Starting Admin Password Reset Procedure...");

  // 1. Enforce RESET_ADMIN_PASSWORD from environment variable
  const newRawPassword = process.env.RESET_ADMIN_PASSWORD;
  if (!newRawPassword || newRawPassword.trim().length === 0) {
    console.error("❌ Fatal Error: RESET_ADMIN_PASSWORD environment variable is missing or empty.");
    console.error("👉 Please set RESET_ADMIN_PASSWORD before running this script.");
    console.error("   Example (PowerShell): $env:RESET_ADMIN_PASSWORD='YourNewStrongPassword'; npx tsx scripts/reset-admin-password.ts");
    console.error("   Example (Bash):       RESET_ADMIN_PASSWORD='YourNewStrongPassword' npx tsx scripts/reset-admin-password.ts");
    throw new Error("Missing required environment variable: RESET_ADMIN_PASSWORD");
  }

  // 2. Locate the Admin user
  const admin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!admin) {
    console.error("❌ Error: No user with role ADMIN was found in the database.");
    throw new Error("Target ADMIN user not found in database.");
  }

  // 3. Hash password with bcrypt salt rounds = 10
  const hashedPassword = await bcrypt.hash(newRawPassword, 10);

  // 4. Update password in the database
  await prisma.user.update({
    where: { id: admin.id },
    data: {
      password: hashedPassword,
    },
  });

  // 5. Safe success reporting (Zero logging of password string or hash)
  console.log(`✅ Admin password reset completed successfully.`);
  console.log(`   User: ${admin.name} <${admin.email}>`);
  console.log(`   User ID: ${admin.id}`);
  console.log(`   Role: ${admin.role}`);
}

resetAdminPassword()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Reset script failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
