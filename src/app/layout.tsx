import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Navbar import kiya

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Social App",
  description: "A community for tech enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        {/* Navbar sab se top par */}
        <Navbar />
        
        {/* Main Content (Pages) */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}