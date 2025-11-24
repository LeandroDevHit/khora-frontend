import api from "./api";
import { handleApiError } from "./errorHandler";

export const fetchQuizQuestions = async () => {
  try {
    const response = await api.get("/quiz");
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const answerQuizQuestion = async (payload: any) => {
  try {
    const response = await api.post("/quiz/answer", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};
