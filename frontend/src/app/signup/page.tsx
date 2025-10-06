"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.jpg";
import { useMutation } from "@tanstack/react-query";
import { register, saveAuthData } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const SignUpPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    address?: string;
    confirmPassword?: string;
  }>({});

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Save token and user data to localStorage
      saveAuthData(data.user, data.token);

      // Redirect to account page
      router.push("/account");
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrors({ email: errorMessage });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      address?: string;
      confirmPassword?: string;
    } = {};

    if (!firstName) {
      newErrors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!address) {
      newErrors.address = "Address is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    // Call the register API
    registerMutation.mutate({ firstName, lastName, email, password, address });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image src={Logo} alt="Logo" className="w-20 h-20 rounded-full" />
          </div>
          <h2 className="text-4xl font-bold text-primary mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={errors.address}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-primary transition"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 mt-0.5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary-hover font-semibold"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary-hover font-semibold"
                >
                  Privacy Policy
                </Link>
              </label>
            </div> */}

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary-hover transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
