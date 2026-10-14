// Shared types for client dashboard
export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  location: string;
  budget?: number;
  totalExpense?: number;
  progress: number;
  status: string;
  clientName?: string;
  startDate?: string;
  deadline?: string;
  beforePhotos?: string[];
  wipPhotos?: string[];
  afterPhotos?: string[];
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  createdAt: string;
  payments?: { amount: number; paymentMethod: string; paymentDate: string }[];
}

export interface TreeDoctorItem {
  id: string;
  treeName: string;
  problem: string;
  location: string;
  status: string;
  isEmergency: boolean;
  preferredVisitTime?: string;
  treePhotoUrl?: string;
  assignedDoctor?: { name: string; designation: string };
  createdAt: string;
}

export interface PlantHealthItem {
  id: string;
  plantName: string;
  location: string;
  diseaseHistory?: string;
  treatment?: string;
  fertilizer?: string;
  nextMaintenanceDate?: string;
  doctorReport?: string;
}

export interface MaintenanceItem {
  id: string;
  frequency: string;
  scheduledDate: string;
  status: string;
  location: string;
  notes?: string;
  assignedStaff?: { name: string; designation: string };
}

export interface ClientDashboardData {
  projects: ProjectItem[];
  invoices: InvoiceItem[];
  treeRequests: TreeDoctorItem[];
  plantRecords: PlantHealthItem[];
  maintenanceList: MaintenanceItem[];
  dataLoading: boolean;
}
