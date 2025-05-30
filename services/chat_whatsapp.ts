// File: services/chat_whatsapp.ts

import { ChatContactFull } from "@/types/chat_contact";
import { ChatMessageCreateDTO } from "@/types/chat_message_create_dto";
import { ChatMessage } from "@/types/chat_messages";
import { Chat, ChatCreateDTO, SessionStatusDTO } from "@/types/chats";
import { RespostaIA } from "@/types/resposta_ai";
import { getValidSessionStatusKey } from "@/utils/sessionStatusIcons";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export const ChatWhatsAppService = {
  async criarChat(payload: ChatCreateDTO): Promise<void> {
    await axios.post(`${API_URL}/chats`, payload, getAuthHeaders());
  },

  async listarChats(): Promise<Chat[]> {
    const response = await axios.get<Chat[]>(`${API_URL}/chats`, getAuthHeaders());

    return response.data;
  },

  async buscarChat(chatId: string): Promise<Chat> {
    const response = await axios.get(`${API_URL}/chats/${chatId}`, getAuthHeaders());
    return response.data;
  },

  async atualizarChat(chatId: string, payload: ChatCreateDTO): Promise<void> {
    await axios.put(`${API_URL}/chats/${chatId}`, payload, getAuthHeaders());
  },

  async iniciarSessao(chatId: string): Promise<void> {
    await axios.post(`${API_URL}/chats/${chatId}/session-start`, {}, getAuthHeaders());
  },

  async obterQrCode(chatId: string): Promise<string> {
    const response = await axios.get(`${API_URL}/chats/${chatId}/qrcode`, getAuthHeaders());
    return response.data.qrCode; // base64 string
  },

  async listarChatContacts(chatId: string): Promise<ChatContactFull[]> {
    const response = await axios.get(`${API_URL}/chats/${chatId}/chat-contacts`, getAuthHeaders());
    console.log("Contatos obtidos:", response.data);

    return response.data;
  },

  async listarMensagens(chatId: string, chatContactId: string): Promise<ChatMessage[]> {
    const response = await axios.get(
      `${API_URL}/chats/${chatId}/chat-contacts/${chatContactId}/messages`,
      getAuthHeaders()
    );
    return response.data;
  },

  async verificarStatusSessao(chatId: string): Promise<SessionStatusDTO> {
    const response = await axios.get(`${API_URL}/chats/${chatId}/status`, getAuthHeaders());

    return mapApiStatusToSessionStatus(response.data);
  },

  async enviarMensagem(
    chatId: string,
    chatContactId: string,
    payload: ChatMessageCreateDTO
  ): Promise<ChatMessage> {
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/chat-contacts/${chatContactId}/messages`,
      payload,
      getAuthHeaders()
    );
    return response.data;
  },

  async sugestaoRespostaAI(
    message: string,
    chatContactId: string,
    chatId: string
  ): Promise<string> {
    try {
      const response = await axios.post<RespostaIA>(
        `${API_URL}/chats/${chatId}/chat-contacts/${chatContactId}/suggestion-ai`,
        {
          message,
        },
        getAuthHeaders()
      );
      return response.data.suggestion_ai;
    } catch (error) {
      console.error("Erro ao sugerir resposta:", error);
      return "Desculpe, não consegui gerar uma resposta.";
    }
  },
};

// Mapear o status da API para o formato esperado
function mapApiStatusToSessionStatus(raw: any): SessionStatusDTO {
  return {
    status: getValidSessionStatusKey(raw.status),
    connected: raw.connected,
    qrCodeAvailable: raw.qrCodeAvailable,
    qrCode: raw.qrCode,
    message: raw.message,
  };
}
