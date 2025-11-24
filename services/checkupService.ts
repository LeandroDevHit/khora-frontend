import api from "./api";
import { handleApiError } from "./errorHandler";

export interface CheckupPayload {
  idade: string;
  altura: string;
  peso: string;
  vicios: { fumar: boolean; beber: boolean; drogas: boolean; porno: boolean };
}

export const sendUserCheckup = async (payload: CheckupPayload) => {
  try {
    const response = await api.post("/user/checkup", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCheckups = async () => {
  try {
    const response = await api.get("/checkups");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createCheckup = async (payload: any) => {
  try {
    const response = await api.post("/checkups", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCheckup = async (id: string, payload: any) => {
  try {
    const response = await api.put(`/checkups/${id}`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteCheckup = async (id: string) => {
  try {
    const response = await api.delete(`/checkups/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCheckupsTimeline = async () => {
  try {
    const response = await api.get("/checkups/timeline");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createOrUpdateCheckupReminder = async (payload: any) => {
  try {
    const response = await api.post("/checkups/reminder", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
