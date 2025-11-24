export function handleApiError(error: any): never {
  if (error?.response) {
    console.error(
      "Erro na resposta da API:",
      error.response.status,
      error.response.data
    );
  } else if (error?.request) {
    console.error("Erro na requisição:", error.request);
  } else {
    console.error("Erro:", error?.message || error);
  }
  throw error;
}
