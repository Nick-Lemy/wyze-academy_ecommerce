"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import {
  Package,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock orders data - in real app, this would come from API
const mockOrders = [
  {
    _id: "1",
    orderNumber: "ORD-2024-001",
    userId: "user1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    status: "pending",
    totalPrice: 299.99,
    createdAt: "2024-10-11T10:00:00Z",
    products: [
      { productId: "p1", title: "iPhone 15 Pro", quantity: 1, price: 299.99 },
    ],
  },
  {
    _id: "2",
    orderNumber: "ORD-2024-002",
    userId: "user2",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "shipped",
    totalPrice: 159.99,
    createdAt: "2024-10-10T15:30:00Z",
    products: [
      {
        productId: "p2",
        title: "Wireless Headphones",
        quantity: 1,
        price: 159.99,
      },
    ],
  },
  {
    _id: "3",
    orderNumber: "ORD-2024-003",
    userId: "user3",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    status: "delivered",
    totalPrice: 89.99,
    createdAt: "2024-10-09T09:15:00Z",
    products: [
      { productId: "p3", title: "Smart Watch", quantity: 1, price: 89.99 },
    ],
  },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Check if user is admin
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // In real app, fetch orders from API
  const orders = mockOrders;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Orders Management
            </h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <OrderStatsCard
            title="Total Orders"
            value="1,234"
            icon={<Package className="h-5 w-5" />}
            color="blue"
          />
          <OrderStatsCard
            title="Pending"
            value="23"
            icon={<Clock className="h-5 w-5" />}
            color="yellow"
          />
          <OrderStatsCard
            title="Processing"
            value="45"
            icon={<RefreshCw className="h-5 w-5" />}
            color="blue"
          />
          <OrderStatsCard
            title="Completed"
            value="1,166"
            icon={<CheckCircle className="h-5 w-5" />}
            color="green"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Orders ({filteredOrders.length})
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Orders will appear here when customers place them."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Order Stats Card Component
function OrderStatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "green" | "red";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Order Row Component
function OrderRow({ order }: { order: (typeof mockOrders)[0] }) {
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {order.orderNumber}
          </div>
          <div className="text-sm text-gray-500">
            {order.products.length} item{order.products.length !== 1 ? "s" : ""}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {order.customerName}
          </div>
          <div className="text-sm text-gray-500">{order.customerEmail}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <span
            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${order.totalPrice.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => router.push(`/admin/orders/${order._id}`)}
          className="text-indigo-600 hover:text-indigo-900 p-1"
          title="View Order Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
