import type { Metadata } from "next";
import { Cormorant_Garamond, Kaushan_Script, Merriweather_Sans, Nunito } from "next/font/google";
import Sidebar from "@/components/sidebar";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display" });
const body = Nunito({ subsets: ["latin"], variable: "--font-body" });
const logo = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-logo" });
const symbol = Merriweather_Sans({ subsets: ["latin"], variable: "--font-symbol" });

export const metadata: Metadata = {
  title: "SayKo Bunny",
  description: "Seu diário de bem-estar",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${body.variable} ${logo.variable} ${symbol.variable}`}><Sidebar/>{children}</body></html>;
}
