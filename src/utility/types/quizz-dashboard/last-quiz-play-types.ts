export interface LastQuizPlayedApiResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    ipAddress: string;
    macAddress: string;
    progressPercent: number;
    nbStar: number;
    status: string;
    random: boolean;
    duration: number;
    endDate: string;
    duel: boolean;
    quizzType: {
      id: number;
      name: string;
      numberOfQuestion: number;
    };
    speciality: {
      id: number;
      name: string;
    };
  };
}
