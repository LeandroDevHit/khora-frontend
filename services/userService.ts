import api from "./api";
import { handleApiError } from "./errorHandler";

export interface UserProfileResponse {
  id: string | null;
  user_id: string | null;
  data_nascimento: string | null;
  altura_cm: number | null;
  peso_kg: string | number | null;
  genero: string | null;
  user?: {
    name: string | null;
    email: string | null;
  } | null;
}

export interface UserProfilePayload {
  data_nascimento?: string | null;
  altura_cm?: number | null;
  peso_kg?: number | null;
  genero?: string | null;
}

export interface SaveUserProfileResponse {
  message: string;
  profile: UserProfileResponse;
}

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await api.get<UserProfileResponse>("/profile");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const saveUserProfile = async (
  payload: UserProfilePayload
): Promise<SaveUserProfileResponse> => {
  try {
    const response = await api.put<SaveUserProfileResponse>("/profile", payload);
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

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await api.put<ChangePasswordResponse>("/user/change-password", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
