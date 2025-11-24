import api from "./api";
import { handleApiError } from "./errorHandler";

export const createTeam = async (payload: any) => {
  try {
    const response = await api.post("/teams", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const inviteToTeam = async (payload: any) => {
  try {
    const response = await api.post("/teams/invite", payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};

export const createTeamChallenge = async (teamId: string, payload: any) => {
  try {
    const response = await api.post(`/teams/${teamId}/challenges`, payload);
    return response.data;
  } catch (error) { handleApiError(error); }
};
