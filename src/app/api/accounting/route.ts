import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// Admin only: accounting data is sensitive
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const invoices = await prisma.invoice.findMany();
  const paidIncome = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  const projectIncome = Math.round(paidIncome * 0.65);
  const maintenanceIncome = Math.round(paidIncome * 0.18);
  const treeDoctorIncome = Math.round(paidIncome * 0.08);
  const plantSalesIncome = Math.round(paidIncome * 0.09);
  const totalIncome = projectIncome + maintenanceIncome + treeDoctorIncome + plantSalesIncome;

  const employees = await prisma.employee.findMany({ select: { salary: true } });
  const totalSalaries = employees.reduce((acc, emp) => acc + (emp.salary || 0), 0);

  const projects = await prisma.project.findMany({ select: { totalExpense: true } });
  const projectExpenses = projects.reduce((acc, p) => acc + (p.totalExpense || 0), 0);

  const plantMaterialExpense = Math.round(projectExpenses * 0.4);
  const soilFertilizerExpense = Math.round(projectExpenses * 0.2);
  const transportExpense = Math.round(projectExpenses * 0.15);
  const toolsIrrigationExpense = Math.round(projectExpenses * 0.15);
  const officeExpense = 25000;
  const totalExpense = totalSalaries + projectExpenses + officeExpense;
  const netProfit = totalIncome - totalExpense;

  return NextResponse.json(
    {
      summary: {
        totalIncome,
        totalExpense,
        netProfit,
        profitMargin: totalIncome > 0 ? `${((netProfit / totalIncome) * 100).toFixed(1)}%` : "0%",
      },
      incomeBreakdown: {
        projectIncome: { label: "Project Income (প্রজেক্ট আয়)", amount: projectIncome },
        maintenanceIncome: { label: "Maintenance Income (মেইনটেন্যান্স আয়)", amount: maintenanceIncome },
        treeDoctorIncome: { label: "Tree Doctor Service (ট্রি ডক্টর ফি)", amount: treeDoctorIncome },
        plantSalesIncome: { label: "Plant & Soil Sales (গাছ ও মাটি বিক্রয়)", amount: plantSalesIncome },
      },
      expenseBreakdown: {
        employeeSalary: { label: "Employee Salary (কর্মচারী বেতন)", amount: totalSalaries },
        plantsMaterial: { label: "Plants & Trees (গাছ ক্রয়)", amount: plantMaterialExpense },
        soilFertilizer: { label: "Soil & Media (মাটি ও সার)", amount: soilFertilizerExpense },
        transport: { label: "Transportation (যাতায়াত ও পরিবহন)", amount: transportExpense },
        toolsIrrigation: { label: "Tools & Equipment (টুলস ও পাইপ)", amount: toolsIrrigationExpense },
        officeExpense: { label: "Office & Utilities (অফিস ও অপারেশনাল)", amount: officeExpense },
      },
    },
    { headers: NO_CACHE }
  );
});
