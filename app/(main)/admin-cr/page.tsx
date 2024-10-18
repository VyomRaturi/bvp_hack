"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdmin } from "@/lib/actions/createAdmin"; // Server action

const adminSignupSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password must be at least 8 characters" }),
});

type AdminSignupData = z.infer<typeof adminSignupSchema>;

export default function AdminSignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<AdminSignupData>({
    resolver: zodResolver(adminSignupSchema),
  });

  const onSubmit = async (data: AdminSignupData) => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await createAdmin(data.email, data.password);
      setMessage(result.message);
      console.log(result);
    } catch (error: any) {
      setMessage(error.message || "Error creating admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Create Admin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
          {loading ? "Creating admin..." : "Create Admin"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
}
