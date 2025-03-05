// File: services/template.ts

import axios from "axios";
import { Template } from "@/types/template";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const TemplateService = {
  async getByChannel(channel: "email" | "whatsapp"): Promise<Template[]> {
    const response = await axios.get(`${API_URL}/templates?channel=${channel}`, getAuthHeaders());
    return response.data;
  },

  async getAllTemplates(): Promise<Template[]> {
    const response = await axios.get(`${API_URL}/templates`, getAuthHeaders());
    return response.data;
  },

  async getById(id: string): Promise<Template> {
    const response = await axios.get(`${API_URL}/templates/${id}`, getAuthHeaders());
    return response.data;
  },

  async create(data: { name: string; description?: string; channel: "email" | "whatsapp" }) {
    await axios.post(`${API_URL}/templates`, data, getAuthHeaders());
  },

  async update(id: string, contact: Partial<Template>) {
    const response = await axios.put(`${API_URL}/templates/${id}`, contact, getAuthHeaders());
    return response.data;
  },

  async delete(id: string) {
    await axios.delete(`${API_URL}/templates/${id}`, getAuthHeaders());
  },

  async uploadTemplate(id: string, file: File, type: "email" | "whatsapp") {
    if (!file) {
      toast.info("Selecione um arquivo para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // 🔹 Garantindo que a URL esteja correta
    const url = `${API_URL}/templates/${id}/${type}/upload`.replace(/([^:]\/)\/+/g, "$1");

    try {
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Arquivo enviado com sucesso!");
      return response.data;
    } catch (error) {
      toast.error("Erro ao fazer upload");
      console.error("❌ Erro ao fazer upload:", error);
      throw error;
    }
  },
};
