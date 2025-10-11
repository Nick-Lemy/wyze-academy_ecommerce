"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.jpg";
import { useMutation } from "@tanstack/react-query";
import { login, saveAuthData } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Save token and user data to localStorage
      saveAuthData(data.user, data.token);

      // Redirect to account page
      router.push("/account");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ email: errorMessage });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    // Call the login API
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src={Logo} alt="Logo" className="w-20 h-20 rounded" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-primary transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-primary hover:text-primary-hover transition"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:text-primary-hover transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
