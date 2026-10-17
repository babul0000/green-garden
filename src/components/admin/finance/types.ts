export interface QuotationItem {
  category: string;
  itemTitle: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  clientName: string;
  clientPhone?: string | null;
  subtotal: number;
  discount: number;
  total: number;
  advance: number;
  due: number;
  status: string;
  createdAt: string;
  items: QuotationItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  minThreshold: number;
  unit: string;
  unitCost: number;
  isLowStock?: boolean;
}

export interface AccountingData {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    profitMargin: string;
  };
  incomeBreakdown: Record<string, { label: string; amount: number }>;
  expenseBreakdown: Record<string, { label: string; amount: number }>;
}

export const QUOTATION_CATEGORIES = [
  "Landscape Design",
  "Plants",
  "Soil & Media",
  "Fertilizer",
  "Pots & Tubs",
  "Labour",
  "Irrigation",
  "Lighting",
  "Fountain",
  "Transportation",
  "Other Costs",
];
