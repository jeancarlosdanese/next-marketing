// File: services/campaign.ts

import axios from "axios";
import { Campaign } from "@/types/campaign";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const CampaignService = {
  async getAll(): Promise<Campaign[]> {
    const response = await axios.get(`${API_URL}/campaigns`, getAuthHeaders());
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
};
