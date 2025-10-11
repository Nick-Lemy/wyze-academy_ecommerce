"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { getProducts, removeFromCart, addToCart } from "@/lib/api/products";
import { createOrder } from "@/lib/api/orders";
import { Product } from "@/lib/api/products";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/Breadcrumb";
import { toast } from "sonner";

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

  // Parse cart items and filter products
  const cartItems: Array<{ product: Product; quantity: number }> = [];

  if (user && products) {
    user.cart.forEach((item) => {
      const productId = typeof item === "string" ? item : item.productId;
      const quantity = typeof item === "string" ? 1 : item.quantity;
      const product = products.find((p) => p._id === productId);
      if (product) {
        cartItems.push({ product, quantity });
      }
    });
  }

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to update quantity"
          : "Failed to update quantity";
      toast.error(errorMessage);
    },
  });

  // Remove from cart mutation
  const removeCartMutation = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Item removed from cart");
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to remove from cart";
      toast.error(errorMessage);
    },
  });

  const handleRemoveFromCart = (productId: string) => {
    removeCartMutation.mutate(productId);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: () =>
      createOrder({
        products: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: user?.address || "No address provided",
        totalPrice: total,
      }),
    onSuccess: (data) => {
      // Clear cart items after successful order
      cartItems.forEach((item) => {
        removeCartMutation.mutate(item.product._id);
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Redirect to order confirmation page
      router.push(`/orders/${data.order._id}`);
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to place order";
      toast.error(errorMessage);
    },
  });

  const handleCheckout = () => {
    if (!user?.address) {
      toast.error(
        "Please add a shipping address in your profile before checking out."
      );
      router.push("/account");
      return;
    }
    if (cartItems && cartItems.length > 0) {
      checkoutMutation.mutate();
    }
  };

  // Calculate totals with quantities
  const subtotal =
    cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
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

  if (!cartItems || cartItems.length === 0) {
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
        <Breadcrumb items={[{ label: "Shopping Cart" }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            You have {cartItems.length} item
            {cartItems.length === 1 ? "" : "s"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-white border border-gray-200 rounded p-6 hover:border-gray-300 transition"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product._id}`}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={item.product.image.url}
                      alt={item.product.title}
                      width={120}
                      height={120}
                      className="object-contain rounded"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="font-semibold text-xl text-primary hover:text-primary-hover mb-1 block"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-gray-500 text-sm mb-2">
                      {item.product.miniTitle}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.product.description}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border-2 border-primary rounded">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1 ||
                            updateQuantityMutation.isPending
                          }
                          className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="px-4 font-semibold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          disabled={updateQuantityMutation.isPending}
                          className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-hover">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-sm text-gray-500 ml-2">
                            (${item.product.price.toFixed(2)} each)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.product._id)}
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
            <div className="bg-white border border-gray-200 rounded p-6 sticky top-8">
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
                className="flex w-full items-center justify-center transition"
                onClick={handleCheckout}
                size={"sm"}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-5 ml-2 w-5" />
                  </>
                )}
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
