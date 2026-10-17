import { prisma } from "../src/lib/prisma";

/**
 * Migration Script: Migrate existing assignedStaff (String) to assignedStaffId (Relation)
 * Ensures 100% zero data loss by matching employee names and setting foreign key IDs.
 */
export async function migrateBookingsStaff() {
  console.log("Starting Booking assignedStaff migration...");

  const employees = await prisma.employee.findMany({
    select: { id: true, name: true, employeeId: true },
  });

  console.log(`Found ${employees.length} active employees.`);

  // Find bookings with assignedStaff but no assignedStaffId
  const unmigrated = await prisma.booking.findMany({
    where: {
      assignedStaffId: null,
      assignedStaff: { not: null },
    },
    select: { id: true, assignedStaff: true },
  });

  console.log(`Found ${unmigrated.length} bookings needing staff ID link.`);

  let migratedCount = 0;
  for (const b of unmigrated) {
    if (!b.assignedStaff || b.assignedStaff === "Unassigned") continue;

    // Find employee by exact name (case-insensitive)
    const matched = employees.find(
      (e) => e.name.trim().toLowerCase() === b.assignedStaff?.trim().toLowerCase()
    );

    if (matched) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { assignedStaffId: matched.id },
      });
      migratedCount++;
      console.log(`Linked booking ${b.id} (${b.assignedStaff}) to employee ${matched.id}`);
    } else {
      console.log(`Note: Booking ${b.id} has assignedStaff '${b.assignedStaff}', but no exact matching employee record was found in Employee table. String preserved.`);
    }
  }

  console.log(`Migration complete. Successfully linked ${migratedCount} bookings.`);
  return { unmigrated: unmigrated.length, migratedCount };
}

if (require.main === module) {
  migrateBookingsStaff()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
