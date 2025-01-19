export interface SpecialityType {
  id: number;
  name: string;
  description: string | null;
  nameEn: string | null;
  descriptionEn: string | null;
  color: string;
  createdAt: string;
  updatedAt: string | null;
}

export type SpecialityState = {
  data: SpecialityType[];
};
