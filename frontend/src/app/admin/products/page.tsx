"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type Product } from "@/lib/api/products";
import { getUserProfile } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { Package, Edit, Trash2, Plus, Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AdminProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Check if user is admin
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // Fetch products
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const products = productData?.products || [];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (userLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
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
              Products Management
            </h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => router.push("/admin/products/new")}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
                <option value="beauty">Beauty</option>
                <option value="toys">Toys</option>
                <option value="automotive">Automotive</option>
                <option value="food">Food</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Products ({filteredProducts.length})
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <ProductRow key={product._id} product={product} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first product."}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button onClick={() => router.push("/admin/products/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Row Component
function ProductRow({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            <Image
              className="h-12 w-12 rounded-lg object-cover"
              src={product.image?.url || "/placeholder.png"}
              alt={product.title}
              width={48}
              height={48}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.title}
            </div>
            <div className="text-sm text-gray-500">{product.miniTitle}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {product.category || "uncategorized"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${product.price?.toFixed(2) || "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span
          className={`inline-flex items-center ${
            (product.stock || 0) <= 5 ? "text-red-600" : "text-green-600"
          }`}
        >
          {product.stock || 0}
          {(product.stock || 0) <= 5 && (
            <span className="ml-1 text-red-500">⚠️</span>
          )}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => router.push(`/products/${product._id}`)}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="View Product"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push(`/admin/products/${product._id}/edit`)}
            className="text-indigo-600 hover:text-indigo-900 p-1"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this product?")) {
                // Delete mutation will be implemented
                console.log("Delete product:", product._id);
              }
            }}
            className="text-red-600 hover:text-red-900 p-1"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
