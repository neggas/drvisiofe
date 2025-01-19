export interface QuizSpecialityTypes {
  speciality: {
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
      path: string | null;
      url: string;
      data: string | null;
      dataBytes: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    nbAssociatedQuiz: number;
    nbAssociatedCourse: number;
    deletable: boolean;
    createdAt: string;
    updatedAt: string;
  };
  nbAssociatedQuiz: number;
  nbAssociatedCourse: number;
}

export interface DiscoveryMedicalSpecialityTypes {
  speciality: {
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
      path: string | null;
      url: string;
      data: string | null;
      dataBytes: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    nbAssociatedQuiz: number;
    nbAssociatedCourse: number;
    deletable: boolean;
    createdAt: string;
    updatedAt: string;
  };
  nbReadCourse: number;
  nbTotalCourse: number;
  nbDownloadCourse: number;
  nbAssociatedQuizz: number;
}

export interface QuizNewSpecialityTypes {
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
    path: string | null;
    url: string;
    data: string | null;
    dataBytes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  nbAssociatedQuiz: number;
  nbAssociatedCourse: number;
  deletable: boolean;
  createdAt: string;
  updatedAt: string;
}
