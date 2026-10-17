export interface JobOpening {
  id: string;
  titleEn: string;
  titleBn: string;
  departmentEn: string;
  departmentBn: string;
  locationEn: string;
  locationBn: string;
  typeEn: string;
  typeBn: string;
  salaryRange?: string;
  experience?: string;
  descriptionEn: string;
  descriptionBn: string;
}

export interface CareerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  coverLetter?: string | null;
  resumeUrl: string;
  status: "Pending" | "Reviewing" | "Shortlisted" | "Rejected" | string;
  createdAt: string;
}
