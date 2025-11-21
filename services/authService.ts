import api from "./api";

export const registerUser = async (
  name: string,
  email: string,
  password_hash: string
) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password_hash,
    });
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
}

export const authenticateUser = async (
  email: string,
  password_hash: string
) => {
  try {
    const response = await api.post("/auth/login", { email, password_hash });
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

export const verifyTwoFactorCode = async (code: string, userId: string) => {
  try {
    const response = await api.post("/auth/verify-2fa", { userId, code });
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

export const checkFirstLogin = async () => {
  try {
    const response = await api.get("/auth/check-first-login");
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

export const resendTwoFactorCode = async (userId: string) => {
  try {
    const response = await api.post("/auth/resend-2fa", { userId });
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
}

export const sendResetPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/request-password", { email });
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
}

export const verifyCodeResetPassword = async (email: string, code: string) => {
  try {
    const response = await api.post("/auth/verify-code-reset", { email, code });
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
}

export const resendCodeResetPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/resend-code-email", { email });
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
}

export const resetPassword = async (userId: string, newPassword: string, confirmPassword: string) => {
  try {
    const response = await api.post("/auth/reset-password", { userId, newPassword, confirmPassword });
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
}
