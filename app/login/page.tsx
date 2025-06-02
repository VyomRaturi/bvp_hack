// src/app/login/page.tsx

"use client";

import React from "react";
import { SignInForm } from "@/components/SignInForm";

const LoginPage = () => {
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
