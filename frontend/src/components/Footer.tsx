import React from "react";
import Logo from "@/assets/logo.jpg";
import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="px-20 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex gap-2 items-center mb-4">
              {/* <Image src={Logo} alt="Logo" className="w-12" /> */}
              <span className="text-xl font-bold">Nick&apos;s Shop</span>
            </div>
            <p className="text-white/80 mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex qui,
              odio facere minus quam quidem et nesciunt. Velit, aspernatur quae!
              Officiis repellendus itaque ab, nisi sint at doloribus ducimus
              repellat!
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/whats-new"
                  className="text-white/80 hover:text-secondary transition"
                >
                  What&apos;s New
                </Link>
              </li>
              <li>
                <Link
                  href="/favorite"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-secondary transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/account"
                  className="text-white/80 hover:text-secondary transition"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-secondary mt-0.5" />
                <span className="text-white/80">
                  123 Shopping Street
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-secondary" />
                <a
                  href="tel:+15551234567"
                  className="text-white/80 hover:text-secondary transition"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-5 w-5 text-secondary" />
                <a
                  href="mailto:support@nicksshop.com"
                  className="text-white/80 hover:text-secondary transition"
                >
                  support@nicksshop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-white/80 mb-4">
              Get the latest updates on new products and special offers
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © {currentYear} Nick&apos;s Shop. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-white/70 hover:text-secondary transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-secondary transition"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-secondary transition"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
