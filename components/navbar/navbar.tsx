"use client";

import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import { useUser } from "@/context/UserContext";

export const NavBar: FC = () => {
  const { user } = useUser();

  return (
    <div className="animate-in fade-in w-full">
      <nav className="container px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div className="flex flex-col items-center">
              <Image alt="logo" height={50} width={50} src="/Latentlogo.png" />
              <span className="font-semibold tracking-tighter mx-auto text-slate-800"></span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Dashboard
                </Link>
              </>
            )}
            <div className="ml-4">
              {user ? (
                <NavbarUserLinks />
              ) : (
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "default" })}
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavbarMobile />
          </div>
        </div>
      </nav>
    </div>
  );
};
