import type { ICareerApplication } from "@/types";

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

export type CareerApplication = ICareerApplication;
