"use client";
import React, { useState, useEffect } from "react";
import { sampleOrders } from "@/lib/sampleUserData";
import ProfileSection from "./_components/ProfileSection";
import OrdersSection from "./_components/OrdersSection";
import { PackageIcon, UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";

type TabType = "profile" | "orders";

const AccountPage = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Fetch user profile
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: isAuthenticated,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "orders", label: "Orders", icon: PackageIcon },
  ] as const;

  if (isLoading) {
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
          <p className="text-red-500">Error loading profile. Please try again.</p>
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
        {activeTab === "orders" && <OrdersSection orders={sampleOrders} />}
      </div>
    </main>
  );
};

export default AccountPage;
