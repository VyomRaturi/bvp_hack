// src/app/login/page.tsx

"use client";

import React from "react";
import { SignInForm } from "@/components/SignInForm";
import { ResetJudgePassword } from "@/components/ResetJudgePassword";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <SignInForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Reset Judge Password
            </span>
          </div>
        </div>
        <ResetJudgePassword />
      </div>
    </div>
  );
};

export default LoginPage;
