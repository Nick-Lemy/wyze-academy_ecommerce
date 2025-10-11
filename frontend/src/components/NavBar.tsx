"use client";
import React from "react";
import Logo from "@/assets/logo.jpg";
import Image from "next/image";
import { ShoppingCart, UserIcon, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";

const NavBar = () => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  // Fetch user profile to get cart and favorites count
  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: mounted && isAuthenticated,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate cart count properly for both old and new cart formats
  const cartCount =
    user?.cart?.reduce((count, item) => {
      if (typeof item === "string") return count + 1;
      return count + (item.quantity || 1);
    }, 0) || 0;

  const favoritesCount = user?.favorites?.length || 0;

  return (
    <nav className="flex items-center justify-between bg-white">
      <div className="flex gap-1 items-center">
        <Image src={Logo} alt="Logo" className="w-12 mr-2" />
        <span className="text-lg text-primary font-bold">Nick&apos;s Shop</span>
      </div>
      <div className="space-x-4">
        <LinkItem href="/" text="Home" />
        <LinkItem href="/favorite" text="Favorite" />
        <LinkItem href="/contact" text="Contact" />
        <LinkItem href="/about" text="About" />
        {mounted && user?.role === "admin" && (
          <LinkItem href="/admin" text="Admin" />
        )}
      </div>
      <div className="flex  gap-5">
        <LinkItem href="/favorite">
          <div className="relative">
            <Heart className="text-primary size-7" />
            {mounted && favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
        </LinkItem>
        <LinkItem href="/cart">
          <div className="relative">
            <ShoppingCart className="text-primary size-7" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </LinkItem>
        <LinkItem href={mounted && isAuthenticated ? "/account" : "/login"}>
          <UserIcon className="size-7 text-primary" />
        </LinkItem>
      </div>
    </nav>
  );
};

const LinkItem = ({
  href,
  text,
  children,
}: {
  href: string;
  text?: string;
  children?: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-primary hover:text-primary-hover font-semibold"
  >
    {text ? text : children}
  </Link>
);

export default NavBar;
