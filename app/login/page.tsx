// src/app/login/page.tsx

"use client";

import React from "react";
import { SignInForm } from "@/components/SignInForm"; // Ensure the path is correct
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Ensure the path is correct
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast"; // Ensure the path is correct
import { isAuthenticated } from "@/lib/auth";

const LoginPage = () => {
  const router = useRouter();

  if (isAuthenticated()) {
    router.push("/organizer");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        <SignInForm />
      </div>
    </div>
  );
};

export default LoginPage;
