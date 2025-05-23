// File: services/chat_whatsapp.ts

import { ChatContactResumo } from "@/types/chat_contact_resumo";
import { ChatMessageCreateDTO } from "@/types/chat_message_create_dto";
import { ChatMessage } from "@/types/chat_messages";
import { Chat, ChatCreateDTO } from "@/types/chats";
import { RespostaIA } from "@/types/resposta_ai";
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
    await axios.post(`${API_URL}/chats/${chatId}/iniciar-sessao`, {}, getAuthHeaders());
  },

  async obterQrCode(chatId: string): Promise<string> {
    const response = await axios.get(`${API_URL}/chats/${chatId}/qrcode`, getAuthHeaders());
    return response.data.qrCode; // base64 string
  },

  async listarContatos(chatId: string): Promise<ChatContactResumo[]> {
    const response = await axios.get(`${API_URL}/chats/${chatId}/contatos`, getAuthHeaders());
    return response.data;
  },

  async listarMensagens(chatId: string, contactId: string): Promise<ChatMessage[]> {
    const response = await axios.get(
      `${API_URL}/chats/${chatId}/contatos/${contactId}/mensagens`,
      getAuthHeaders()
    );
    return response.data;
  },

  async enviarMensagem(
    chatId: string,
    contactId: string,
    payload: ChatMessageCreateDTO
  ): Promise<ChatMessage> {
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/contatos/${contactId}/mensagens`,
      payload,
      getAuthHeaders()
    );
    return response.data;
  },

  async sugerirResposta(mensagem: string, contactId: string, chatId: string): Promise<string> {
    try {
      const response = await axios.post<RespostaIA>(
        `${API_URL}/chat/sugerir-resposta`,
        {
          chat_id: chatId,
          contact_id: contactId,
          mensagem,
        },
        getAuthHeaders()
      );
      return response.data.resposta_sugerida;
    } catch (error) {
      console.error("Erro ao sugerir resposta:", error);
      return "Desculpe, não consegui gerar uma resposta.";
    }
  },
};
