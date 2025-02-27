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
};
