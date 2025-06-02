"use client";

import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useUser } from "@/context/UserContext";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export const NavbarMobile = () => {
  const { user } = useUser();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="-mr-4">
            <MenuIcon />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex flex-col p-1">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Home
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost" })}
              >
                Dashboard
              </Link>
            )}

            <div className="flex flex-col mb-0.5">
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
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
