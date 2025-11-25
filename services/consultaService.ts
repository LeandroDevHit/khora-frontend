import api from "./api";

export const fetchConsultas = async () => {
  // Exemplo de endpoint, ajuste conforme o backend
  const response = await api.get("/consultas");
  return response.data;
};
