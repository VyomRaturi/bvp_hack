"use client";

// import { Footer } from "@/components/footer";
// import { NavBar } from "@/components/navbar/navbar";
import { isAuthenticated } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const authenticated = await isAuthenticated();
        console.log("Authentication result:", authenticated);

        if (!authenticated) {
          console.log("Not authenticated, redirecting to login...");
          router.replace("/login");
          return;
        }

        setIsAuth(true);
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="flex flex-col animate-in fade-in">
      {/* <NavBar /> */}
      <div className="flex flex-col grow h-full">{children}</div>
      {/* <Footer /> */}
    </div>
  );
}
