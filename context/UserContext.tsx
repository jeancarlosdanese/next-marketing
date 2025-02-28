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
};

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await UserService.getAuthenticatedUser();
        if (!userData) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário autenticado", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
