// File: pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  // Verifica se a página tem um layout customizado
  const getLayout = (Component as any).getLayout || ((page: JSX.Element) => page);

  return (
    <UserProvider>
      {getLayout(<Component {...pageProps} />)}
      <Toaster />
    </UserProvider>
  );
}
