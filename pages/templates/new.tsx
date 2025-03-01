// File: pages/templates/new.tsx

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import TemplateForm from "@/components/templates/TemplateForm";
import Spinner from "@/components/Spinner";

export default function NewTemplatePage() {
  const { user, loading } = useUser();
  const router = useRouter();

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
        <TemplateForm />
      </div>
    </div>
  );
}
