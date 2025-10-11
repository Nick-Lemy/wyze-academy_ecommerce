"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  // Check if user is admin
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user.username}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value="$12,345"
            icon={<TrendingUp className="h-6 w-6" />}
            trend="+12%"
            trendUp={true}
          />
          <StatsCard
            title="Total Orders"
            value="1,234"
            icon={<ShoppingCart className="h-6 w-6" />}
            trend="+5%"
            trendUp={true}
          />
          <StatsCard
            title="Products"
            value="156"
            icon={<Package className="h-6 w-6" />}
            trend="+2"
            trendUp={true}
          />
          <StatsCard
            title="Users"
            value="89"
            icon={<Users className="h-6 w-6" />}
            trend="+8%"
            trendUp={true}
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <QuickActionButton
                  label="Manage Products"
                  icon={<Package className="h-5 w-5" />}
                  onClick={() => router.push("/admin/products")}
                />
                <QuickActionButton
                  label="View Orders"
                  icon={<ShoppingCart className="h-5 w-5" />}
                  onClick={() => router.push("/admin/orders")}
                />
                <QuickActionButton
                  label="Manage Users"
                  icon={<Users className="h-5 w-5" />}
                  onClick={() => router.push("/admin/users")}
                />
                <QuickActionButton
                  label="Back to Store"
                  icon={<BarChart3 className="h-5 w-5" />}
                  onClick={() => router.push("/")}
                />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Orders
              </h2>
              <div className="space-y-3">
                <RecentOrderItem
                  orderNumber="ORD-001"
                  customer="John Doe"
                  amount="$299.99"
                  status="pending"
                />
                <RecentOrderItem
                  orderNumber="ORD-002"
                  customer="Jane Smith"
                  amount="$159.99"
                  status="shipped"
                />
                <RecentOrderItem
                  orderNumber="ORD-003"
                  customer="Bob Johnson"
                  amount="$89.99"
                  status="delivered"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sales Overview
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="h-16 w-16" />
              <span className="ml-2">
                Chart will be implemented with a charting library
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status Distribution
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="h-16 w-16" />
              <span className="ml-2">
                Pie chart will be implemented with a charting library
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div
          className={`text-sm font-medium ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend}
        </div>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <span className="text-primary mr-3">{icon}</span>
      {label}
    </button>
  );
}

// Recent Order Item Component
function RecentOrderItem({
  orderNumber,
  customer,
  amount,
  status,
}: {
  orderNumber: string;
  customer: string;
  amount: string;
  status: string;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "shipped":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        {getStatusIcon(status)}
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{orderNumber}</p>
          <p className="text-sm text-gray-500">{customer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{amount}</p>
        <p className="text-sm text-gray-500 capitalize">{status}</p>
      </div>
    </div>
  );
}
