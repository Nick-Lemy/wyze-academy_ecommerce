"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.jpg";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would call an API
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        {/* Newsletter Section */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-600 mb-6">
              Get the latest updates on new products and upcoming sales
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition font-semibold"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-600 mt-3 font-medium">
                Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={Logo} alt="Logo" className="w-10" />
              <span className="text-xl text-primary font-bold">
                Nick&apos;s Shop
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Your trusted destination for quality electronics and gadgets at
              amazing prices.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/favorite"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-primary transition"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>123 E-commerce St, Shopping District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>support@nicksshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Nick&apos;s Shop. All rights
            reserved. Created by Nick-Lemy K.
          </p>
        </div>
      </div>
    </footer>
  );
}
