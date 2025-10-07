"use client";
import React, { useState, useEffect, useMemo } from "react";
import ProfileSection from "./_components/ProfileSection";
import OrdersSection from "./_components/OrdersSection";
import { PackageIcon, UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { getMyOrders } from "@/lib/api/orders";
import { getProducts } from "@/lib/api/products";
import { Order as UIOrder } from "@/app/types/user";

type TabType = "profile" | "orders";

const AccountPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Fetch user profile
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: isAuthenticated,
  });

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
    enabled: isAuthenticated,
  });

  // Fetch all products to get product details for orders
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: isAuthenticated && orders.length > 0,
  });

  // Map backend orders to UI format
  const mappedOrders: UIOrder[] = useMemo(() => {
    return orders.map((order) => ({
      id: order._id,
      orderNumber: `ORD-${order._id.slice(-8).toUpperCase()}`,
      items: order.products.map((product) => {
        const productDetails = products.find(
          (p) => p._id === product.productId
        );
        return {
          id: product.productId,
          productId: product.productId,
          productTitle: productDetails?.title || "Unknown Product",
          productImage: productDetails?.image.url || "/placeholder.png",
          quantity: product.quantity,
          price: productDetails?.price || 0,
        };
      }),
      totalAmount: order.totalPrice,
      status:
        order.status === "paid"
          ? "pending"
          : order.status === "received"
          ? "delivered"
          : order.status === "shipping"
          ? "shipped"
          : (order.status as UIOrder["status"]),
      orderDate: order.createdAt,
      deliveryDate: order.status === "received" ? order.updatedAt : undefined,
      shippingAddress: {
        street: order.shippingAddress,
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    }));
  }, [orders, products]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "orders", label: "Orders", icon: PackageIcon },
  ] as const;

  if (authLoading || isLoading || ordersLoading) {
    return (
      <main className="my-5 space-y-3">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Account</h1>
          <p className="text-gray-700">Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="my-5 space-y-3">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Account</h1>
          <p className="text-red-500">
            Error loading profile. Please try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="my-5 space-y-3">
      {/* Header */}
      <div className="p-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">My Account</h1>
          <p className="text-gray-700">View your profile and order history</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 cursor-pointer flex items-center ease-in-out text-primary transform duration-300 justify-center gap-2 py-4 px-6 font-semibold transition ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary-hover"
                    : "text-primary hover:border-b-2 hover:border-primary-hover"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-8">
        {activeTab === "profile" && <ProfileSection user={user} />}
        {activeTab === "orders" && <OrdersSection orders={mappedOrders} />}
      </div>
    </main>
  );
};

export default AccountPage;
