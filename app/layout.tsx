// src/app/layout.tsx
import './globals.css'
import { UserProvider } from "@/context/UserContext";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='px-28 py-16'>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
