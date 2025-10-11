"use client";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import React, { useState, useMemo } from "react";
import SearchProducts from "./SearchProducts";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { getUserProfile } from "@/lib/api/auth";

const HomeSection1 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Fetch user profile to get favorites and cart
  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: false,
  });

  // Filter products based on search, category, and price
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.miniTitle.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      // Price filter
      let matchesPrice = true;
      if (selectedPriceRange !== "all") {
        const price = product.price;
        switch (selectedPriceRange) {
          case "0-50":
            matchesPrice = price >= 0 && price <= 50;
            break;
          case "51-200":
            matchesPrice = price >= 51 && price <= 200;
            break;
          case "201-500":
            matchesPrice = price >= 201 && price <= 500;
            break;
          case "501-1000":
            matchesPrice = price >= 501 && price <= 1000;
            break;
          case "1000+":
            matchesPrice = price > 1000;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedPriceRange]);

  if (productsLoading) {
    return (
      <div className="space-y-7">
        <div>
          <SearchProducts
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
          />
        </div>
        <h1 className="text-3xl font-semibold">Products For You!</h1>
        <div className="flex flex-wrap gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <SearchProducts
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
        />
      </div>
      <h1 className="text-3xl font-semibold">
        {searchTerm
          ? `Search Results for "${searchTerm}"`
          : "Products For You!"}
      </h1>
      {filteredProducts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              title={product.title}
              miniTitle={product.miniTitle}
              rating={product.rating}
              price={product.price}
              image={product.image.url || ""}
              isInFavorites={user?.favorites.includes(product._id) || false}
              isInCart={
                user?.cart.some((item) =>
                  typeof item === "string"
                    ? item === product._id
                    : item.productId === product._id
                ) || false
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeSection1;
