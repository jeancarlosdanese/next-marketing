// File: services/contact.ts

import axios from "axios";
import { Contact } from "@/types/contact";
import { Paginator } from "@/types/paginator";
import { toast } from "sonner";
import { ContactImportConfig } from "@/types/contact";
import { log } from "console";

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

  async getImports() {
    try {
      const response = await axios.get(`${API_URL}/contacts/imports`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar importações:", error);
      throw error;
    }
  },

  /** 📌 Método para importar contatos via CSV */
  async importContacts(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await axios.post(`${API_URL}/contacts/import`, formData, { headers });
      return response.data; // Retorna import_id e preview
    } catch (error) {
      toast.error("Erro ao importar contatos");
      console.error("❌ Erro ao importar contatos:", error);
      throw error;
    }
  },

  // 🔹 Método para buscar uma importação de contatos pelo ID
  async getImportById(importId: string) {
    try {
      const response = await axios.get(`${API_URL}/contacts/imports/${importId}`, getAuthHeaders());

      console.log("response.data", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar importação:", error);
      throw error;
    }
  },

  // 🔹 Método para atualizar a configuração de uma importação
  async updateImportConfig(importId: string, config: ContactImportConfig) {
    try {
      const response = await axios.put(
        `${API_URL}/contacts/imports/${importId}`,
        config, // Envia o objeto diretamente, sem envolver em { config }
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao atualizar configuração da importação:", error);
      throw error;
    }
  },

  // 🔹 Método para iniciar o processamento de uma importação
  startImport: async (importId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/contacts/imports/${importId}/start`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao iniciar processamento:", error);
      throw error;
    }
  },

  // 🔹 Método para deletar uma importação de contatos
  async deleteImport(importId: string) {
    try {
      const response = await axios.delete(
        `${API_URL}/contacts/imports/${importId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao deletar importação:", error);
      throw error;
    }
  },
};
