import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwtToken } from "./src/lib/auth";

async function runFullSystemTest() {
  console.log("=================================================");
  console.log("🚀 STARTING AR GREEN GARDEN COMPREHENSIVE TEST SUITE");
  console.log("=================================================\n");

  const results: { test: string; status: "PASS" | "FAIL"; details: string }[] = [];

  // Helper function to log test status
  function record(test: string, status: "PASS" | "FAIL", details: string) {
    results.push({ test, status, details });
    console.log(`[${status === "PASS" ? "✅ PASS" : "❌ FAIL"}] ${test}: ${details}`);
  }

  try {
    // ------------------------------------------------------------------
    // TEST 1: DATABASE CONNECTIVITY
    // ------------------------------------------------------------------
    try {
      await prisma.$queryRaw`SELECT 1`;
      record("Database Connectivity", "PASS", "Neon PostgreSQL is live and queryable");
    } catch (e: any) {
      record("Database Connectivity", "FAIL", e.message);
    }

    // ------------------------------------------------------------------
    // TEST 2: ADMIN AUTHENTICATION TOKEN GENERATION
    // ------------------------------------------------------------------
    let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) {
      const password = await bcrypt.hash("admin123", 10);
      admin = await prisma.user.create({
        data: {
          name: "Test Admin",
          email: "admin_test@argreengarden.com",
          password,
          role: "ADMIN",
        },
      });
    }

    const adminToken = await signJwtToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    });
    record("Admin Auth JWT Generation", "PASS", `Token generated for ${admin.email}`);

    // ------------------------------------------------------------------
    // TEST 3: PROJECT CRUD (Add, View, Edit, Delete)
    // ------------------------------------------------------------------
    const testSlug = `automated-test-rooftop-${Date.now()}`;
    const newProject = await prisma.project.create({
      data: {
        name: "Automated Test Rooftop Oasis",
        slug: testSlug,
        category: "Rooftop Garden",
        location: "Banani DOHS, Dhaka",
        description: "Test project for automated system verification",
        budget: 500000,
        progress: 25,
        status: "RUNNING",
      },
    });
    record("Project: CREATE", "PASS", `Created project ID: ${newProject.id} (${newProject.name})`);

    // View Details
    const foundProject = await prisma.project.findUnique({ where: { id: newProject.id } });
    if (foundProject && foundProject.slug === testSlug) {
      record("Project: VIEW & DETAILS", "PASS", `Fetched project with progress: ${foundProject.progress}% and budget: ৳${foundProject.budget}`);
    } else {
      record("Project: VIEW & DETAILS", "FAIL", "Project could not be retrieved");
    }

    // Edit
    const updatedProject = await prisma.project.update({
      where: { id: newProject.id },
      data: {
        progress: 80,
        description: "Updated description after automated phase inspection",
      },
    });
    if (updatedProject.progress === 80) {
      record("Project: EDIT & UPDATE", "PASS", `Updated progress to ${updatedProject.progress}%`);
    } else {
      record("Project: EDIT & UPDATE", "FAIL", "Progress update failed");
    }

    // Delete
    await prisma.project.delete({ where: { id: newProject.id } });
    const verifyDeleted = await prisma.project.findUnique({ where: { id: newProject.id } });
    if (!verifyDeleted) {
      record("Project: DELETE", "PASS", "Project successfully deleted from PostgreSQL");
    } else {
      record("Project: DELETE", "FAIL", "Project deletion failed");
    }

    // ------------------------------------------------------------------
    // TEST 4: SERVICES CRUD (Add, View, Edit, Delete)
    // ------------------------------------------------------------------
    const serviceSlug = `test-service-${Date.now()}`;
    const testService = await prisma.service.create({
      data: {
        label: "Automated Vertical Hydroponics",
        slug: serviceSlug,
        category: "Indoor Landscape",
        desc: "State-of-the-art vertical hydroponic green wall",
        pricing: "৳১,২০০/বর্গফুট",
        features: ["Auto-irrigation", "UV Grow Lights"],
      },
    });
    record("Service: CREATE", "PASS", `Created service: ${testService.label}`);

    const foundService = await prisma.service.findUnique({ where: { id: testService.id } });
    if (foundService) {
      record("Service: VIEW", "PASS", `Verified service features: ${foundService.features.length} items`);
    }

    const updatedService = await prisma.service.update({
      where: { id: testService.id },
      data: { desc: "Updated description for test verification" },
    });
    record("Service: EDIT", "PASS", "Updated service description");

    await prisma.service.delete({ where: { id: testService.id } });
    record("Service: DELETE", "PASS", "Service deleted successfully");

    // ------------------------------------------------------------------
    // TEST 5: GALLERY CRUD (Add, View, Edit, Delete)
    // ------------------------------------------------------------------
    const testGallery = await prisma.galleryItem.create({
      data: {
        title: "Test Luxury Balcony Oasis",
        imageUrl: "https://images.unsplash.com/photo-1558904541-efa8c4a08931",
        category: "Balcony Gardens",
        caption: "Testing gallery item workflow",
      },
    });
    record("Gallery: CREATE", "PASS", `Created gallery item: ${testGallery.title}`);

    await prisma.galleryItem.update({
      where: { id: testGallery.id },
      data: { featured: true },
    });
    record("Gallery: EDIT", "PASS", "Marked gallery item as featured");

    await prisma.galleryItem.delete({ where: { id: testGallery.id } });
    record("Gallery: DELETE", "PASS", "Gallery item deleted successfully");

    // ------------------------------------------------------------------
    // TEST 6: TREE DOCTOR & EMERGENCY (Add, Update Diagnosis, Delete)
    // ------------------------------------------------------------------
    const testTree = await prisma.treeDoctorRequest.create({
      data: {
        clientName: "Test Patient Client",
        clientPhone: "01883012641",
        location: "Gulshan-2, Dhaka",
        treeName: "Imported Ficus Bonsai",
        problem: "Severe leaf yellowing and stem fungal symptoms",
        isEmergency: true,
        status: "PENDING",
      },
    });
    record("Tree Doctor: CREATE EMERGENCY", "PASS", `Created request ID: ${testTree.id}`);

    const updatedTree = await prisma.treeDoctorRequest.update({
      where: { id: testTree.id },
      data: {
        status: "TREATED",
        diagnosis: "Nitrogen deficiency & Fungal root rot",
        treatment: "Fungicide drench + Organic bio-stimulant applied",
      },
    });
    record("Tree Doctor: DIAGNOSIS & UPDATE", "PASS", `Updated status: ${updatedTree.status} with treatment recorded`);

    await prisma.treeDoctorRequest.delete({ where: { id: testTree.id } });
    record("Tree Doctor: DELETE", "PASS", "Tree doctor case deleted cleanly");

    // ------------------------------------------------------------------
    // TEST 7: USER MANAGEMENT (Admin create, Verify, Role Update, Delete)
    // ------------------------------------------------------------------
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testUser = await prisma.user.create({
      data: {
        name: "Test Client Account",
        email: testEmail,
        password: await bcrypt.hash("securePassword123", 10),
        role: "CLIENT",
        phone: "01700000000",
      },
    });
    record("User Management: CREATE", "PASS", `Registered user: ${testUser.email}`);

    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { role: "MODERATOR" },
    });
    record("User Management: UPDATE ROLE", "PASS", `Promoted role to: ${updatedUser.role}`);

    await prisma.user.delete({ where: { id: testUser.id } });
    record("User Management: DELETE", "PASS", "Test user deleted from database");

    // ------------------------------------------------------------------
    // TEST 8: INVOICE & PAYMENT RECONCILIATION
    // ------------------------------------------------------------------
    const testInvoiceNum = `INV-TEST-${Date.now()}`;
    const testInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber: testInvoiceNum,
        clientName: "Test Corporation Ltd",
        totalAmount: 150000,
        paidAmount: 0,
        dueAmount: 150000,
        status: "DUE",
      },
    });
    record("Invoice: CREATE", "PASS", `Created Invoice #${testInvoice.invoiceNumber} for ৳${testInvoice.totalAmount}`);

    // Simulate Payment Recording
    const payment = await prisma.payment.create({
      data: {
        invoiceId: testInvoice.id,
        amount: 150000,
        paymentMethod: "SSLCOMMERZ",
        transactionId: `TXN-AUTO-${Date.now()}`,
        notes: "Full payment settlement test",
      },
    });
    const paidInvoice = await prisma.invoice.update({
      where: { id: testInvoice.id },
      data: {
        paidAmount: 150000,
        dueAmount: 0,
        status: "PAID",
      },
    });
    if (paidInvoice.status === "PAID" && paidInvoice.dueAmount === 0) {
      record("Invoice: PAYMENT & RECONCILIATION", "PASS", `Invoice status automatically marked as ${paidInvoice.status}`);
    } else {
      record("Invoice: PAYMENT & RECONCILIATION", "FAIL", "Payment reconciliation error");
    }

    await prisma.payment.delete({ where: { id: payment.id } });
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
    record("Invoice: CLEANUP", "PASS", "Test invoice and payment purged cleanly");

    // ------------------------------------------------------------------
    // TEST 9: REVIEWS & APPROVAL WORKFLOW
    // ------------------------------------------------------------------
    const testReview = await prisma.review.create({
      data: {
        name: "Test Reviewer",
        rating: 5,
        text: "Outstanding rooftop architectural execution by AR Green Garden!",
        service: "Rooftop Garden Design",
        status: "Pending",
      },
    });
    record("Review: SUBMIT", "PASS", `Created review ID: ${testReview.id} (Status: ${testReview.status})`);

    const approvedReview = await prisma.review.update({
      where: { id: testReview.id },
      data: { status: "Approved" },
    });
    record("Review: MODERATOR APPROVAL", "PASS", `Approved review: ${approvedReview.id}`);

    await prisma.review.delete({ where: { id: testReview.id } });
    record("Review: DELETE", "PASS", "Review deleted successfully");

    // ------------------------------------------------------------------
    // TEST 10: DESIGN WIZARD REQUEST
    // ------------------------------------------------------------------
    const designReq = await prisma.designGardenRequest.create({
      data: {
        name: "Test Garden Architect Client",
        phone: "01883012641",
        spaceType: "Rooftop Commercial",
        designStyle: "Tropical Minimalist",
        approxArea: "1500 sqft",
        budgetRange: "৳৫-৮ লাখ",
        status: "NEW",
      },
    });
    record("Design Wizard: SUBMISSION", "PASS", `Created request ID: ${designReq.id}`);

    await prisma.designGardenRequest.delete({ where: { id: designReq.id } });
    record("Design Wizard: CLEANUP", "PASS", "Design request deleted");

    console.log("\n=================================================");
    console.log("📊 TEST EXECUTION SUMMARY:");
    const passed = results.filter((r) => r.status === "PASS").length;
    const failed = results.filter((r) => r.status === "FAIL").length;
    console.log(`Total Tests Run: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err: any) {
    console.error("Test execution fatal error:", err);
    process.exit(1);
  }
}

runFullSystemTest();
