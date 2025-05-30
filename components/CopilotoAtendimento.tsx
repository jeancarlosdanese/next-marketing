// components/CopilotoAtendimento.tsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, X, Pencil } from "lucide-react";
import axios from "axios";

export const CopilotoAtendimento = () => {
  const [mensagemCliente, setMensagemCliente] = useState("");
  const [sugestao, setSugestao] = useState("");
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState("");
  const [loading, setLoading] = useState(false);

  const sugestaoRespostaAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/copiloto/sugerir-resposta", {
        mensagem: mensagemCliente,
        nome: "João Silva",
        contrato: "100058520",
      });
      setSugestao(response.data.resposta_sugerida);
    } catch (error) {
      console.error("Erro ao sugerir resposta:", error);
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setMensagemCliente("");
    setSugestao("");
    setTextoEditado("");
    setEditando(false);
  };

  const enviarMensagem = () => {
    const final = editando ? textoEditado : sugestao;
    alert("Mensagem enviada:\n\n" + final);
    limpar();
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Copiloto de Atendimento</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          placeholder="Digite a mensagem recebida do cliente..."
          value={mensagemCliente}
          onChange={(e) => setMensagemCliente(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={sugestaoRespostaAI} disabled={loading || !mensagemCliente}>
            <Sparkles className="w-4 h-4 mr-1" />
            Sugerir Resposta
          </Button>
          <Button variant="secondary" onClick={limpar}>
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        </div>

        {sugestao && !editando && (
          <div className="bg-gray-100 p-4 rounded shadow-inner">
            <p className="text-sm text-muted-foreground mb-2">Resposta sugerida:</p>
            <p className="font-medium whitespace-pre-line">{sugestao}</p>
            <div className="flex justify-end mt-4 gap-2">
              <Button size="sm" onClick={enviarMensagem}>
                <Send className="w-4 h-4 mr-1" /> Enviar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setTextoEditado(sugestao);
                  setEditando(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-1" /> Editar
              </Button>
            </div>
          </div>
        )}

        {editando && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded shadow-inner">
            <p className="text-sm text-muted-foreground mb-2">Edite a resposta antes de enviar:</p>
            <Textarea
              value={textoEditado}
              onChange={(e) => setTextoEditado(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={enviarMensagem} disabled={!textoEditado.trim()}>
                <Send className="w-4 h-4 mr-1" /> Enviar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
