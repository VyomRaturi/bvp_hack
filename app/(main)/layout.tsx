"use client";

// import { Footer } from "@/components/footer";
// import { NavBar } from "@/components/navbar/navbar";
import { isAuthenticated } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const Router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      Router.push("/login");
    }
    setLoading(false);
  }, []);
  return loading ? (
    <Loader2 className="w-10 h-10" />
  ) : (
    <div className="flex flex-col animate-in fade-in">
      {/* <NavBar /> */}
      <div className="flex flex-col grow h-full">{children}</div>
      {/* <Footer /> */}
    </div>
  );
}
