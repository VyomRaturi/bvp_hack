"use client";

import * as React from "react";
import { FC, useState } from "react";
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
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "reactfire";
import { createUser } from "@/lib/actions/createUser";
import { createUserWithEmailAndPassword } from "firebase/auth";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

interface SignUpFormProps {
  onShowLogin: () => void;
  onSignUp?: () => void;
}

export const SignUpForm: FC<SignUpFormProps> = ({ onShowLogin, onSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const auth = useAuth();

  const signup = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const user = await createUserWithEmailAndPassword(auth, email, password);

      if (user?.user.uid && user.user.email) {
        await createUser(email, password, "user");

        toast({ title: "Account created!" });
      }
    } catch (err: any) {
      if ("code" in err && err.code.includes("already")) {
        toast({ title: "User already exists" });
      } else {
        toast({
          title: "Error signing up",
          description: `${err.message || err}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signup)}>
          <fieldset disabled={isLoading} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign Up</Button>
          </fieldset>
        </form>
      </Form>

      <p className="mt-4 text-sm">
        Already joined?{" "}
        <Button variant="link" onClick={onShowLogin}>
          Sign in instead.
        </Button>
      </p>
    </>
  );
};
