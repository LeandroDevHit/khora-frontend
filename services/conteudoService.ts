import api from "./api";
import { handleApiError } from "./errorHandler";

export const fetchConteudo = async () => {
  try {
    const response = await api.get("/conteudo");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConteudoCategorias = async () => {
  try {
    const response = await api.get("/conteudo/categorias");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConteudoDestaques = async () => {
  try {
    const response = await api.get("/conteudo/destaques");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const searchConteudo = async (query: string) => {
  try {
    const response = await api.get(`/conteudo/pesquisar?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConteudoPorCategoria = async (categoriaId: string) => {
  try {
    const response = await api.get(`/conteudo/categoria/${categoriaId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConteudoById = async (id: string) => {
  try {
    const response = await api.get(`/conteudo/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createConteudo = async (payload: any) => {
  try {
    const response = await api.post("/conteudo", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
