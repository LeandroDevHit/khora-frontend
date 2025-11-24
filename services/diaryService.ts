import api from "./api";
import { handleApiError } from "./errorHandler";

export const createDiaryEntry = async (payload: any) => {
  try {
    const response = await api.post("/diary", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const fetchDiaryEntries = async () => {
  try {
    const response = await api.get("/diary");
    return response.data;
  } catch (error) { handleApiError(error); }
};
