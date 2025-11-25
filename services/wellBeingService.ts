import api from "./api";
import { handleApiError } from "./errorHandler";

export type ReliefAudio = {
  id: number;
  title: string;
  description: string;
  src: string;
  duration_seconds: number;
};

export type BreathingExerciseStep = {
  step: string;
  duration_seconds: number;
};

export type BreathingExercise = {
  id: string;
  name: string;
  description: string;
  steps: BreathingExerciseStep[];
  cycles: number;
};

export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  origin?: string;
  createdAt: string;
}

type ReliefAudioResponse = { data: ReliefAudio[] } | ReliefAudio[];
type BreathingResponse = { data: BreathingExercise[] } | BreathingExercise[];

export const fetchSaudeMental = async (): Promise<ReliefAudio[]> => {
  try {
    const response = await api.get<ReliefAudioResponse>("/relief/audio");
    const payload = response.data;
    return Array.isArray(payload) ? payload : payload?.data ?? [];
  } catch (error) { handleApiError(error); }
};

export const fetchPrevencao = async (): Promise<BreathingExercise[]> => {
  try {
    const response = await api.get<BreathingResponse>("/relief/breathing");
    const payload = response.data;
    return Array.isArray(payload) ? payload : payload?.data ?? [];
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
