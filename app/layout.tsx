// src/app/layout.tsx
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { Footer } from "@/components/footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
