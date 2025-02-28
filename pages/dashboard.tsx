// File: pages/dashboard.tsx

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [campaigns, setCampaigns] = useState([]);
  const router = useRouter();

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns?status=ativa`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Erro ao carregar campanhas", error));
  }, [loading, user]);

  if (loading) return <Spinner />; // 🔹 Agora o spinner está fora do retorno condicional do React
  if (!user) return null; // 🔹 Evita exibição de conteúdo antes do redirecionamento

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="w-full p-4 bg-card shadow-lg">
            <h3 className="text-lg font-semibold">Campanhas Ativas</h3>
            <p className="text-2xl font-bold">{campaigns?.length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
