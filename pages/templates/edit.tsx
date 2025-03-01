// File: pages/templates/[id]/edit.tsx

import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import TemplateForm from "@/components/templates/TemplateForm";
import Spinner from "@/components/Spinner";

export default function EditTemplatePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = router.query; // Obtém o ID do template

  if (loading) return <p>Carregando...</p>;
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <TemplateForm id={id as string} />
      </div>
    </div>
  );
}
