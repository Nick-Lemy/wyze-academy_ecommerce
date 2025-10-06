import React from "react";
import Logo from "@/assets/logo.jpg";
import Image from "next/image";
import { ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";

const NavBar = () => {
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
      </div>
      <div className="flex  gap-5">
        <LinkItem href="/cart">
          <ShoppingCart className="text-primary size-7" />
        </LinkItem>
        <LinkItem href="/login">
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
