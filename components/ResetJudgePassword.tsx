"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export const ResetJudgePassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter the judge's email",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/reset-judge-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast({
        title: "Success!",
        description: `Password reset successful. New password: ${data.newPassword}`,
      });

      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Enter judge's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button onClick={handleReset} disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </div>
  );
};
