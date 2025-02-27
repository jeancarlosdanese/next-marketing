// File: services/template.ts

import axios from "axios";
import { Template } from "@/types/template";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const TemplateService = {
  async getByChannel(channel: "email" | "whatsapp"): Promise<Template[]> {
    const response = await axios.get(`${API_URL}/templates?channel=${channel}`, getAuthHeaders());
    return response.data;
  },
};
