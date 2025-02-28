// File: pages/auth/login.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useUser } from "@/context/UserContext"; // 🔹 Importar o contexto do usuário
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  identifier: z.string().min(5, "Informe seu e-mail ou WhatsApp"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(""); // 🔹 Estado para armazenar o OTP digitado
  const { refreshUser } = useUser(); // 🔹 Atualizar o usuário após login
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const sendOTP = async (data: LoginForm) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-otp`, data);
      setIdentifier(data.identifier);
      setOtpSent(true);
    } catch (error) {
      console.error("Erro ao solicitar OTP", error);
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        identifier,
        otp,
      });

      localStorage.setItem("token", response.data.token);
      await refreshUser(); // 🔹 Atualiza o usuário no contexto global
      router.push("/dashboard"); // 🔹 Redireciona para o Dashboard
    } catch (error) {
      console.error("Erro ao verificar OTP", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSubmit(sendOTP)} className="space-y-4">
              <Input {...register("identifier")} placeholder="E-mail ou WhatsApp" />
              {errors.identifier && (
                <p className="text-red-500 text-sm">{errors.identifier.message}</p>
              )}
              <Button type="submit" className="w-full">
                Enviar OTP
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Digite o OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button onClick={verifyOTP} className="w-full">
                Confirmar Código
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
