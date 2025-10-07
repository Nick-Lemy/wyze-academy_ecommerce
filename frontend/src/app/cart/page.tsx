"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { getProducts, removeFromCart } from "@/lib/api/products";
import { Product } from "@/lib/api/products";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch user profile to get cart
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Filter products that are in cart
  const cartProducts = products?.filter((product) =>
    user?.cart.includes(product._id)
  );

  // Remove from cart mutation
  const removeCartMutation = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to remove from cart";
      alert(errorMessage);
    },
  });

  const handleRemoveFromCart = (productId: string) => {
    removeCartMutation.mutate(productId);
  };

  // Calculate totals
  const subtotal =
    cartProducts?.reduce((sum, product) => sum + product.price, 0) || 0;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const isLoading = userLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Please log in
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your cart
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition font-semibold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            You have {cartProducts.length} item
            {cartProducts.length === 1 ? "" : "s"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((product: Product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    href={`/products/${product._id}`}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={product.image.url}
                      alt={product.title}
                      width={120}
                      height={120}
                      className="object-contain rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${product._id}`}
                      className="font-semibold text-xl text-primary hover:text-primary-hover mb-1 block"
                    >
                      {product.title}
                    </Link>
                    <p className="text-gray-500 text-sm mb-2">
                      {product.miniTitle}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-hover">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(product._id)}
                        disabled={removeCartMutation.isPending}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-sm text-gray-500 italic">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-primary text-white hover:bg-primary-hover py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                onClick={() => alert("Checkout functionality coming soon!")}
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>

              <button
                onClick={() => router.push("/")}
                className="w-full mt-4 text-primary hover:text-primary-hover font-semibold py-2 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
