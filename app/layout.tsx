// src/app/layout.tsx
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar/navbar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
