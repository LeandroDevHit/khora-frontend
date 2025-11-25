import api from "./api";

export interface Habito {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
}

export interface HabitoDetalhes {
  id: string;
  habito: Habito;
  dataInicio: string;
  ultimaRecaida?: string;
  metaPessoal?: string;
  custoDiario?: number;
  diasLivres: number;
  tempo: {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
  };
  economia: number;
  progressoPercent: number;
  conquistas: {
    id: string;
    nome: string;
    descricao: string;
    iconeUrl?: string;
    dataConquista: string;
  }[];
}

/**
 * Lista todos os hábitos disponíveis
 */
export const listarHabitos = async (): Promise<Habito[]> => {
  const response: any = await api.get("/habitos");
  return response.data?.data || response.data || [];
};

/**
 * Busca detalhes de um progresso de hábito específico
 */
export const getHabitoDetalhes = async (id: string): Promise<HabitoDetalhes | null> => {
  try {
    const response: any = await api.get(`/habitos/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Erro ao buscar detalhes do hábito:", error);
    return null;
  }
};

/**
 * Registra uma recaída para um hábito
 */
export const registrarRecaida = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response: any = await api.post(`/habitos/${id}/recaida`);
    return {
      success: response.data?.success || true,
      message: response.data?.message || "Recaída registrada"
    };
  } catch (error: any) {
    console.error("Erro ao registrar recaída:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao registrar recaída"
    };
  }
};

/**
 * Adiciona um novo hábito para acompanhar
 */
export const adicionarHabito = async (
  habito_id: string,
  meta_pessoal?: string,
  custo_diario?: number
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response: any = await api.post("/habitos", {
      habito_id,
      meta_pessoal,
      custo_diario
    });
    return {
      success: response.data?.success || true,
      message: response.data?.message || "Hábito adicionado",
      data: response.data?.data
    };
  } catch (error: any) {
    console.error("Erro ao adicionar hábito:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao adicionar hábito"
    };
  }
};
