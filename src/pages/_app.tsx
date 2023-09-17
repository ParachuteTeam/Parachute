import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";

import { api } from "../utils/api";

import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <main className={`${inter.variable} font-inter`}>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
