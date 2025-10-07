"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { getProducts } from "@/lib/api/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/api/products";
import { Product as UIProduct } from "@/app/types/products";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavoritePage() {
  const router = useRouter();

  // Fetch user profile to get favorites
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Filter products that are in favorites
  const favoriteProducts = products?.filter((product) =>
    user?.favorites.includes(product._id)
  );

  // Map API products to UI format
  const mappedProducts: UIProduct[] =
    favoriteProducts?.map((product: Product) => ({
      id: product._id,
      title: product.title,
      miniTitle: product.miniTitle,
      description: product.description,
      rating: product.rating,
      price: product.price,
      image: product.image.url,
      images: product.images.map((img) => img.url),
      features: product.features,
      sku: product.sku,
      category: product.category,
      isInFavorites: true,
      isInCart: user?.cart.includes(product._id) || false,
    })) || [];

  const isLoading = userLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Please log in
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your favorites
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

  if (mappedProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            No Favorites Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding products to your favorites by clicking the heart icon
            on any product!
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Favorites</h1>
          <p className="text-gray-600">
            You have {mappedProducts.length} favorite{" "}
            {mappedProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mappedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
