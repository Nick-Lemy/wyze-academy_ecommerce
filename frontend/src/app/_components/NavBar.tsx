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
        <Link
          href="/"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          Home
        </Link>
        <Link
          href="/whats-new"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          What&apos;s New
        </Link>
        <Link
          href="/contact"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          Contact
        </Link>
        <Link
          href="/about"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          About
        </Link>
      </div>
      <div className="flex  gap-5">
        <Link
          href="/cart"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          <ShoppingCart className="text-primary size-7" />
        </Link>
        <Link
          href="/account"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          <UserIcon className="size-7 text-primary" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
