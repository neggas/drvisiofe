import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface QuizState {
  selectedQuizId: string | null;
  quizId?: number | null;
  quizzPlayId?: number | null;
  isAuthorized: boolean;
  lastQuizPlayData?: any;
}

const initialState: QuizState = {
  selectedQuizId: null,
  quizId: null,
  quizzPlayId: null,
  isAuthorized: false,
  lastQuizPlayData: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setSelectedQuizId: (state, action: PayloadAction<string>) => {
      state.selectedQuizId = action.payload;
    },
    clearSelectedQuizId: state => {
      state.selectedQuizId = null;
    },
    setQuizId: (state, action: PayloadAction<number>) => {
      state.quizId = action.payload;
    },
    setQuizzPlayId: (state, action: PayloadAction<number>) => {
      state.quizzPlayId = action.payload;
    },
    clearQuizId: state => {
      state.quizId = null;
    },
    authorizeAccess: state => {
      state.isAuthorized = true;
    },
    revokeAccess: state => {
      state.isAuthorized = false;
    },
    setLastQuizPlayData: (state, action: PayloadAction<string>) => {
      state.lastQuizPlayData = action.payload;
    },
  },
});

export const { setSelectedQuizId, clearSelectedQuizId, setQuizId, clearQuizId, setQuizzPlayId, authorizeAccess, revokeAccess, setLastQuizPlayData } =
  quizSlice.actions;

export default quizSlice.reducer;
