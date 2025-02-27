// File: pages/dashboard.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [campaigns, setCampaigns] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // 🔍 Buscar dados do usuário
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch(() => router.push("/auth/login"));

    // 🔍 Buscar campanhas ativas
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns?status=ativa`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Erro ao carregar campanhas", error));
  }, [router]);

  if (!user) return <p>Carregando...</p>;

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
