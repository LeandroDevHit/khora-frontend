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

export default api;
