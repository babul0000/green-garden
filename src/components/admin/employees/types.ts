export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  responsibility?: string | null;
  joiningDate: string;
  calculatedExperience?: string;
  skills: string[];
  salary?: number | null;
  personalPhone?: string | null;
  personalAddress?: string | null;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | string;
  role?: "ADMIN" | "MODERATOR" | "EDITOR" | "EMPLOYEE" | "CLIENT" | string;
  photo?: string | null;
  user?: { id: string; email?: string; role?: string; name?: string } | null;
  attendances?: { date: string; status: string; checkIn?: string; checkOut?: string }[];
}

export interface ProjectAssignment {
  id: string;
  employeeId: string;
  projectId: string;
  assignedDate: string;
  roleOnTask: string;
  status: string;
  employee?: { name: string; employeeId: string; designation: string };
  project?: { name: string; location: string };
}

export interface ProjectOption {
  id: string;
  name: string;
  location: string;
}
