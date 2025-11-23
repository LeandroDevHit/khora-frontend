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
// Dashboard do usuário
export const fetchDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

// Analytics histórico
export const fetchAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data;
};

// Insights proativos
export const fetchInsights = async () => {
  const response = await api.get("/insights");
  return response.data;
};

// Checkups - Listar todos
export const fetchCheckups = async () => {
  const response = await api.get("/checkups");
  return response.data;
};

// Checkups - Criar novo
export const createCheckup = async (payload: any) => {
  const response = await api.post("/checkups", payload);
  return response.data;
};

// Checkups - Editar
export const updateCheckup = async (id: string, payload: any) => {
  const response = await api.put(`/checkups/${id}`, payload);
  return response.data;
};

// Checkups - Deletar
export const deleteCheckup = async (id: string) => {
  const response = await api.delete(`/checkups/${id}`);
  return response.data;
};

// Checkups - Timeline
export const fetchCheckupsTimeline = async () => {
  const response = await api.get("/checkups/timeline");
  return response.data;
};

// Checkups - Criar/Atualizar lembrete
export const createOrUpdateCheckupReminder = async (payload: any) => {
  const response = await api.post("/checkups/reminder", payload);
  return response.data;
};

// Conteúdo - Listar categorias
export const fetchConteudoCategorias = async () => {
  const response = await api.get("/conteudo/categorias");
  return response.data;
};

// Conteúdo - Listar destaques
export const fetchConteudoDestaques = async () => {
  const response = await api.get("/conteudo/destaques");
  return response.data;
};

// Conteúdo - Pesquisar conteúdos
export const searchConteudo = async (query: string) => {
  const response = await api.get(`/conteudo/pesquisar?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Conteúdo - Listar por categoria
export const fetchConteudoPorCategoria = async (categoriaId: string) => {
  const response = await api.get(`/conteudo/categoria/${categoriaId}`);
  return response.data;
};

// Conteúdo - Buscar por ID
export const fetchConteudoById = async (id: string) => {
  const response = await api.get(`/conteudo/${id}`);
  return response.data;
};

// Conteúdo - Criar conteúdo
export const createConteudo = async (payload: any) => {
  const response = await api.post("/conteudo", payload);
  return response.data;
};

// Fórum - Criar novo tópico
export const createForumTopic = async (payload: any) => {
  const response = await api.post("/forum/topics", payload);
  return response.data;
};

// Fórum - Listar tópicos
export const fetchForumTopics = async () => {
  const response = await api.get("/forum/topics");
  return response.data;
};

// Fórum - Criar pseudônimo
export const createForumPseudonym = async (payload: any) => {
  const response = await api.post("/forum/pseudonym", payload);
  return response.data;
};

// Fórum - Criar post
export const createForumPost = async (payload: any) => {
  const response = await api.post("/forum/posts", payload);
  return response.data;
};

// Fórum - Listar posts de um tópico
export const fetchForumPostsByTopic = async (topicId: string) => {
  const response = await api.get(`/forum/topics/${topicId}/posts`);
  return response.data;
};

// Fórum - Criar resposta em post
export const createForumReply = async (payload: any) => {
  const response = await api.post("/forum/replies", payload);
  return response.data;
};

// Fórum - Deletar post
export const deleteForumPost = async (postId: string) => {
  const response = await api.delete(`/forum/posts/${postId}`);
  return response.data;
};

// Grupos - Criar grupo
export const createTeam = async (payload: any) => {
  const response = await api.post("/teams", payload);
  return response.data;
};

// Grupos - Convidar usuário
export const inviteToTeam = async (payload: any) => {
  const response = await api.post("/teams/invite", payload);
  return response.data;
};

// Grupos - Criar desafio
export const createTeamChallenge = async (teamId: string, payload: any) => {
  const response = await api.post(`/teams/${teamId}/challenges`, payload);
  return response.data;
};

// Gamificação - Listar perguntas do quiz
export const fetchQuizQuestions = async () => {
  const response = await api.get("/quiz");
  return response.data;
};

// Gamificação - Validar resposta do quiz
export const answerQuizQuestion = async (payload: any) => {
  const response = await api.post("/quiz/answer", payload);
  return response.data;
};

// Chatbot - Enviar mensagem
export const sendChatbotMessage = async (payload: any) => {
  const response = await api.post("/chat", payload);
  return response.data;
};

// Diário - Criar postagem
export const createDiaryEntry = async (payload: any) => {
  const response = await api.post("/diary", payload);
  return response.data;
};

// Diário - Listar postagens
export const fetchDiaryEntries = async () => {
  const response = await api.get("/diary");
  return response.data;
};
