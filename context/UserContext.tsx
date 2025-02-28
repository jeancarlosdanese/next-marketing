// File: context/UserContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { UserService } from "@/services/user";
import { useRouter } from "next/router";

type User = {
  email: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    // console.log("🔍 Token lido do localStorage:", token);

    if (!token) {
      // console.warn("❌ Nenhum token encontrado. Redirecionando para login...");
      setUser(null);
      setLoading(false);
      router.push("/auth/login");
      return;
    }

    try {
      const userData = await UserService.getAuthenticatedUser();
      // console.log("✅ Usuário autenticado:", userData);
      setUser(userData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        // console.warn("❌ Token expirado ou inválido. Redirecionando...");
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else {
        console.error("⚠️ Erro ao buscar usuário autenticado", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
