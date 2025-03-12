// File: services/campaign.ts

import axios from "axios";
import { Campaign } from "@/types/campaign";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const CampaignService = {
  async getAll(filters: Record<string, string | undefined> = {}) {
    // 🔹 Remove valores undefined e vazios antes de construir a query
    const validFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value));

    const params = new URLSearchParams(validFilters as Record<string, string>);
    const response = await axios.get(`${API_URL}/campaigns?${params.toString()}`, getAuthHeaders());

    return response.data;
  },

  async getById(id: string): Promise<Campaign> {
    const response = await axios.get(`${API_URL}/campaigns/${id}`, getAuthHeaders());
    return response.data;
  },

  async create(
    campaign: Omit<Campaign, "id" | "account_id" | "created_at" | "updated_at" | "status">
  ) {
    const response = await axios.post(`${API_URL}/campaigns`, campaign, getAuthHeaders());
    return response.data;
  },

  async update(id: string, campaign: Partial<Campaign>) {
    const response = await axios.put(`${API_URL}/campaigns/${id}`, campaign, getAuthHeaders());
    return response.data;
  },

  async delete(id: string) {
    await axios.delete(`${API_URL}/campaigns/${id}`, getAuthHeaders());
  },

  // 🔹 1️⃣ Obter a audiência da campanha
  async getAudienceContacts(campaignId: string, currentPage: number, perPage: number) {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });

      const response = await axios.get(
        `${API_URL}/campaigns/${campaignId}/audience?${params.toString()}`,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao obter contatos disponíveis", error);
      return { data: [], total_records: 0, total_pages: 1, current_page: 1, per_page: perPage };
    }
  },

  // 🔹 1️⃣ Obter contatos disponíveis para adicionar à audiência
  async getAvailableContacts(
    campaignId: string,
    filters: any,
    currentPage: number,
    perPage: number
  ) {
    try {
      const params = new URLSearchParams({
        ...filters,
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });

      const response = await axios.get(
        `${API_URL}/campaigns/${campaignId}/available-contacts?${params.toString()}`,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao obter contatos disponíveis", error);
      return { data: [], total_records: 0, total_pages: 1, current_page: 1, per_page: perPage };
    }
  },

  // 🔹 2️⃣ Adicionar contatos à audiência
  async addContactsToAudience(campaignId: string, contactIds: string[]) {
    try {
      const payload = { contact_ids: contactIds };
      await axios.post(`${API_URL}/campaigns/${campaignId}/audience`, payload, getAuthHeaders());
    } catch (error) {
      console.error("Erro ao adicionar contatos à audiência", error);
      throw error;
    }
  },

  async addAllFilteredContactsToAudience(campaignId: string, filters: any) {
    try {
      const url = `${API_URL}/campaigns/${campaignId}/add-all-audience`;
      const response = await axios.post(url, { ...filters }, getAuthHeaders());

      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar todos os contatos à audiência", error);
      throw error;
    }
  },

  async updateStatus(campaignId: string, status: { status: string }) {
    console.log("Atualizando status da campanha", status);

    await axios.patch(`${API_URL}/campaigns/${campaignId}/status`, status, getAuthHeaders());
  },

  // 🔹 3️⃣ Remover um contato da audiência
  async removeContactFromAudience(campaignId: string, contactId: string) {
    try {
      const url = `${API_URL}/campaigns/${campaignId}/audience/${contactId}`;
      console.log("Removendo contato da audiência:", url);

      await axios.delete(url, getAuthHeaders());
    } catch (error) {
      console.error("Erro ao remover contato da audiência", error);
      throw error;
    }
  },

  // 🔹 4️⃣ Remover toda a audiência
  async removeAllAudience(campaignId: string) {
    try {
      const url = `${API_URL}/campaigns/${campaignId}/remove-all-audience`;
      await axios.delete(url, getAuthHeaders());
    } catch (error) {
      console.error("Erro ao remover toda a audiência", error);
      throw error;
    }
  },

  // 🔹 5️⃣ Obter configurações da campanha
  async getSettings(campaignId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/campaigns/${campaignId}/settings`,
        getAuthHeaders()
      );

      // 🔹 Retorna undefined se não houver conteúdo
      if (response.status === 204 || !response.data) {
        console.warn("Nenhuma configuração encontrada para esta campanha.");
        return undefined;
      }
      return response.data;
    } catch (error: any) {
      // 🔹 Se o erro for 404, trata como "nenhuma configuração"
      if (error.response && error.response.status === 404) {
        console.warn("Nenhuma configuração encontrada (404).");
        return undefined;
      }

      console.error("Erro ao buscar configurações da campanha", error);
      throw error;
    }
  },

  // 🔹 5️⃣ Criar configurações da campanha
  async createSettings(campaignId: string, settings: any) {
    try {
      await axios.post(`${API_URL}/campaigns/${campaignId}/settings`, settings, getAuthHeaders());
    } catch (error) {
      console.error("Erro ao criar configurações da campanha", error);
      throw error;
    }
  },

  // 🔹 6️⃣ Atualizar configurações da campanha
  async updateSettings(campaignId: string, settings: any) {
    try {
      await axios.put(`${API_URL}/campaigns/${campaignId}/settings`, settings, getAuthHeaders());
    } catch (error) {
      console.error("Erro ao atualizar configurações da campanha", error);
      throw error;
    }
  },

  // 🔹 7️⃣ Clonar configurações da campanha
  async cloneLastSettings(campaignId: string) {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/clone-last-settings`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },
};
