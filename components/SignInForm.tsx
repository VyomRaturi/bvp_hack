"use client";

import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 1 character"),
});

interface SignInFormProps {}

export const SignInForm: React.FC<SignInFormProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();

  const login = async ({ email, password }: z.infer<typeof formSchema>) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log("Starting login process...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Login successful, refreshing user context...");
      await refreshUser();
      console.log("User context refreshed, showing success message...");

      toast({
        title: "Success!",
        description: "You have been logged in.",
      });

      // Navigate to dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error Logging In",
        description:
          error instanceof Error ? error.message : "Failed to log in.",
        variant: "destructive",
      });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(login)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  {...field}
                  disabled={isLoading}
                  className="border rounded p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  disabled={isLoading}
                  className="border rounded p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Logging In..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};
