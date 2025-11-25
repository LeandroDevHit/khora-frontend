import api from "./api";
import { handleApiError } from "./errorHandler";

export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  origin?: string;
  createdAt: string;
}

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

export const fetchDailyMood = async (): Promise<MoodEntry[]> => {
  try {
    const response = await api.get<MoodEntry[]>("/mood");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const saveMood = async (mood: string, origin: string = "profile"): Promise<MoodEntry> => {
  try {
    const response = await api.post<MoodEntry>("/mood", { mood, origin });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getLatestMood = async (): Promise<MoodEntry | null> => {
  try {
    const entries = await fetchDailyMood();
    return entries && entries.length > 0 ? entries[0] : null;
  } catch (error) {
    console.warn("Erro ao buscar último mood:", error);
    return null;
  }
};
