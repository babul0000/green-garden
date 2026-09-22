import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Calculate Incomes from Invoices and Projects
    const invoices = await prisma.invoice.findMany();
    const paidIncome = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

    // Breakdown streams
    const projectIncome = Math.round(paidIncome * 0.65);
    const maintenanceIncome = Math.round(paidIncome * 0.18);
    const treeDoctorIncome = Math.round(paidIncome * 0.08);
    const plantSalesIncome = Math.round(paidIncome * 0.09);

    const totalIncome = projectIncome + maintenanceIncome + treeDoctorIncome + plantSalesIncome;

    // 2. Calculate Expenses
    const employees = await prisma.employee.findMany();
    const totalSalaries = employees.reduce((acc, emp) => acc + (emp.salary || 0), 0);

    const projects = await prisma.project.findMany();
    const projectExpenses = projects.reduce((acc, p) => acc + (p.totalExpense || 0), 0);

    const plantMaterialExpense = Math.round(projectExpenses * 0.4);
    const soilFertilizerExpense = Math.round(projectExpenses * 0.2);
    const transportExpense = Math.round(projectExpenses * 0.15);
    const toolsIrrigationExpense = Math.round(projectExpenses * 0.15);
    const officeExpense = 25000;

    const totalExpense = totalSalaries + projectExpenses + officeExpense;
    const netProfit = totalIncome - totalExpense;

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("Error calculating accounting:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
