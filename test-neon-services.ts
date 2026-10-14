import dotenv from "dotenv";
dotenv.config();

import { prisma } from "./src/lib/prisma";
import { uploadToNeonStorage, getNeonStorageClient, NEON_STORAGE_BUCKET } from "./src/lib/neonStorage";

async function main() {
  console.log("==========================================");
  console.log("🧪 TESTING NEON SERVICES END-TO-END");
  console.log("==========================================");

  // 1. Test Neon Postgres Database
  console.log("\n[1/2] Testing Neon Lakebase Postgres...");
  const userCount = await prisma.user.count();
  const serviceCount = await prisma.service.count();
  const projectCount = await prisma.project.count();

  console.log(`✅ Postgres Connection: SUCCESSFUL!`);
  console.log(`   - Users in DB: ${userCount}`);
  console.log(`   - Services in DB: ${serviceCount}`);
  console.log(`   - Projects in DB: ${projectCount}`);

  // 2. Test Neon Object Storage
  console.log("\n[2/2] Testing Neon Object Storage...");
  const s3 = getNeonStorageClient();
  if (!s3) {
    throw new Error("Neon Object Storage client failed to initialize from env vars!");
  }

  const testContent = Buffer.from("Hello Neon Object Storage from AR Green Garden! " + new Date().toISOString());
  const testKey = `test/test-file-${Date.now()}.txt`;
  
  console.log(`   Uploading test file to bucket '${NEON_STORAGE_BUCKET}'...`);
  const uploadResult = await uploadToNeonStorage(testContent, testKey, "text/plain");

  console.log(`✅ Neon Object Storage: SUCCESSFUL!`);
  console.log(`   - Object Key: ${uploadResult.key}`);
  console.log(`   - Presigned URL generated: ${uploadResult.url.substring(0, 80)}...`);

  console.log("\n==========================================");
  console.log("🎉 ALL NEON SERVICES WORKING 100% END-TO-END!");
  console.log("==========================================");
}

main()
  .catch((e) => {
    console.error("❌ Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
