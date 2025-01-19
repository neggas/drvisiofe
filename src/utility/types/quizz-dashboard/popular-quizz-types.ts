export interface PopularQuizTypes {
  id: number;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  color: string;
  file: {
    id: number;
    name: string;
    extension: string;
    size: number;
    url: string;
    createdAt: string;
    updatedAt: string;
  };
  nbAssociatedQuiz: number;
  nbAssociatedCourse: number;
  deletable: boolean;
  createdAt: string;
  updatedAt: string;
}
