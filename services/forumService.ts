import api from "./api";
import { handleApiError } from "./errorHandler";

export const createForumTopic = async (payload: any) => {
  try {
    const response = await api.post("/forum/topics", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const fetchForumTopics = async () => {
  try {
    const response = await api.get("/forum/topics");
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const createForumPseudonym = async (payload: any) => {
  try {
    const response = await api.post("/forum/pseudonym", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const createForumPost = async (payload: any) => {
  try {
    const response = await api.post("/forum/posts", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const fetchForumPostsByTopic = async (topicId: string) => {
  try {
    const response = await api.get(`/forum/topics/${topicId}/posts`);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const createForumReply = async (payload: any) => {
  try {
    const response = await api.post("/forum/replies", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const deleteForumPost = async (postId: string) => {
  try {
    const response = await api.delete(`/forum/posts/${postId}`);
    return response.data;
  } catch (error) { handleApiError(error); }
};
