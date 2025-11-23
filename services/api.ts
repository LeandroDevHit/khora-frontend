// Saúde mental (áudios relaxantes e meditações)
export const fetchSaudeMental = async () => {
  const response = await api.get("/relief/audio");
  return response.data;
};
// Prevenção (exercícios de respiração)
export const fetchPrevencao = async () => {
  const response = await api.get("/relief/breathing");
  return response.data;
};
// Metas do usuário
export const fetchUserMetas = async () => {
  const response = await api.get("/user/metas");
  return response.data;
};
// Enviar respostas do questionário (checkup)
export const sendUserCheckup = async (payload: {
  idade: string;
  altura: string;
  peso: string;
  vicios: { fumar: boolean; beber: boolean; drogas: boolean; porno: boolean };
}) => {
  const response = await api.post("/user/checkup", payload);
  return response.data;
};
// Perfil do usuário
export const fetchUserProfile = async () => {
  const response = await api.get("/user");
  return response.data;
};
// Conteúdo (Artigos, vídeos, etc)
export const fetchConteudo = async () => {
  const response = await api.get("/conteudo");
  return response.data;
};
import axios from "axios";
import Constants from "expo-constants";

const api = axios.create({
  // baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Health Score
export const fetchHealthScore = async () => {
  const response = await api.get("/user/health-score");
  return response.data;
};

// Resumo do Dia (Mood)
export const fetchDailyMood = async () => {
  const response = await api.get("/mood");
  return response.data;
};

export default api;
