import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  );
}
