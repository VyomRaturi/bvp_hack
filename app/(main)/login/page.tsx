// src/app/login/page.tsx

"use client";

import React from "react";
import { SignInForm } from "@/components/SignInForm"; // Ensure the path is correct
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Ensure the path is correct
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast"; // Ensure the path is correct

const LoginPage = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to the dashboard or desired page
      router.push("/dashboard");
      toast({
        title: "Already Logged In",
        description: "You are already logged in.",
      });
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <SignInForm />
      </div>
    </div>
  );
};

export default LoginPage;
