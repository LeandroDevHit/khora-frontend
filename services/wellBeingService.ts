import api from "./api";
import { handleApiError } from "./errorHandler";

export const fetchSaudeMental = async () => {
  try {
    const response = await api.get("/relief/audio");
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const fetchPrevencao = async () => {
  try {
    const response = await api.get("/relief/breathing");
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const fetchDailyMood = async () => {
  try {
    const response = await api.get("/mood");
    return response.data;
  } catch (error) { handleApiError(error); }
};
