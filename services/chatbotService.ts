import api from "./api";
import { handleApiError } from "./errorHandler";

// Tipagem de payload esperado pelo backend
export interface ChatRequestPayload {
  userId: string; // userId
  userName: string; // userName
  message: string; // conteúdo enviado
  conversationId?: string; // opcional se o backend utilizar
}

export const startChatBot = async (
  userId: string,
  userName: string,
  message: string
) => {
  try {
    const payload: ChatRequestPayload = { userId, userName, message };
    const response = await api.post("/start-chat", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendChatbotMessage = async (
  userId: string,
  userName: string,
  message: string,
  conversationId?: string
) => {
  try {
    if (!userId || !userName || !message) {
      throw new Error("Campos 'id', 'name' e 'message' são obrigatórios para enviar mensagem.");
    }
    const payload: ChatRequestPayload = { userId, userName, message, conversationId }
    const response = await api.post("/continue-chat", payload);
    // console.log(response);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
