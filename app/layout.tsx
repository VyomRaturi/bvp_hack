// src/app/layout.tsx
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { NavBar } from "@/components/navbar/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackathon Platform",
  description: "A platform for managing hackathons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <NavBar />
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
