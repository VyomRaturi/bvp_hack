"use client";

import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import { isAuthenticated } from "@/lib/auth";

export const NavBar: FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);
  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex flex-col items-center">
                <Image
                  alt="logo"
                  height={50}
                  width={50}
                  src="/Latentlogo.png"
                />
                <span className="font-semibold tracking-tighter mx-auto text-slate-800"></span>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <div>
                <Link href="/" className={buttonVariants({ variant: "link" })}>
                  Home
                </Link>
                {/* {authenticated && (
                  <>
                    <Link href="#2" className={buttonVariants({ variant: "link" })}>
                      Team Dashboard
                    </Link>
                    <Link href="#3" className={buttonVariants({ variant: "link" })}>
                      Judge Dashboard
                    </Link>
                  </>
                )} */}
              </div>
              {authenticated ? (
                <LogoutButton />
              ) : (
                <Link
                  href="/login"
                  className="px-5 pt-1 pb-2 flex items-center justify-center text-white rounded-xl bg-primary"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
