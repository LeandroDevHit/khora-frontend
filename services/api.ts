// Notícias sobre saúde masculina (GNews)
export const fetchNoticiasSaudeMasculina = async (): Promise<any[]> => {
  const API_KEY = "dcf10bde187ec1bda0c4b4e62c708bc3";
  const url = `https://gnews.io/api/v4/search?q=saúde%20masculina&lang=pt&max=10&token=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.articles || [];
};
import axios from "axios";
import Constants from "expo-constants";

// Instância central da API - responsabilidade única deste arquivo
const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;

// Define ou remove o token de autenticação rapidamente após login/logout
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
