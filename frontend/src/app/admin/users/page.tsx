"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock users data - in real app, this would come from API
const mockUsers = [
  {
    _id: "1",
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-09-15T10:00:00Z",
    lastLogin: "2024-10-11T08:30:00Z",
    orderCount: 5,
    totalSpent: 1299.95,
  },
  {
    _id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-08-22T15:30:00Z",
    lastLogin: "2024-10-10T16:45:00Z",
    orderCount: 12,
    totalSpent: 2458.3,
  },
  {
    _id: "3",
    username: "admin_user",
    email: "admin@example.com",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-10T09:00:00Z",
    lastLogin: "2024-10-11T07:00:00Z",
    orderCount: 0,
    totalSpent: 0,
  },
  {
    _id: "4",
    username: "suspended_user",
    email: "suspended@example.com",
    role: "user",
    isActive: false,
    createdAt: "2024-07-05T12:00:00Z",
    lastLogin: "2024-09-20T11:30:00Z",
    orderCount: 2,
    totalSpent: 199.99,
  },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Check if user is admin
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // In real app, fetch users from API
  const users = mockUsers;

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
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
              Users Management
            </h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <UserStatsCard
            title="Total Users"
            value={users.length.toString()}
            icon={<Users className="h-5 w-5" />}
            color="blue"
          />
          <UserStatsCard
            title="Active Users"
            value={users.filter((u) => u.isActive).length.toString()}
            icon={<CheckCircle className="h-5 w-5" />}
            color="green"
          />
          <UserStatsCard
            title="Admin Users"
            value={users.filter((u) => u.role === "admin").length.toString()}
            icon={<ShieldCheck className="h-5 w-5" />}
            color="purple"
          />
          <UserStatsCard
            title="Suspended"
            value={users.filter((u) => !u.isActive).length.toString()}
            icon={<Ban className="h-5 w-5" />}
            color="red"
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({filteredUsers.length})
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <UserRow key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                {searchTerm ||
                selectedRole !== "all" ||
                selectedStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Users will appear here when they register."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// User Stats Card Component
function UserStatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "red";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
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

// User Row Component
function UserRow({ user }: { user: (typeof mockUsers)[0] }) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case "user":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.username}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getRoleIcon(user.role)}
          <span
            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Active" : "Suspended"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.orderCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${user.totalSpent.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(user.lastLogin).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => {
              // Edit user modal will be implemented
              console.log("Edit user:", user._id);
            }}
            className="text-indigo-600 hover:text-indigo-900 p-1"
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              // Toggle user status
              console.log("Toggle user status:", user._id);
            }}
            className={`p-1 ${
              user.isActive
                ? "text-red-600 hover:text-red-900"
                : "text-green-600 hover:text-green-900"
            }`}
            title={user.isActive ? "Suspend User" : "Activate User"}
          >
            {user.isActive ? (
              <Ban className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete this user? This action cannot be undone."
                )
              ) {
                console.log("Delete user:", user._id);
              }
            }}
            className="text-red-600 hover:text-red-900 p-1"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
