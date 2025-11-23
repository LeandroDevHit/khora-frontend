import api from "./api";

export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      console.error(
        "Erro na resposta da API:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("Erro na requisição:", error.request);
    } else {
      console.error("Erro:", error.message);
    }
    throw error;
  }
};
