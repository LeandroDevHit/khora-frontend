import api from "./api";
import { handleApiError } from "./errorHandler";

export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchUserMetas = async () => {
  try {
    const response = await api.get("/user/metas");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchHealthScore = async () => {
  try {
    const response = await api.get("/user/health-score");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
