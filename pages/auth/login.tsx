// File: pages/auth/login.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const loginSchema = z.object({
  identifier: z.string().min(5, "Informe seu e-mail ou WhatsApp"),
});

const otpSchema = z
  .string()
  .length(8, "O OTP deve ter exatamente 8 dígitos.")
  .regex(/^\d+$/, "O OTP deve conter apenas números.");

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(""); // 🔹 Estado para armazenar o OTP digitado
  const { refreshUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const sendOTP = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-otp`, data);
      setIdentifier(data.identifier);
      setOtpSent(true);
      toast.success("Código OTP enviado!");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Erro ao solicitar OTP. Verifique seus dados.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Função para verificar o OTP
  const verifyOTP = async (otpValue?: string) => {
    const otpToValidate = otpValue || otp;

    const validation = otpSchema.safeParse(otpToValidate);

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        identifier,
        otp: otpToValidate,
      });

      localStorage.setItem("token", response.data.token);
      await refreshUser();
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || "Código inválido. Tente novamente.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar OTP"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                Digite o código enviado para <strong>{identifier}</strong>
              </p>

              {/* InputOTP com verificação automática */}
              <InputOTP
                maxLength={8}
                value={otp}
                onChange={(value) => {
                  if (/^\d*$/.test(value)) {
                    setOtp(value);
                    if (value.length === 8) {
                      verifyOTP(value);
                    }
                  }
                }}
              >
                <InputOTPGroup className="flex gap-1 sm:gap-2 justify-center w-full max-w-md">
                  {[...Array(8)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button
                onClick={() => verifyOTP()}
                className="w-full"
                disabled={isLoading || otp.length < 8}
              >
                {isLoading ? "Verificando..." : "Confirmar Código"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
