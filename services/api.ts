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
