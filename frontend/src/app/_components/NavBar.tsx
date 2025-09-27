import React from "react";
import Logo from "@/assets/logo.jpg";
import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white">
      <div className="flex gap-1 items-center">
        <Image src={Logo} alt="Logo" className="w-12 mr-2" />
        <span className="text-lg text-primary font-bold">Nick&apos;s Shop</span>
      </div>
      <div className="space-x-4">
        <a
          href="#"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          Home
        </a>
        <a
          href="#"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          Shop
        </a>
        <a
          href="#"
          className="text-primary/70 hover:text-primary font-semibold"
        >
          About
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
