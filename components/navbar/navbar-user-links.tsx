"use client";

import { UserNav } from "@/components/navbar/user-nav";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { FC } from "react";

export const NavbarUserLinks: FC = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return <UserNav />;
};
