// File: services/contact.ts

import axios from "axios";
import { Contact } from "@/types/contact";
import { Paginator } from "@/types/paginator";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const ContactService = {
  async getPaginated(
    filters: Record<string, string>,
    page: number,
    perPage: number,
    sort: string
  ): Promise<Paginator<Contact>> {
    const queryParams = new URLSearchParams({
      ...filters,
      page: String(page),
      per_page: String(perPage),
      sort,
    });

    const fullUrl = `${API_URL}/contacts?${queryParams.toString()}`;

    try {
      const response = await axios.get(fullUrl, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Contact> {
    const response = await axios.get(`${API_URL}/contacts/${id}`, getAuthHeaders());
    return response.data;
  },

  async create(contact: Omit<Contact, "id" | "created_at" | "updated_at">) {
    const response = await axios.post(`${API_URL}/contacts`, contact, getAuthHeaders());
    return response.data;
  },

  async update(id: string, contact: Partial<Contact>) {
    const response = await axios.put(`${API_URL}/contacts/${id}`, contact, getAuthHeaders());
    return response.data;
  },

  async delete(id: string) {
    await axios.delete(`${API_URL}/contacts/${id}`, getAuthHeaders());
  },
};
