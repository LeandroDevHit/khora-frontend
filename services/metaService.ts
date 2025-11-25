import api from "./api";
import { handleApiError } from "./errorHandler";

export interface Meta {
  id: string;
  tipo: string; // 'peso', 'massa', 'condicionamento', 'forma'
  objetivo: number | null;
  atual: number | null;
  unidade: string;
  ativo: boolean;
  createdAt?: string;
}

export interface PesoHistorico {
  data: string;
  peso: number;
}

export interface DashboardIndicadores {
  imc: number | null;
  categoriaIMC: string | null;
  altura: number | null;
  peso: number | null;
  genero: string | null;
}

export interface HabitoProgresso {
  id: string;
  nome: string;
  categoria: string | null;
  dataInicio: string;
  ultimaRecaida: string | null;
  metaPessoal: string | null;
  custoDiario: number | null;
  diasLivres: number;
}

export interface DashboardResponse {
  usuario: {
    id: string;
    nome: string;
    email: string;
    idade: number | null;
    tempoNaPlataforma: number;
  };
  indicadoresSaude: DashboardIndicadores;
  habitos: {
    estatisticas: {
      total: number;
      semRecaida: number;
      comRecaida: number;
      economiaTotal: number;
    };
    habitosAtivos: HabitoProgresso[];
  };
  conquistas: {
    total: number;
    recentes: any[];
  };
}

// Buscar dados do dashboard (inclui peso, hábitos, conquistas)
export const fetchDashboard = async (): Promise<DashboardResponse | null> => {
  try {
    const response = await api.get("/dashboard");
    // Backend retorna { success: true, data: dashboardData }
    const result = response.data as any;
    return result?.data || result;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Buscar indicadores de saúde (peso, altura, IMC)
export const fetchIndicadoresSaude = async (): Promise<DashboardIndicadores | null> => {
  try {
    const response = await api.get<DashboardResponse>("/dashboard");
    return response.data?.indicadoresSaude || null;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Atualizar peso do usuário
export const updatePeso = async (peso: number): Promise<boolean> => {
  try {
    await api.put("/profile", { peso_kg: peso });
    return true;
  } catch (error) {
    handleApiError(error);
    return false;
  }
};

// Buscar hábitos ativos do usuário
export const fetchHabitosAtivos = async (): Promise<HabitoProgresso[]> => {
  try {
    const response = await api.get<DashboardResponse>("/dashboard");
    return response.data?.habitos?.habitosAtivos || [];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Buscar conquistas do usuário
export const fetchConquistas = async (): Promise<{ total: number; recentes: any[] }> => {
  try {
    const response = await api.get<DashboardResponse>("/dashboard");
    return response.data?.conquistas || { total: 0, recentes: [] };
  } catch (error) {
    handleApiError(error);
    return { total: 0, recentes: [] };
  }
};

// Salvar meta de peso
export const saveMetaPeso = async (metaPeso: number): Promise<boolean> => {
  try {
    // Por enquanto, armazenamos localmente ou em um campo específico
    // O backend pode não ter endpoint específico para meta de peso
    await api.post("/user/meta-peso", { meta_peso: metaPeso });
    return true;
  } catch (error) {
    // Se não existir endpoint, ignoramos silenciosamente
    console.warn("Endpoint de meta de peso não disponível");
    return false;
  }
};
