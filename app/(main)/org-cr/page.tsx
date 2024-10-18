// src/components/OrganizerCreationForm.tsx

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
import { FC, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createOrganizer } from "@/lib/actions/createOrganizer"; // Import the server action

const formSchema = z.object({
    name : z.string().min(1,"Please enter your name"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface OrganizerCreationFormProps {
  // You can add props if needed
}

const OrganizerCreationForm: FC<OrganizerCreationFormProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name  : "",
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const createOrganizerHandler = async ({
    name,
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Call the server action to create an organizer
      await createOrganizer(name,email, password);
      toast({
        title: "Success!",
        description: "Organizer account created successfully.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error Creating Organizer",
        description: `Failed to create organizer: ${error.message || error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="  items-center justify-center w-1/2 mx-auto border ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createOrganizerHandler)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    {...field}
                    className="border rounded p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="organizer@example.com"
                    {...field}
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
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            {isLoading ? "Creating Organizer..." : "Create Organizer"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrganizerCreationForm
